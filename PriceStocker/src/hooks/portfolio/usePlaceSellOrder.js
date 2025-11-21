import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeSellOrder as placeSellOrderAPI } from '../../services/apiStock';

const usePlaceSellOrder = () => {
  const queryClient = useQueryClient();
  const {
    mutate: placeSellOrder,
    isPending: isProcessingOrder,
    error,
  } = useMutation({
    mutationFn: placeSellOrderAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['profit-history'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      if (data.status === 'pending') {
        queryClient.invalidateQueries({ queryKey: ['pending_orders'] });
      }
      console.log('Order Status: ', data.status);
    },
    onError: (error) => {
      console.error('Order failed: ', error.message);
    },
  });

  return { placeSellOrder, isProcessingOrder, error };
};

export default usePlaceSellOrder;
