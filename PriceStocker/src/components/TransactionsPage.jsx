// src/pages/TransactionsPage.jsx
import { useEffect, useState } from "react";
import supabase from '../services/superbase';

const PAGE_SIZE = 200;

export default function TransactionsPage({ user }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  async function fetchPage(p = 0) {
    setLoading(true);
    try {
      let q = supabase
        .from("transactions")
        .select("ticker,type,quantity,price,created_at", { count: "exact" })
        .order("created_at", { ascending: false });

      if (ticker) q = q.eq("ticker", ticker);
      if (type) q = q.eq("type", type);
      if (start) q = q.gte("created_at", new Date(start).toISOString());
      if (end) q = q.lte("created_at", new Date(end + "T23:59:59").toISOString());

      const from = p * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count, error } = await q.range(from, to);
      if (error) throw error;
      setRows(data ?? []);
      setTotal(count ?? 0);
      setPage(p);
    } catch (e) {
      console.error(e);
      alert("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-sm mb-1">Ticker</label>
              <input
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. BTC-USD"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.trim())}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All</option>
                <option value="buy">buy</option>
                <option value="sell">sell</option>
                <option value="deposit">deposit</option>
                <option value="withdrawal">withdrawal</option>
                <option value="fee">fee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Start date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPage(0)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all w-full"
                disabled={loading}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-0 shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Ticker</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-right p-3">Qty</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">Notional</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">{r.ticker}</td>
                    <td className="p-3">{r.type}</td>
                    <td className="p-3 text-right">{r.quantity}</td>
                    <td className="p-3 text-right">{r.price}</td>
                    <td className="p-3 text-right">
                      {r.quantity != null && r.price != null
                        ? (Number(r.quantity) * Number(r.price)).toFixed(2)
                        : ""}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-3">
            <span className="text-sm text-gray-600">
              Page {page + 1} of {Math.max(1, Math.ceil(total / PAGE_SIZE))} • {total} total
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50"
                disabled={page === 0 || loading}
                onClick={() => fetchPage(page - 1)}
              >
                Prev
              </button>
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50"
                disabled={page >= totalPages - 1 || loading}
                onClick={() => fetchPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
