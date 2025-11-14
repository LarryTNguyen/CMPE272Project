import { useEffect } from 'react';
import useGetPositions from '../../hooks/portfolio/useGetPositions';
import PositionItem from './PositionItem';

const Positions = () => {
  const { positions, isFetching } = useGetPositions();

  useEffect(() => {
    if (!isFetching && positions) {
      console.log(positions);
    }
  }, [positions, isFetching]);

  return (
    <div className="m-2 flex-col rounded-lg border">
      <h2 className="px-2 py-1 text-lg font-semibold">Current Positions</h2>
      <div className="mt-2 grid grid-cols-[10rem_8rem_11rem_11rem_11rem_11rem_11rem_12rem_10rem] items-center text-center font-semibold">
        <div>Ticker</div>
        <div>Quantity</div>
        <div>Average Price</div>
        <div>Current Price</div>
        <div>Total Cost</div>
        <div>Total Value</div>
        <div>Dollar Change ($)</div>
        <div>Percent Change (%) </div>
        <div></div>
      </div>
      <ul>
        {positions?.map((p) => (
          <PositionItem
            key={p.ticker}
            ticker={p.ticker}
            quantity={p.quantity}
            avg_price={p.avg_price}
            current_price={p.current_price}
            total_cost={p.total_cost}
            total_value={p.total_value}
            dollar_change={p.dollar_change}
            percent_change={p.percent_change}
          />
        ))}
      </ul>
    </div>
  );
};

export default Positions;
