import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../features/authentication/useUser';

const LOGIN_PATH = '/signin'; // <-- change if your login route is different

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isPending, isAuthenticated } = useUser();

  if (isPending) return null; // or a tiny spinner
  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }
  return children;
}
