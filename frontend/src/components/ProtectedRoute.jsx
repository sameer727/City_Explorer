import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route so only logged-in users can access it.
 * If requireAdmin is true, the user must also have isAdmin === true in their JWT.
 * Anyone who registered normally will always have isAdmin: false.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Logged in but not an admin — send to home instead of login
    return <Navigate to="/" replace />;
  }

  return children;
}
