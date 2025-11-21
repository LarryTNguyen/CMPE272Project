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
const MAX_AGE_MS = 60_000; // 60s considered fresh

export default function Dashboard() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      return cached?.data ?? null; // show instantly
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

  // 1) Get session once + subscribe (no polling, no retries)
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

  // 2) Helpers that DO NOT call auth again
  async function fetchWatchlist(userId) {
    const { data: rows, error } = await supabase
      .from("watchlist")
      .select("ticker")
      .eq("user_id", userId);

    if (!error && rows) setSymbols(rows.map((r) => r.ticker));
  }

  async function revalidateSummary() {
  setUpdating(true);
  setErr(null); // reset
  try {
    // optional: skip re-fetch if cache is very fresh
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
    console.error("get_home_summary error:", e); // check Console for details
    setErr(e);
  } finally {
    setUpdating(false);
  }
}


  // 3) Run data loads exactly once per signed-in user
  const initializedForUser = useRef(null);
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    if (initializedForUser.current === userId) return; // prevent loops + StrictMode double-run
    initializedForUser.current = userId;

    fetchWatchlist(userId);
    revalidateSummary();
  }, [session?.user?.id]);

  // Watchlist UI helpers
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

  // If your usePositions2/LiveStockCard poll the backend, make sure they DON'T call auth on every tick.
  // Prefer passing userId down if needed:
  const userId = session?.user?.id ?? null;
  const { data: trades, loading, error, refresh } = usePositions2(userId);

  return (
    <main className="p-6">
      <div style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {err && (
  <div className="mt-2 text-sm text-red-600">
    Error: {String(err?.message || err?.error_description || err?.hint || 'Unknown')}
  </div>
)}

        <div className="flex justify-left gap-4">
          <AddNew onClick={() => setOpen(true)} />
          <AddNewWatchlist onClick={() => setWatchlistOpen(true)} />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TotalAsset summary={summary} updating={updating} err={err} />
          <TotalCash summary={summary} updating={updating} err={err} />
          <TotalProgress summary={summary} updating={updating} err={err} />
        </div>

        <div className="mt-6">
          <ActiveTradesCard trades={trades} onClosed={refresh} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
        <h1 className="text-2xl font-semibold mb-4">Watch List</h1>

        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              value={input}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && add(input)}
              placeholder="Add symbol e.g. NVDA"
              style={{ width: "100%", padding: "10px 12px" }}
            />
            <button
              onClick={() => add(input)}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:scale-95 transition font-medium"
            >
              Add
            </button>

            {suggestions.length > 0 && (
              <ul className="absolute top-[50px] bg-[#90a2b7ff] border border-[#1e232b] rounded-lg list-none z-10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    onClick={() => handleSelect(s)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-3 py-2.5 cursor-pointer text-black border-b border-[#1e232b] hover:bg-[#7d8fa3] transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 12 }}>
          {symbols.map((s) => (
            <LiveStockCard key={s} symbol={s} onDelete={handleDeleteFromUI} userId={userId} />
          ))}
        </div>
      </div>
    </main>
  );
}
