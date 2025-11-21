import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import useRealizedProfitHistory from '../../hooks/portfolio/useRealizedProfitHistory';

const ProfitAreaChart = ({ userId }) => {
  const { data, isLoading, error } = useRealizedProfitHistory(userId);

  if (isLoading)
    return <div className="h-80 animate-pulse rounded-xl bg-gray-100" />;
  if (error) return <div className="text-red-500">Error loading chart</div>;

  const currentTotal =
    data && data.length > 0 ? data[data.length - 1].profit : 0;
  const isProfit = currentTotal >= 0;
  const color = isProfit ? '#10b981' : '#ef4444';

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Realized P/L Over Time
        </h2>
        <span
          className={`font-mono text-2xl font-bold ${
            isProfit ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isProfit ? '+' : ''}${currentTotal.toFixed(2)}
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f3f4f6"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              minTickGap={40}
            />

            <YAxis
              tickFormatter={(val) => `$${val}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              width={60}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`$${value}`, 'Net Profit']}
              labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
            />

            <Area
              type="monotone"
              dataKey="profit"
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitAreaChart;
