import { useMutation } from '@tanstack/react-query';
import { signup as signupAPI } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';

const useSignUp = () => {
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupAPI,
    onSuccess: () => {
      alert('Signup successful');
      navigate('/signin');
    },
  });

  return { signup, isLoading };
};

export default useSignUp;
