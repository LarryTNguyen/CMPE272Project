import ProfitAreaChart from '../components/portfolio/ProfitAreaChart';
import UserName from '../components/UserName';
import { useUser } from '../hooks/authentication/useUser';
const Home = () => {
  const { user } = useUser();
  const { full_name } = user.user_metadata;

  return (
    <div>
      <UserName fullName={full_name} />
      <ProfitAreaChart userId={user.id} />
    </div>
  );
};

export default Home;
