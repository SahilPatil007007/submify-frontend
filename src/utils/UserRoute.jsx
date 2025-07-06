import { Navigate } from 'react-router-dom';
import { getAuth } from './auth';

const UserRoute = ({ children }) => {
  const { user } = getAuth();
  
  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => role.roleType === 'ADMIN');
  
  // If user is admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default UserRoute; 