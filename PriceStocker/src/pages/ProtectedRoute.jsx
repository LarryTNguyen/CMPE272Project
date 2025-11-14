import { useEffect } from 'react';
import { useUser } from '../features/authentication/useUser';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      navigate('/signin');
    }
  }, [navigate, isPending, isAuthenticated]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) return children;
};

export default ProtectedRoute;