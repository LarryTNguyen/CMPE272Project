import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSignUp from '../features/authentication/useSignUp';

const Signup = () => {
  const { signup } = useSignUp();
  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
  });

  const onSubmit = ({ username, email, password }) => {
    signup(
      { username, email, password },
      {
        onSettled: reset,
      },
    );
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-1">
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-2 flex flex-col gap-1">
          <label>Username</label>
          <input
            type="text"
            className="flex flex-col gap-3 rounded-sm border border-black"
            {...register('username', { required: 'This field is required' })}
          />
        </div>
        <div className="m-2 flex flex-col gap-1">
          <label>Email</label>
          <input
            type="email"
            className="flex flex-col gap-3 rounded-sm border border-black"
            {...register('email', { required: 'This field is required' })}
          />
        </div>
        <div className="m-2 flex flex-col gap-1">
          <label>password</label>
          <input
            type="password"
            className="flex flex-col gap-3 rounded-sm border border-black"
            {...register('password', { required: 'This field is required' })}
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-1.5 duration-300 hover:bg-blue-800 hover:text-gray-50"
          >
            Sign Up
          </button>
        </div>
      </form>
      <Link
        to="/signin"
        className="text-sm underline transition-colors duration-300 hover:text-green-500"
      >
        Sign In
      </Link>
    </div>
  );
};

export default Signup;
