import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, Target, Calendar, Loader, Play, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ExamsListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { session } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/exams`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      setExams(response.data.exams || []);
    } catch (err) {
      console.error('Fetch exams error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === 'all') return true;
    return exam.difficulty === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Exams</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Practice and track your progress
              </p>
            </div>
            <Link to="/exam/create" className="btn-primary flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New Exam
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-dark-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No exams found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all'
                ? 'Create your first exam to get started'
                : `No ${filter} difficulty exams found`}
            </p>
            <Link to="/exam/create" className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Exam
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="card hover:shadow-xl transition-shadow group">
                {/* Exam Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                      {exam.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  {exam.reviewers && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      📄 {exam.reviewers.file_name}
                    </p>
                  )}
                </div>

                {/* Exam Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{exam.total_questions} questions</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{exam.time_limit} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/exam/${exam.id}`}
                    className="flex-1 btn-primary flex items-center justify-center text-sm py-2"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Exam
                  </Link>
                  <Link
                    to={`/exam/${exam.id}/history`}
                    className="px-4 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors flex items-center"
                    title="View History"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {exams.length > 0 && (
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">{exams.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Exams</p>
            </div>
            <div className="card text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">
                {exams.filter(e => e.difficulty === 'easy').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Easy Level</p>
            </div>
            <div className="card text-center">
              <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">
                {exams.filter(e => e.difficulty === 'hard').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Hard Level</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsListPage;