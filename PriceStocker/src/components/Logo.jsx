import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="text-white duration-350 hover:text-gray-400">
      <Link to="/home">PriceStocker</Link>
    </div>
  );
};

export default Logo;
