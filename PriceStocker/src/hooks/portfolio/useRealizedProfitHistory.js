import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { getTransactions } from '../../services/apiUser';
import { getPositions } from '../../services/apiStock';

const useRealizedProfitHistory = (userId) => {
  return useQuery({
    queryKey: ['profit-history', userId],
    queryFn: async () => {
      const rawTransactions = await getTransactions(userId);
      const positions = await getPositions();
      console.log('RAW TRANSACTIONS: ', rawTransactions);
      console.log('Position: ', positions);

      if (!rawTransactions || rawTransactions.length === 0) {
        return [
          { date: 'Start', profit: 0, fullDate: new Date().toISOString() },
        ];
      }
      const transactions = [...rawTransactions].sort(
        (a, b) => parseISO(a.created_at) - parseISO(b.created_at),
      );

      let runningProfit = 0;
      const positionMap = {};
      positions.forEach((p) => {
        positionMap[p.ticker] = {
          ...p,
          avgCost: Number(p.avg_price),
          quantity: Number(p.quantity),
        };
      });

      const dailyProfitMap = new Map();

      transactions.forEach((t) => {
        const type = t.type ? t.type.toLowerCase() : 'unknown';
        const ticker = t.ticker;
        const qty = Number(t.quantity);
        const price = Number(t.price);
        const dateObj = parseISO(t.created_at);
        const dateKey = format(dateObj, 'yyyy-MM-dd');

        const position = positionMap[ticker];

        if (!position) return;

        if (type === 'sell') {
          const tradeProfit = (price - position.avgCost) * qty;
          runningProfit += tradeProfit;

          position.quantity -= qty;

          if (position.quantity <= 0.000001) {
            position.quantity = 0;
            position.avgCost = 0;
          }

          dailyProfitMap.set(dateKey, Number(runningProfit.toFixed(2)));
        }
      });

      const chartData = Array.from(dailyProfitMap, ([key, profit]) => ({
        date: format(parseISO(key), 'MMM dd'),
        fullDate: key,
        profit,
      }));

      if (chartData.length === 0) {
        return [{ date: 'Start', profit: 0 }];
      }

      chartData.unshift({ date: 'Start', profit: 0 });

      return chartData;
    },
    enabled: !!userId,
    staleTime: 0,
  });
};

export default useRealizedProfitHistory;
