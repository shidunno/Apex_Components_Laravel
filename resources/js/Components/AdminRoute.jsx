import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('apex_user') || '{}');
  
  // Check if the logged-in email is admin@gmail.com
  const isAdmin = user.email === 'admin@gmail.com' || user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}