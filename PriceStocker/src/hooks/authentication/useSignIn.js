import { useNavigate } from 'react-router-dom';
import { signin as signinAPI } from '../../services/apiAuth';
import { useMutation } from '@tanstack/react-query';

const useSignIn = () => {
  const navigate = useNavigate();
  const { mutate: signin, isLoading } = useMutation({
    mutationFn: signinAPI,
    onSuccess: () => {
      alert('Sign in Successful');
      navigate('/home');
    },
  });

  return { signin, isLoading };
};

export default useSignIn;
