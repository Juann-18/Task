// PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;