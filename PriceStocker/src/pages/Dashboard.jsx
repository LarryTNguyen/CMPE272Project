import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { TotalProgress } from "../components/Progress";
import TotalAsset from "../components/TotalAsset";
import AddNew from "../components/AddNew";
import AddNewStock from "../components/AddNew";

import AddAssetModal from "../components/AddAssetModal";
import ActiveTradesCard from "../components/ActiveTradeCard";
import MockLiveStockCard from "../components/MockLiveStockCard";

const Dashboard = () => {
  console.log("test")
  const navigate = useNavigate();
  const totalPL = 1425.78;   // absolute profit/loss since account creation
  const totalPLPct = 12.63;  // percent since account creation
  const [open, setOpen] = React.useState(false);
  const [symbols, setSymbols] = useState(["AAPL", "MSFT", "TSLA"]);
  const [input, setInput] = useState("");
  const add = () => {
    const s = input.toUpperCase().trim();
    if (!s || symbols.includes(s)) return;
    setSymbols([s, ...symbols]);
    setInput("");
  };
  const handleSubmit = (payload) => {
    // Save order to your backend / local state
    console.log("Add asset payload:", payload);
  };
  useEffect(()=>{
    console.log("test")

  })
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="flex justify-left gap-4">
        <AddNew onClick={() => setOpen(true)} />
      </div>


        <AddAssetModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        symbols={["BTCUSDT", "ETHUSDT", "SOLUSDT"]}
        navigate={navigate}
        redirectTo="/input"
      />
      
      
      <div className="mt-6 flex gap-4">
        <TotalAsset amount={-25000} currency="USD" />
      <TotalProgress amount={totalPL} percent={totalPLPct} currency="USD" />
      </div>
      <div className="mt-6">
        <ActiveTradesCard />
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
      <h1 style={{ margin: "0 0 16px" }}>Mock Live Stocks</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add symbol e.g. NVDA"
          style={{ flex: 1, padding: "10px 12px" }}
        />
        <button onClick={add}>Add</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 12 }}>
        {symbols.map((s) => (
          <MockLiveStockCard key={s} symbol={s} />
        ))}
      </div>
    </div>
    </main>
  );
};

export default Dashboard;
