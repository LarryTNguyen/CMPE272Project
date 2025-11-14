import { Link } from 'react-router-dom';
import useSignIn from '../hooks/authentication/useSignIn';
import { useForm } from 'react-hook-form';

const Signin = () => {
  const { signin } = useSignIn();
  const { register, handleSubmit } = useForm();

  const onSubmit = ({ email, password }) => {
    signin({ email, password });
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-1">
      <h1>Sign In Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-2 flex flex-col gap-1">
          <label>Email</label>
          <input
            type="email"
            className="flex flex-col gap-3 rounded-sm border border-black"
            {...register('email', { required: 'This field is required ' })}
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
        <div className="flex justify-center">
          <button
            className="rounded-lg bg-blue-600 px-5 py-1.5 duration-300 hover:bg-blue-800 hover:text-gray-50"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>

      <Link
        to="/signup"
        className="text-sm underline transition-colors duration-300 hover:text-green-500"
      >
        Create an account
      </Link>
    </div>
  );
};

export default Signin;
