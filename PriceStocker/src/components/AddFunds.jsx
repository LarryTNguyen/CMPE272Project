import { useForm } from 'react-hook-form';
import useAddFunds from '../features/portfolio/useAddFunds';

const AddFunds = () => {
  const { register, handleSubmit } = useForm();
  const { addFunds, isPending } = useAddFunds();

  const onSubmit = (data) => {
    // data -> { amount: '499' }
    addFunds(data.amount);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>$</label>
        <input
          type="number"
          className="rounded-sm border border-black"
          {...register('amount', {
            required: 'This field cannot be empty',
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: 'Amount must be greater than 0',
            },
          })}
        ></input>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-sm bg-blue-400 px-3 py-1 text-sm text-white"
      >
        Add
      </button>
    </form>
  );
};

export default AddFunds;
