import { useQuery } from '@tanstack/react-query';
import { getPositions as getPositionsAPI } from '../../services/apiStock';
const useGetPortfolio = () => {
  const {
    data: positions,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['positions'],
    queryFn: getPositionsAPI,
  });

  return { positions, isFetching, error };
};

export default useGetPortfolio;
