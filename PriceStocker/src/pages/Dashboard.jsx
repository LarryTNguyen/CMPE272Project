import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TotalProgress from "../components/TotalProgress";
import TotalAsset from "../components/TotalAsset";
import AddNew from "../components/AddNew";
import AddNewWatchlist from "../components/AddNewWatchlist";
import AddWatchlist from "../components/AddWatchlist";
import TotalCash from "../components/TotalCash";
import AddAssetModal from "../components/AddAssetModal";
import ActiveTradesCard from "../components/ActiveTradeCard";
import LiveStockCard from "../components/LiveStockCard";
import tickersData from "../data/tickers.json";
import supabase from "../services/superbase";
import usePositions2 from "../hooks/usePositions2";

const CACHE_KEY = "home_summary_v1";
const MAX_AGE_MS = 60_000;

export default function Dashboard() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      return cached?.data ?? null;
    } catch {
      return null;
    }
  });
  const [updating, setUpdating] = useState(false);
  const [err, setErr] = useState(null);

  const [open, setOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [symbols, setSymbols] = useState(["AAPL", "MSFT", "TSLA"]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const TICKERS = tickersData.map((item) => item.ticker);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (mounted) setSession(s ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  async function fetchWatchlist(userId) {
    const { data: rows, error } = await supabase
      .from("watchlist")
      .select("ticker")
      .eq("user_id", userId);

    if (!error && rows) setSymbols(rows.map((r) => r.ticker));
  }

  async function revalidateSummary() {
    setUpdating(true);
    setErr(null);
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { ts } = JSON.parse(raw);
        if (ts && Date.now() - ts < MAX_AGE_MS) {
          setUpdating(false);
          return;
        }
      }

      const { data, error } = await supabase.rpc("get_home_summary");
      if (error) throw error;

      const row = data?.[0] ?? null;
      setSummary(row);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: row }));
    } catch (e) {
      console.error("get_home_summary error:", e);
      setErr(e);
    } finally {
      setUpdating(false);
    }
  }

  const initializedForUser = useRef(null);
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    if (initializedForUser.current === userId) return;
    initializedForUser.current = userId;

    fetchWatchlist(userId);
    revalidateSummary();
  }, [session?.user?.id]);

  const add = async () => {
    const s = input.toUpperCase().trim();
    if (!s || symbols.includes(s) || !session?.user?.id) return;

    const { error } = await supabase.from("watchlist").insert([
      { ticker: s, watch_price: 0, user_id: session.user.id }
    ]);
    if (!error) {
      setSymbols((prev) => [...prev, s]);
      setInput("");
    } else {
      console.error("watchlist insert error:", error);
    }
  };

  const handleDeleteFromUI = (ticker) => {
    setSymbols((prev) => prev.filter((x) => x !== ticker));
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
    setSuggestions(value ? TICKERS.filter((t) => t.startsWith(value)).slice(0, 6) : []);
  };

  const handleSelect = (symbol) => {
    setInput(symbol);
    setSuggestions([]);
  };

  const userId = session?.user?.id ?? null;
  const { data: trades, loading, error, refresh } = usePositions2(userId);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          
          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              Error: {String(err?.message || err?.error_description || err?.hint || 'Unknown')}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <AddNew onClick={() => setOpen(true)} />
            <AddNewWatchlist onClick={() => setWatchlistOpen(true)} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <TotalAsset summary={summary} updating={updating} err={err} />
          <TotalCash summary={summary} updating={updating} err={err} />
          <TotalProgress summary={summary} updating={updating} err={err} />
        </div>

        {/* Active Trades Section */}
        <div className="mb-6">
          <ActiveTradesCard trades={trades} onClosed={refresh} />
        </div>

        {/* Watch List Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch List</h2>

          <div className="relative mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  placeholder="Add symbol e.g. NVDA"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s}
                        onClick={() => handleSelect(s)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <button
                onClick={add}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {symbols.map((s) => (
              <LiveStockCard key={s} symbol={s} onDelete={handleDeleteFromUI} userId={userId} />
            ))}
          </div>
        </div>

        {/* Modals */}
        <AddAssetModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={() => {}}
          symbols={["BTCUSDT", "ETHUSDT", "SOLUSDT"]}
          navigate={navigate}
        />

        <AddWatchlist
          open={watchlistOpen}
          onClose={() => setWatchlistOpen(false)}
          onSubmit={() => fetchWatchlist(userId)}
          symbols={["BTCUSDT", "ETHUSDT", "SOLUSDT"]}
          navigate={navigate}
        />
      </div>
    </main>
  );
}