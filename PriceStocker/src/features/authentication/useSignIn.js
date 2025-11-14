import { signin as signinAPI } from '../../services/apiAuth';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useSignIn = () => {

  const navigate = useNavigate();
  const { mutate: signin, isLoading } = useMutation({
    mutationFn: signinAPI,
    onSuccess: () => {
      // alert('Sign In successful!');
      navigate('/dashboard');
    },
  });

  return { signin, isLoading };
};

export default useSignIn;
