import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TotalProgress } from "../components/Progress";
import TotalAsset from "../components/TotalAsset";
import AddNew from "../components/AddNew";
import AddNewWatchlist from "../components/AddNewWatchlist";
import AddWatchlist from "../components/AddWatchlist";
import AddAssetModal from "../components/AddAssetModal";
import ActiveTradesCard from "../components/ActiveTradeCard";
import LiveStockCard from "../components/LiveStockCard";
import tickersData from '../data/tickers.json';
import supabase from '../services/superbase';

const Dashboard = () => {
  const navigate = useNavigate();
  const totalPL = 1425.78;   // absolute profit/loss since account creation
  const totalPLPct = 12.63;  // percent since account creation
  const [open, setOpen] = React.useState(false);
  const [watchlistOpen, setWatchlistOpen] = React.useState(false);
  const [symbols, setSymbols] = useState(["AAPL", "MSFT", "TSLA"]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const TICKERS = tickersData.map(item => item.ticker);

  useEffect(() => { //USED TO HANDLE GETTING AUTHORIZATION/USER
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error("Auth error:", error);
      else if (user) setUser(user);
    };
    fetchUser();
  }, []);

  const handleDeleteFromUI = (ticker) => { //HANDLES THE RERENDER WHEN DELETE FROM COMPONENT
    setSymbols((prev) => prev.filter((s) => s !== ticker));
  };

  const add = async () => { //HANDLE ADDING TO WATCH LIST FROM TEXT BOX
    const s = input.toUpperCase().trim();
    if (!s || symbols.includes(s)) return;
    const { data, error } = await supabase
      .from('watchlist')
      .insert([
        {
          ticker: s,
          watch_price: 0,
          user_id: user.id
        }
      ])
      .select();;
    if (error) {
      console.error('watchlist Error: ', error);
    } else {
      console.log('successful', data);
      setSymbols((prev) => [...prev, s]);
      setInput("");
    }
  };

  const handleSubmit = (payload) => {
    // Save order to your backend / local state
    console.log("Add asset payload:", payload);
  };


  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);

    if (value.length > 0) {
      const filtered = TICKERS.filter((t) => t.startsWith(value)).slice(0, 6);
      console.log("Filtered suggestions:", filtered); 

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };


  const handleSelect = (symbol) => {
    setInput(symbol);
    setSuggestions([]); // hide suggestions
  };

  useEffect(() => { // FETCH WATCH LIST FROM DATABASE TO DISPLAY
    if (!user) return;
    const fetchWatchlist = async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("ticker")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching watchlist:", error);
      } else {
        const tickers = data.map(row => row.ticker);
        console.log("tickers", tickers)
        setSymbols(tickers);
      }
    };

    fetchWatchlist();
  }, [user]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="flex justify-left gap-4">
        <AddNew onClick={() => setOpen(true)} />
        <AddNewWatchlist onClick={() => setWatchlistOpen(true)} />
      </div>


      <AddAssetModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        symbols={["BTCUSDT", "ETHUSDT", "SOLUSDT"]}
        navigate={navigate}
      />

      <AddWatchlist
        open={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        onSubmit={handleSubmit}
        symbols={["BTCUSDT", "ETHUSDT", "SOLUSDT"]}
        navigate={navigate}
      />


      <div className="mt-6 flex gap-4">
        <TotalAsset amount={-25000} currency="USD" />
        <TotalProgress amount={totalPL} percent={totalPLPct} currency="USD" />
      </div>
      <div className="mt-6">
        <ActiveTradesCard />
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
        <h1 style={{ margin: "0 0 16px" }}>Watchlist Stocks</h1>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
            <LiveStockCard key={s} symbol={s} onDelete={handleDeleteFromUI} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
