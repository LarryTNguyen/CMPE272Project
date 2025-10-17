import { Link } from 'react-router-dom';
const Signin = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-1">
      <h1>Sign In Page</h1>
      <form>
        <div className="m-2 flex flex-col gap-1">
          <label>Email</label>
          <input
            type="email"
            className="flex flex-col gap-3 rounded-sm border border-black"
          />
        </div>
        <div className="m-2 flex flex-col gap-1">
          <label>password</label>
          <input
            type="password"
            className="flex flex-col gap-3 rounded-sm border border-black"
          />
        </div>
      </form>
      <div>
        <button className="rounded-lg bg-blue-600 px-5 py-1.5 duration-300 hover:bg-blue-800 hover:text-gray-50">
          Sign In
        </button>
      </div>
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
