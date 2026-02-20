import { useAuth } from '../Utils/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  console.log("RequireAuth user:", user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}