import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UploadReviewerPage from './pages/dashboard/UploadReviewerPage';
import CreateExamPage from './pages/exam/CreateExamPage';
import ExamsListPage from './pages/exam/ExamsListPage';
import ExamPage from './pages/exam/ExamPage';
import ResultsPage from './pages/exam/ResultsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadReviewerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <ExamsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/create"
              element={
                <ProtectedRoute>
                  <CreateExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/:id"
              element={
                <ProtectedRoute>
                  <ExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/:id/results/:attemptId"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes */}
            <Route path="/profile" element={<ProtectedRoute><div className="pt-20 text-center">Profile Page (Coming Soon)</div></ProtectedRoute>} />
            <Route path="/premium" element={<div className="pt-20 text-center">Premium Page (Coming Soon)</div>} />

            {/* 404 */}
            <Route path="*" element={<div className="pt-20 text-center"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;