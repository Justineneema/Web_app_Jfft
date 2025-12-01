// components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedAccountTypes = [] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  if (allowedAccountTypes.length > 0 && !allowedAccountTypes.includes(user.accountType)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}