import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFunds as addFundsAPI } from '../../services/apiUser';

const useAddFunds = () => {
  const queryClient = useQueryClient();
  const { mutate: addFunds, isPending } = useMutation({
    mutationFn: addFundsAPI,
    onSuccess: () => {
      alert('Funds added successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return { addFunds, isPending };
};

export default useAddFunds;
