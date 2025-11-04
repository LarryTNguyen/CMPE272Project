import React from "react";
import { TotalProgress } from "../components/Progress";
import TotalAsset from "../components/TotalAsset";
import AddNew from "../components/AddNew";
import AddAssetModal from "../components/AddAssetModal";
import ActiveTradesCard from "../components/ActiveTradeCard";

const Dashboard = () => {
  const totalPL = 1425.78;   // absolute profit/loss since account creation
  const totalPLPct = 12.63;  // percent since account creation
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (payload) => {
    // Save order to your backend / local state
    console.log("Add asset payload:", payload);
  };

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
      />
      <div className="mt-6 flex gap-4">
        <TotalAsset amount={-25000} currency="USD" />
      <TotalProgress amount={totalPL} percent={totalPLPct} currency="USD" />
      </div>
      <div className="mt-6">
        <ActiveTradesCard />
      </div>
    </main>
  );
};

export default Dashboard;
