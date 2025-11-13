import supabase from '../services/superbase';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import tickersData from '../data/tickers.json';
export default function AddWatchlist({
  open,
  onClose,
  onSubmit = () => { },
  symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT"],
  initialSymbol = "BTCUSDT",
  navigate,             // pass router.push (Next) or useNavigate() (React Router)
  closeOnSubmit = true, // optional
}) {
  const [user, setUser] = useState(null);
  const TICKERS = tickersData.map(item => item.ticker);
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");

  const [symbol, setSymbol] = React.useState(initialSymbol);
  const [current, setCurrent] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [useTPSL, setUseTPSL] = React.useState(false);
  const [tp, setTp] = React.useState("");
  const [sl, setSl] = React.useState("");

  const fetchPrice = React.useCallback(async (s) => {
    try {
      const r = await fetch(`/api/price?symbol=${s}`);
      const { price } = await r.json();
      setCurrent(Number(price));
      setPrice((prev) => (prev === "" ? String(price) : prev));
    } catch (e) {
      console.error(e);
    }
  }, []);

  React.useEffect(() => { if (open) fetchPrice(symbol); }, [open, symbol, fetchPrice]);
  React.useEffect(() => {
    if (!open) return;
    const id = setInterval(() => fetchPrice(symbol), 5000);
    return () => clearInterval(id);
  }, [open, symbol, fetchPrice]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error', error);
      } else if (user) {
        console.log('logged in : ', user);
        setUser(user);
      } else {
        console.log('No user logged in');
      }
    };

    fetchUser();
  }, []);

  const notional = price && qty ? Number(price) * Number(qty) : null;

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      symbol,
      price: Number(price),
      qty: Number(qty),
      tp: useTPSL && tp !== "" ? Number(tp) : null,
      sl: useTPSL && sl !== "" ? Number(sl) : null,
    };

    const { data, error } = await supabase
      .from('watchlist')
      .insert([
        {
          ticker: input,
          watch_price: payload.price,
          user_id: user.id
        }
      ]);
    if (error) {
      console.error('watchlist Error: ', error);
    }

    setPrice(0)
    setQty(0)


    if (closeOnSubmit && onClose) onClose();
  };
  onSubmit();

  if (!open) return null;

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);

    if (value.length > 0) {
      const filtered = TICKERS.filter((t) => t.startsWith(value)).slice(0, 6);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  const handleSelect = (symbol) => {
    setInput(symbol);
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border bg-white text-gray-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add to Watchlist</h2>
          <button className="p-1 rounded-md hover:bg-black/5" onClick={onClose} aria-label="Close">✕</button>
        </div>


        <div className="relative">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium"></label>
              <input
                value={input}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && add(input)}
                placeholder="Add symbol e.g. NVDA"
                style={{ width: "80%", padding: "10px 12px" }}
              />

            </div>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Alert at</label>
                <input type="number" step="any" placeholder="Limit price"
                  className="mt-1 w-full rounded-lg border p-2"
                  value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

            </div>

            {notional != null && (
              <div className="text-xs text-muted-foreground">
                Order value ≈ {notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={useTPSL} onChange={(e) => setUseTPSL(e.target.checked)} />
                <span className="text-sm font-medium">Enable TP/SL</span>
              </label>

              {useTPSL && (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Take Profit (price)</label>
                    <input type="number" step="any" placeholder="e.g. 75000"
                      className="mt-1 w-full rounded-lg border p-2"
                      value={tp} onChange={(e) => setTp(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stop Loss (price)</label>
                    <input type="number" step="any" placeholder="e.g. 58000"
                      className="mt-1 w-full rounded-lg border p-2"
                      value={sl} onChange={(e) => setSl(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button>
              <button type="submit" className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
