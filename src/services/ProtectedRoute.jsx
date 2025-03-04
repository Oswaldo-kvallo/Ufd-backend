import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    // Si no hay un rol en localStorage, redirige a login
    return <Navigate to="/login" />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // Si el rol no coincide con el requerido, redirige a la página de login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
