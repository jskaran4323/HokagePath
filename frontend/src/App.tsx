import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './composables/useAuth';
import Layout from './components/layout/Layout';

import ProtectedRoute from './components/common/ProtectedRoutes';
// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashBoardPage';

// Create a wrapper component that uses useAuth inside Router
const AppContent = () => {
  const { fetchUserProfile } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
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