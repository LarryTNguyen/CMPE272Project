import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeBuyOrder as placeBuyOrderAPI } from '../../services/apiStock';

const usePlaceBuyOrder = () => {
  const queryClient = useQueryClient();

  const { mutate: placeBuyOrder, isPending: isProcessingOrder } = useMutation({
    mutationFn: placeBuyOrderAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      if (data.status === 'pending') {
        queryClient.invalidateQueries({ queryKey: ['pending_orders'] });
      }
      console.log('Order Status: ', data.status);
    },
    onError: (err) => {
      console.error('Order failed: ', err.message);
    },
  });

  return { placeBuyOrder, isProcessingOrder };
};

export default usePlaceBuyOrder;
