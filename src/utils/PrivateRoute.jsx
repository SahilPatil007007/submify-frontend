import { Navigate } from 'react-router-dom';
import { getAuth } from './auth';

const PrivateRoute = ({ children }) => {
  const { token } = getAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;