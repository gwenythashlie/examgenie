import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Award, 
  Clock,
  Plus,
  BookOpen,
  Target,
  Calendar,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, session } = useAuth();
  const [exams, setExams] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    try {
      setLoading(true);
      const [examsRes, reviewersRes] = await Promise.all([
        api.get('/exams'),
        api.get('/reviewers'),
      ]);
      setExams(examsRes.data?.exams || []);
      setReviewers(reviewersRes.data?.reviewers || []);
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = {
    totalExams: exams.length,
    averageScore: exams.length ? Math.round(exams.reduce((acc, e) => acc + (e.average_score || 0), 0) / exams.length) : 0,
    studyTime: 'n/a',
    improvements: '+',
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="card max-w-xl w-full text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{error}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Check that the API server is running and Supabase tables exist.</p>
          <button onClick={fetchData} className="btn-primary inline-flex items-center justify-center">
            <RefreshCcw className="h-5 w-5 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your learning progress overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalExams}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Exams</p>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {stats.improvements}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.averageScore}%</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Average Score</p>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                This week
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.studyTime}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Study Time</p>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Trending up
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">Level</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Keep learning</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/upload" className="card bg-gradient-to-br from-primary-500 to-purple-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Upload New Reviewer</h3>
                <p className="text-white/90 mb-4">
                  Start by uploading your study materials to generate practice exams
                </p>
                <div className="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload PDF
                </div>
              </div>
              <BookOpen className="h-16 w-16 text-white/20" />
            </div>
          </Link>

          <Link to="/exam/create" className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Take Practice Exam</h3>
                <p className="text-white/90 mb-4">
                  Test your knowledge with AI-generated questions from your materials
                </p>
                <div className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Start Exam
                </div>
              </div>
              <Award className="h-16 w-16 text-white/20" />
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Exams</h2>
              <Link to="/exams" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {exams.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No exams yet. Create one to get started.
                </div>
              )}
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{exam.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700">
                      {exam.total_questions || 0} questions
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : '---'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.time_limit || 0} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Reviewers</h2>
              <Link to="/upload" className="btn-primary flex items-center text-sm">
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </Link>
            </div>
            <div className="space-y-4">
              {reviewers.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No reviewers yet. Upload a PDF to get started.
                </div>
              )}
              {reviewers.map((reviewer) => (
                <div
                  key={reviewer.id}
                  className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{reviewer.file_name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {reviewer.created_at ? new Date(reviewer.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{reviewer.file_url}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
