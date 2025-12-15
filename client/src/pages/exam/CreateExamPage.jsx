import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, Clock, Target, Zap, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CreateExamPage = () => {
  const [searchParams] = useSearchParams();
  const reviewerId = searchParams.get('reviewerId');
  
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    reviewerId: reviewerId || '',
    title: '',
    difficulty: 'medium',
    totalQuestions: 10,
    timeLimit: 30,
  });

  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviewers`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      setReviewers(response.data.reviewers || []);
    } catch (err) {
      console.error('Fetch reviewers error:', err);
      setError('Failed to load reviewers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.reviewerId) {
      setError('Please select a reviewer');
      return;
    }

    if (!formData.title) {
      setError('Please enter an exam title');
      return;
    }

    setGenerating(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/exams/generate`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.data.exam) {
        navigate(`/exam/${response.data.exam.id}`);
      }
    } catch (err) {
      console.error('Generate exam error:', err);
      setError(err.response?.data?.error || 'Failed to generate exam. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Practice Exam</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your exam settings and let AI generate questions
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Reviewer */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Study Material *
              </label>
              <select
                name="reviewerId"
                value={formData.reviewerId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a reviewer...</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.file_name}
                  </option>
                ))}
              </select>
              {reviewers.length === 0 && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  No reviewers found. Please upload a PDF first.
                </p>
              )}
            </div>

            {/* Exam Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Chapter 5 Practice Test"
                required
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.difficulty === level
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-dark-700 hover:border-primary-400'
                    }`}
                  >
                    <Target className={`h-6 w-6 mx-auto mb-2 ${
                      formData.difficulty === level
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400'
                    }`} />
                    <p className="font-medium capitalize">{level}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Questions: {formData.totalQuestions}
              </label>
              <input
                type="range"
                name="totalQuestions"
                min="5"
                max="50"
                step="5"
                value={formData.totalQuestions}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Limit: {formData.timeLimit} minutes
              </label>
              <input
                type="range"
                name="timeLimit"
                min="10"
                max="120"
                step="5"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>10 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 text-primary-600 mr-2" />
                What you'll get:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI-generated questions based on your material</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Multiple choice & true/false questions</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instant grading with explanations</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detailed performance analytics</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={generating || reviewers.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {generating ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Generating exam with AI...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Exam
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;