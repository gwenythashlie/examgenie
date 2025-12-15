const express = require('express');
const { randomUUID } = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('../config/supabase');
const { extractTextFromPdf } = require('../utils/pdfProcessor');

const router = express.Router();
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const stripJson = (text) => {
  if (!text) return null;
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const buildQuestions = (count) => {
  const questions = [];
  for (let i = 0; i < count; i += 1) {
    const correctAnswer = 'Option A';
    questions.push({
      id: randomUUID(),
      question_text: `Sample question ${i + 1}?`,
      question_type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: correctAnswer,
    });
  }
  return questions;
};

const normalizeQuestions = (items = [], fallbackCount = 10) => {
  const normalized = [];
  items.forEach((q, idx) => {
    if (!q) return;
    const opts = Array.isArray(q.options) && q.options.length >= 2
      ? q.options.slice(0, 4)
      : ['Option A', 'Option B', 'Option C', 'Option D'];
    normalized.push({
      id: q.id || randomUUID(),
      question_text: q.question_text || q.question || `Question ${idx + 1}?`,
      question_type: 'multiple_choice',
      options: opts,
      correct_answer: q.correct_answer || opts[0],
    });
  });
  return normalized.length ? normalized.slice(0, fallbackCount) : buildQuestions(fallbackCount);
};

const generateQuestionsWithGemini = async (text, count) => {
  if (!genAI || !text) return null;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate ${count} multiple-choice questions from the provided study material. Return JSON ONLY as an array of objects like [{"question_text":"...","options":["A","B","C","D"],"correct_answer":"A"}]. Keep answers concise.`;
    const result = await model.generateContent([{ text: prompt }, { text }]);
    const raw = result?.response?.text?.() || '';
    const parsed = stripJson(raw);
    if (!parsed) return null;
    return normalizeQuestions(parsed, count);
  } catch (err) {
    console.error('Gemini generation failed, falling back to sample questions:', err.message);
    return null;
  }
};

router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('exams')
    .select('id, reviewer_id, title, difficulty, total_questions, time_limit, created_at');

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch exams', detail: error.message, hint: 'Ensure table "exams" exists.' });
  }

  res.json({ exams: data || [] });
});

router.post('/generate', async (req, res) => {
  const { reviewerId, title, difficulty = 'medium', totalQuestions = 10, timeLimit = 30 } = req.body || {};

  if (!reviewerId || !title) {
    return res.status(400).json({ error: 'Missing reviewerId or title' });
  }

  const { data: reviewer, error: reviewerError } = await supabase
    .from('reviewers')
    .select('id, file_path')
    .eq('id', reviewerId)
    .single();

  if (reviewerError || !reviewer) {
    return res.status(404).json({ error: 'Reviewer not found', detail: reviewerError?.message });
  }

  let questions = buildQuestions(Number(totalQuestions));

  try {
    const text = await extractTextFromPdf(reviewer.file_path);
    const aiQuestions = await generateQuestionsWithGemini(text, Number(totalQuestions));
    if (aiQuestions?.length) {
      questions = aiQuestions;
    }
  } catch (err) {
    console.error('Question generation fallback (sample questions):', err.message);
  }

  const { data, error } = await supabase
    .from('exams')
    .insert({
      reviewer_id: reviewerId,
      title,
      difficulty,
      total_questions: Number(totalQuestions),
      time_limit: Number(timeLimit),
      questions,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create exam', detail: error.message, hint: 'Ensure table "exams" exists with columns (reviewer_id, title, difficulty, total_questions, time_limit, questions jsonb)' });
  }

  res.status(201).json({ exam: data });
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Exam not found', detail: error?.message });
  }

  res.json({ exam: data });
});

router.post('/:id/submit', async (req, res) => {
  const { answers = {}, timeTaken = 0 } = req.body || {};

  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (examError || !exam) {
    return res.status(404).json({ error: 'Exam not found', detail: examError?.message });
  }

  let correctCount = 0;
  const answerMap = {};

  (exam.questions || []).forEach((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_answer;
    if (isCorrect) correctCount += 1;
    answerMap[q.id] = {
      userAnswer: userAnswer || null,
      correctAnswer: q.correct_answer,
      isCorrect,
      explanation: 'Generated placeholder explanation.',
    };
  });

  const score = exam.questions?.length ? (correctCount / exam.questions.length) * 100 : 0;

  const { data: attempt, error: attemptError } = await supabase
    .from('exam_attempts')
    .insert({
      exam_id: exam.id,
      score,
      time_taken: Number(timeTaken),
      answers: answerMap,
    })
    .select()
    .single();

  if (attemptError) {
    return res.status(500).json({ error: 'Failed to save attempt', detail: attemptError.message, hint: 'Ensure table "exam_attempts" exists with columns (exam_id, score, time_taken, answers jsonb)' });
  }

  res.status(201).json({ attempt });
});

router.get('/:id/attempts', async (req, res) => {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('exam_id', req.params.id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch attempts', detail: error.message, hint: 'Ensure table "exam_attempts" exists.' });
  }

  res.json({ attempts: data || [] });
});

module.exports = router;
