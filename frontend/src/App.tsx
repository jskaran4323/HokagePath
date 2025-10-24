import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './composables/useAuth';
import Layout from './components/layout/Layout';

import ProtectedRoute from './components/common/ProtectedRoutes';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashBoardPage';
import UpdateFitnessProfile from './pages/Profile/FitnessProfileSetup';
import FitnessProfilePage from './pages/Profile/FitnessProfilePage';
import GenerateWorkout from './pages/workout/generateWorkout';
import WorkoutDetail from './pages/workout/workoutDetails';
import WorkoutList from './pages/workout/workoutList';

// 404 Not Found Page
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >  Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { fetchUserProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    
    if (!['/login', '/register'].includes(location.pathname)) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile/fitness-setup"
        element={
          <ProtectedRoute>
            <Layout>
              <UpdateFitnessProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <FitnessProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts/generate"
        element={
          <ProtectedRoute>
            <Layout>
              <GenerateWorkout />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ✅ Catch-all 404 route - MUST be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;