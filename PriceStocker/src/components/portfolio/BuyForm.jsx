import { useForm } from 'react-hook-form';
import usePlaceBuyOrder from '../../hooks/portfolio/usePlaceBuyOrder';

const FormError = ({ message }) => {
  if (!message) return null;
  return <span className="text-xs text-red-500">{message}</span>;
};

const BuyForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { placeBuyOrder, isPending, error: mutationError } = usePlaceBuyOrder();

  const onSubmit = (formData) => {
    placeBuyOrder(formData, {
      onSuccess: () => {
        onClose(); // Only close on success
      },
    });
  };

  const { onChange: onTickerChange, ...tickerRegister } = register('ticker', {
    required: 'Ticker is required', // Add error messages
    maxLength: { value: 6, message: 'Max 6 chars' },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-80 flex-col gap-3 rounded-lg border p-4"
    >
      <h3 className="text-center text-lg font-semibold">Buy Order</h3>

      {mutationError && (
        <div className="rounded border border-red-500 bg-red-100 p-2 text-sm text-red-700">
          <strong>Order Failed:</strong> {mutationError.message}
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="ticker" className="mb-1 text-sm font-medium">
          Stock Ticker
        </label>
        <input
          id="ticker"
          type="text"
          className="rounded-lg border p-1"
          {...tickerRegister}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            onTickerChange(e);
          }}
          disabled={isPending}
        />
        <FormError message={errors.ticker?.message} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="quantity" className="mb-1 text-sm font-medium">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          step="1"
          className="rounded-lg border p-1"
          {...register('quantity', {
            required: 'Quantity is required',
            min: { value: 1, message: 'Min 1' },
            max: { value: 1500, message: 'Max 1500' },
            valueAsNumber: true,
          })}
          disabled={isPending}
        />
        <FormError message={errors.quantity?.message} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="limitPrice" className="mb-1 text-sm font-medium">
          Limit Price
        </label>
        <input
          id="limitPrice"
          type="number"
          step="0.01"
          className="rounded-lg border p-1"
          {...register('limitPrice', {
            required: 'Price is required',
            min: { value: 0.01, message: 'Min $0.01' },
            valueAsNumber: true,
          })}
          disabled={isPending}
        />
        <FormError message={errors.limitPrice?.message} />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-blue-400 p-2 text-sm transition-all duration-400 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        disabled={isPending}
      >
        {isPending ? 'Placing Order...' : 'Send Order'}
      </button>
    </form>
  );
};

export default BuyForm;
