import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signout as signoutAPI } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';

const useSignout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signout, isPending } = useMutation({
    mutationFn: signoutAPI,
    onSuccess: () => {
      queryClient.removeQueries();
      alert('Sign out successful!');
      navigate('/signin', { replace: true });
    },
  });

  return { signout, isPending };
};

export default useSignout;
