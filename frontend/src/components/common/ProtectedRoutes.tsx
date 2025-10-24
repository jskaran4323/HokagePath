import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../composables/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner or message while auth status is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // If user not authenticated, redirect to login and remember where they came from
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated users can access protected content
  return <>{children}</>;
};

export default ProtectedRoute;
