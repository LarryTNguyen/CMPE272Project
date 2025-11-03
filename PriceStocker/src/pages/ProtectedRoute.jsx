import { Children, useEffect } from 'react';
import { useUser } from '../features/authentication/useUser';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { isPending, isAuthenicated } = useUser();

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenicated) navigate('/signin');
  }, [navigate, isPending, isAuthenicated]);

  if (isPending) {
    <div>Loading...</div>;
  }

  if (isAuthenicated) return children;
};

export default ProtectedRoute;
