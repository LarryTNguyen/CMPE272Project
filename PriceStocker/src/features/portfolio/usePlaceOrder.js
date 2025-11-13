import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeOrder as placeOrderAPI } from '../../services/apiStock';

const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  const { mutate: placeOrder, isPending: isProcessingOrder } = useMutation({
    mutationFn: placeOrderAPI,
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

  return { placeOrder, isProcessingOrder };
};

export default usePlaceOrder;
