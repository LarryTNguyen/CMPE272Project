import { useEffect } from 'react';
import useGetPositions from '../../hooks/portfolio/useGetPositions';

export default function Positions({ onSell }) {
  const { positions, isFetching } = useGetPositions();

  useEffect(() => {
    if (!isFetching && positions) console.log(positions);
  }, [positions, isFetching]);

  // formatters
  const money = (n) =>
    n == null || Number.isNaN(Number(n))
      ? '—'
      : new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(Number(n));

  const num = (n, max = 4) =>
    n == null || Number.isNaN(Number(n))
      ? '—'
      : new Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(Number(n));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] table-auto text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold">Ticker</th>
            <th className="text-right py-3 px-4 font-semibold">Quantity</th>
            <th className="text-right py-3 px-4 font-semibold">Average Price</th>
            <th className="text-right py-3 px-4 font-semibold">Current Price</th>
            <th className="text-right py-3 px-4 font-semibold">Total Cost</th>
            <th className="text-right py-3 px-4 font-semibold">Total Value</th>
            <th className="text-right py-3 px-4 font-semibold">Dollar Change</th>
            <th className="text-right py-3 px-4 font-semibold">Percent Change</th>
            <th className="text-right py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 tabular-nums">
          {positions && positions.length > 0 ? (
            positions.map((p, i) => {
              // be resilient to field names
              const qty = Number(p.quantity ?? p.qty ?? 0);
              const avg = Number(p.avg_price ?? p.average_price ?? p.avg ?? 0);
              const cur = Number(p.current_price ?? p.price ?? avg ?? 0);
              const totalCost = Number(p.total_cost ?? qty * avg);
              const totalValue = Number(p.total_value ?? qty * cur);
              const diff = Number(p.dollar_change ?? totalValue - totalCost);
              const pct =
                p.percent_change != null
                  ? Number(p.percent_change)
                  : avg > 0
                  ? ((cur - avg) / avg) * 100
                  : 0;

              return (
                <tr key={p.id ?? `${p.ticker}-${i}`}>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {p.ticker}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{num(qty)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{money(avg)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{money(cur)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{money(totalCost)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{money(totalValue)}</td>
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap font-semibold ${
                      diff >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {money(diff)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap font-semibold ${
                      pct >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {(pct >= 0 ? '+' : '') + pct.toFixed(2) + '%'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
                      onClick={() => (onSell ? onSell(p) : console.log('Sell', p))}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-8 text-gray-500">
                {isFetching ? 'Loading positions…' : 'No positions yet. Buy stock to get started.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
