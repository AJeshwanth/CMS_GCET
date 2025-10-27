import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("user");
  const role = localStorage.getItem("role"); // "admin", "department", "user"
  const location = useLocation();

  // If not logged in
  if (!username) {
    return <Navigate to="/login" replace />;
  }

  const roleAccess = {
    admin: ["/admin", "/new-complaint"],          
    user: ["/user", "/new-complaint"],           
    department: ["/department", "/new-complaint"] 
  };

  // Allow access if the current path is in the allowed paths for the role
  const allowedPaths = roleAccess[role] || [];
  const pathAllowed = allowedPaths.some(p => location.pathname.startsWith(p));

  if (!pathAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
