import { useForm } from 'react-hook-form';
import usePlaceBuyOrder from '../../hooks/portfolio/usePlaceBuyOrder';
const OrderForm = () => {
  const {
    register,
    handleSubmit,
    // formState: { error },
  } = useForm();

  const { placeBuyOrder } = usePlaceBuyOrder();

  const onSubmit = ({ ticker, quantity, limitPrice }) => {
    placeBuyOrder({ ticker, quantity, limitPrice });
  };

  const { onChange: onTickerChange, ...tickerRegister } = register('ticker', {
    required: true,
    maxLength: 6,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Stock Ticker</label>
        <input
          type="text"
          className="m-3 border-1"
          {...tickerRegister}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            onTickerChange(e);
          }}
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="number"
          className="m-3 border-1"
          {...register('quantity', {
            required: true,
            min: 1,
            max: 1500,
          })}
        />
      </div>
      <div>
        <label>Limit Price</label>
        <input
          type="number"
          className="m-3 border-1"
          {...register('limitPrice', {
            required: true,
            min: 1,
          })}
        />
      </div>
      <button type="submit" className="rounded bg-blue-300 p-2">
        Send Order
      </button>
    </form>
  );
};

export default OrderForm;
