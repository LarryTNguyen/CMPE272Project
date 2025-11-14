import { useEffect } from 'react';
import { useUser } from '../hooks/authentication/useUser';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      navigate('/signin', { replace: true });
    }
  }, [navigate, isPending, isAuthenticated]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) return children;
};

export default ProtectedRoute;
