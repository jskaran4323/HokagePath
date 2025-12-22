import { Routes, Route, Navigate } from 'react-router-dom';  
import Layout from '../components/layout/Layout';  
import ProtectedRoute from '../components/common/ProtectedRoutes';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashBoardPage';
import UpdateFitnessProfile from '../pages/Profile/FitnessProfileSetup';
import FitnessProfilePage from '../pages/Profile/FitnessProfilePage';
import GenerateWorkout from '../pages/workout/generateWorkout';
import WorkoutDetail from '../pages/workout/workoutDetails';
import WorkoutList from '../pages/workout/workoutList';
import MealList from '../pages/meals/MealList';
import GenerateMeal from '../pages/meals/GenerateMeal';
import MealDetail from '../pages/meals/MealDetails';
import FeedPage from '../pages/feed/FeedPage';
import UserProfilePage from '../pages/Profile/UserProfilePage';
import NotFoundPage from './NotfoundPage';
import WorkoutSession from '../pages/workout/workoutSession';
import SearchPage from '../pages/searchPage/searchPage';
import LandingPage from '../pages/Dashboard/LandingPage';
import { useAuthStore } from '../store/authStore';



const AppRoutes = () => {
 const isAuthenticated = useAuthStore();
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
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
        path="/fitness-profile"
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

      <Route
        path="/meals"
        element={
          <ProtectedRoute>
            <Layout>
              <MealList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/meals/generate"
        element={
          <ProtectedRoute>
            <Layout>
              <GenerateMeal />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/meals/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <MealDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Layout>
              <FeedPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <Layout>
              <UserProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

     <Route
        path="/workout/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutSession />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Layout>
              <SearchPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
      path="/" 
      element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
