import { getCurrentUser } from '../../services/apiAuth';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const { isPending, data } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  const user = data?.user ?? null;
  console.log('User from useUser', user);

  return {
    user,
    isPending,
    isAuthenticated: user?.role === 'authenticated',
  };
};
