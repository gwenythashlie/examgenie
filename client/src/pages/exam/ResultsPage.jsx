import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, Clock, CheckCircle, XCircle, Loader, Home, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ResultsPage = () => {
  const { id, attemptId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [id, attemptId]);

  const fetchResults = async () => {
    try {
      const [examResponse, attemptResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/exams/${id}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/exams/${id}/attempts`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        }),
      ]);

      setExam(examResponse.data.exam);
      const foundAttempt = attemptResponse.data.attempts.find(a => a.id === attemptId);
      setAttempt(foundAttempt);
    } catch (err) {
      console.error('Fetch results error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '🌟';
    if (score >= 70) return '👍';
    if (score >= 60) return '💪';
    return '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!exam || !attempt) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Results not found</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = Math.round(attempt.score);
  const correctCount = Object.values(attempt.answers).filter(a => a.isCorrect).length;
  const totalQuestions = exam.questions.length;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="card mb-6 text-center">
          <div className="text-6xl mb-4">{getScoreEmoji(score)}</div>
          <h1 className="text-4xl font-bold mb-2">
            <span className={getScoreColor(score)}>{score}%</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{correctCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalQuestions - correctCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatTime(attempt.time_taken)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/exam/create?reviewerId=${exam.reviewer_id}`)}
              className="btn-primary flex items-center justify-center"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake Exam
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Toggle Answers Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full btn-outline"
          >
            {showAnswers ? 'Hide' : 'Show'} Detailed Answers
          </button>
        </div>

        {/* Detailed Answers */}
        {showAnswers && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Answers</h2>
            {exam.questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div key={question.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Question {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold mt-1">{question.question_text}</h3>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* User Answer */}
                  <div className={`p-4 rounded-lg mb-3 ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <p className="text-sm font-medium mb-1">Your Answer:</p>
                    <p className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {userAnswer?.userAnswer || 'Not answered'}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  {!isCorrect && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-1">Correct Answer:</p>
                      <p className="text-green-700 dark:text-green-400">
                        {userAnswer?.correctAnswer}
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {userAnswer?.explanation && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium mb-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Explanation:
                      </p>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">
                        {userAnswer.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Performance Tips */}
        <div className="card mt-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 text-primary-600 mr-2" />
            Performance Tips
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {score >= 80 ? (
              <>
                <p>✓ Excellent work! You've mastered this material.</p>
                <p>✓ Try harder difficulty for more challenge.</p>
                <p>✓ Help others by sharing your study techniques.</p>
              </>
            ) : score >= 60 ? (
              <>
                <p>• Good effort! Review the incorrect answers above.</p>
                <p>• Focus on areas where you struggled.</p>
                <p>• Retake the exam after studying those topics.</p>
              </>
            ) : (
              <>
                <p>• Don't worry, practice makes perfect!</p>
                <p>• Review your study materials carefully.</p>
                <p>• Take notes on the explanations provided.</p>
                <p>• Try the exam again after more preparation.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;