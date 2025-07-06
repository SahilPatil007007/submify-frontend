import { Navigate } from 'react-router-dom';
import { getAuth } from './auth';

const AdminRoute = ({ children }) => {
  const { user } = getAuth();
  
  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => role.roleType === 'ADMIN');
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute; 