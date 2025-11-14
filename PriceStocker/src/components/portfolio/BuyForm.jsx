import { useForm } from 'react-hook-form';
import usePlaceBuyOrder from '../../hooks/portfolio/usePlaceBuyOrder';
const BuyForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    // formState: { error },
  } = useForm();

  const { placeBuyOrder } = usePlaceBuyOrder();

  const onSubmit = ({ ticker, quantity, limitPrice }) => {
    placeBuyOrder({ ticker, quantity, limitPrice });
    onClose();
  };

  const { onChange: onTickerChange, ...tickerRegister } = register('ticker', {
    required: true,
    maxLength: 6,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-xs flex-col items-center gap-2 rounded-lg border p-4"
    >
      <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
        <label>Stock Ticker</label>
        <input
          type="text"
          className="m-3 rounded-lg border p-1"
          {...tickerRegister}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            onTickerChange(e);
          }}
        />
      </div>
      <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
        <label>Quantity</label>
        <input
          type="number"
          className="m-3 rounded-lg border p-1"
          {...register('quantity', {
            required: true,
            min: 1,
            max: 1500,
          })}
        />
      </div>
      <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
        <label>Limit Price</label>
        <input
          type="number"
          className="m-3 rounded-lg border p-1"
          {...register('limitPrice', {
            required: true,
            min: 1,
          })}
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-blue-400 p-2 text-sm transition-all duration-400 hover:bg-blue-600"
      >
        Send Order
      </button>
    </form>
  );
};

export default BuyForm;
