import Navbar from "../components/Navbar";
import supabase from "../services/superbase";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

const Stock = () => {
  let { ticker } = useParams()
  ticker = ticker.toUpperCase()
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [actionType, setActionType] = useState("buy")
  const [tradeAmount, setTradeAmount] = useState(0)

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [sharesOwned, setSharesOwned] = useState(0);
  const [stock, setStock] = useState({})
  const handleTrade = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return console.log("No user logged in");

    const costOrGain = tradeAmount * current.current_price;
    const cashModification = actionType === 'buy' ? -costOrGain : costOrGain;
    const newCash = profile.cash + cashModification;

    let newOwnedQuantity = sharesOwned;

    try {
      const { data: existingPositions, error: fetchError } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)
        .eq('ticker', ticker)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const quantityForValidation = existingPositions?.quantity ?? 0;

      if (actionType === 'buy') {
        if (costOrGain > profile.cash) {
          throw new Error("INSUFFICIENT FUNDS: You do not have enough cash to complete this purchase.");
        }
      } else {
        if (quantityForValidation < tradeAmount) {
          throw new Error(`INSUFFICIENT SHARES: You only own ${quantityForValidation} shares of ${ticker}.`);
        }
      }

      let positionOperationPromise;
      const existingPosition = existingPositions;

      if (actionType === 'buy') {
        newOwnedQuantity = quantityForValidation + tradeAmount;
        if (existingPosition) {
          const newTotalCost = (existingPosition.quantity * existingPosition.average_price) + costOrGain;
          const newAveragePrice = newTotalCost / newOwnedQuantity;

          positionOperationPromise = supabase
            .from('positions')
            .update({
              quantity: newOwnedQuantity,
              average_price: newAveragePrice,
            })
            .eq('user_id', user.id)
            .eq('ticker', ticker);

        } else {
          positionOperationPromise = supabase
            .from('positions')
            .insert([{
              user_id: user.id,
              ticker: ticker,
              quantity: tradeAmount,
              average_price: current.current_price,
            }]);
        }
      } else {
        newOwnedQuantity = quantityForValidation - tradeAmount;

        if (newOwnedQuantity === 0) {
          positionOperationPromise = supabase
            .from('positions')
            .delete()
            .eq('user_id', user.id)
            .eq('ticker', ticker);
        } else {
          positionOperationPromise = supabase
            .from('positions')
            .update({
              quantity: newOwnedQuantity
            })
            .eq('user_id', user.id)
            .eq('ticker', ticker);
        }
      }

      const { error: positionError } = await positionOperationPromise;
      if (positionError) throw positionError;
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          cash: newCash
        })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      setProfile((prev) => ({
        ...prev,
        cash: newCash,
      }));

      const { error: transactionInsertError } = await supabase
        .from('transactions')
        .insert([
          {
            ticker,
            type: actionType,
            quantity: tradeAmount,
            price: current.current_price,
            user_id: user.id
          }
        ]);

      if (transactionInsertError) throw transactionInsertError;

      setSharesOwned(newOwnedQuantity);
      alert(`${actionType === 'buy' ? 'Bought' : 'Sold'} ${tradeAmount} shares!`);

    } catch (err) {
      console.error(`Transaction failed during ${actionType}:`, err.message || err);
      alert(`Transaction failed: ${err.message || 'Check console for details.'}`);
    }
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return console.log("No user logged in");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("cash")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };


    const fetchStock = async () => {
      const { data, error } = await supabase
        .from("stock_data")
        .select("*")
        .eq("ticker", ticker)
        .single();

      setStock(data)
      console.log(data)
    }


    fetchProfile();
    fetchStock();
  }, []);

  async function loadCurrent() {
    console.log(ticker)
    const { data, error } = await supabase
      .from("stock_data")
      .select("*")
      .eq("ticker", ticker)
      .single();

    if (error) {
      console.error("Load Current Error:", error);
      return;
    }

    setCurrent(data);
    setHistory([
      {
        timestamp: new Date().toLocaleTimeString(),
        price: Number(data.current_price),
        change: data.change_amount ?? 0,
      }
    ]);
  }
  async function fetchShares() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return console.log("No user logged in");
    const { data, error } = await supabase
      .from("positions")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("ticker", ticker)
      .maybeSingle();

    if (error) {
      console.error("Shares quantity error:", error);
      return;
    }
    console.log("shares", data)
    setSharesOwned(data.quantity);
  }
  useEffect(() => {
    loadCurrent();
    fetchShares();
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("stock_data")
        .select("*")
        .eq("ticker", ticker)
        .single();

      if (data) {
        setCurrent(data);

        setHistory((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            price: Number(data.current_price),
            change: data.change_amount ?? 0,
          },
        ]);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [ticker]);

  if (!current) return <div>Loading...</div>;

  const isUp = (current.change_amount ?? 0) > 0;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 px-6">
        <div className="flex gap-6">
          <div className="w-[70%] p-6 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">{ticker} Stock Price</h2>
              {isUp ? (
                <ArrowUp className="text-green-500" />
              ) : (
                <ArrowDown className="text-red-500" />
              )}
            </div>

            <div className="text-lg font-medium mb-2">
              Current Price: ${current.current_price.toFixed(2)}
            </div>
            <div >

              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={history}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                    minTickGap={20}
                  />

                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    allowDecimals={true}
                    width={60}
                  />

                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    labelStyle={{ fontWeight: "bold" }}
                  />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#0EA5E9"       // nice blue stock-chart color
                    strokeWidth={2}
                    dot={false}            // stock charts don’t show dots
                    activeDot={{ r: 4 }}
                    animationDuration={300}
                    isAnimationActive={false} // smoother between updates
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </div>
          <div className="w-[30%] p-6 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Ticker:</span> {ticker.toUpperCase()}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Name: </span>
              {current.name}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Buying Power:</span> $
              {profile?.cash?.toFixed(2) ?? "0.00"}            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Shares Owned:</span>
              {sharesOwned}            </p>
            <div className="flex gap-2 mb-3">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold ${actionType === "buy"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => setActionType("buy")}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold ${actionType === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => setActionType("sell")}
              >
                Sell
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                min="1"
                placeholder="Shares"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Number(e.target.value))}
              />
              <p>
                Estimated Cost = ${(tradeAmount * current.current_price).toFixed(2)}
              </p>
              <button
                className={`py-2 rounded-lg font-semibold text-white ${actionType === "buy" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
                  } transition`}
                onClick={handleTrade}
              >
                {actionType === "buy" ? "Buy" : "Sell"}
              </button>
            </div>

          </div>
        </div>
        <div className="w-[100%] p-6 bg-white rounded-2xl shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-4">Market Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Open</p>
              <p className="font-semibold text-lg">${current.open_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Previous Close</p>
              <p className="font-semibold text-lg">${current.previous_close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Day High</p>
              <p className="font-semibold text-lg">${current.high_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Day Low</p>
              <p className="font-semibold text-lg">${current.low_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Change</p>
              <p className={`font-semibold text-lg ${current.percent_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {current.percent_change >= 0 ? '+' : ''}{current.percent_change.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Updated</p>
              <p className="font-semibold text-sm">{new Date(current.last_updated).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stock;