import Logo from './Logo';
import { Link } from 'react-router-dom';
import useSignout from '../hooks/authentication/useSignOut';
const Navbar = () => {
  const { signout } = useSignout();
  return (
    <div className="bg- flex justify-between rounded-b-sm bg-gray-600 px-3 py-4">
      <Logo />
      <div className="flex justify-evenly gap-5">
        <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
          <Link to="/dashboard">Dashboard</Link>
        </button>
        <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
          Profile
        </button>
        <button
          className="text-gray-50 transition-all duration-300 hover:text-gray-400"
          onClick={signout}
        >
          Signout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
