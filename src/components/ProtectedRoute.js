import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredPermissions = [] }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute; 