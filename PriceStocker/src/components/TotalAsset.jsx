import React, { useState, useEffect } from "react";
import supabase from '../services/superbase';
const TotalAsset = () => {

  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(0)
  const [positions, setPositions] = useState([]);

  const formatCurrency = (n, currency = "USD") =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser(); //GET USEr
        if (userError) throw userError;
        if (!user) return console.log("No user logged in");

        const { data: profileData, error: profileError } = await supabase //GET CASH/BUYING POWER
          .from("profiles")
          .select("cash")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;

        const { data: positionsData, error: positionsError } = await supabase //GET POSITIONS
          .from("positions")
          .select("*")
          .eq("user_id", user.id);
        if (positionsError) throw positionsError;


        setPositions(positionsData);
        const tickers = positionsData.map(pos => pos.ticker);
        const { data: stockData, error: stockError } = await supabase
          .from("stock_data")
          .select("ticker, current_price")
          .in("ticker", tickers);
        if (stockError) throw stockError;

        const positionsTotal = positionsData.reduce((sum, pos) => {
          const stock = stockData.find(s => s.ticker === pos.ticker);
          const currentPrice = stock ? stock.current_price : 0;
          return sum + currentPrice * pos.quantity;
        }, 0);


        setAsset(profileData.cash + positionsTotal);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const color =
    asset === 0 ? "text-muted-foreground" : asset > 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div
      className={`h-28 aspect-square rounded-2xl border bg-background shadow-sm p-4
                  flex flex-col items-center justify-center text-center `}
    >
      <div className="text-sm font-medium text-muted-foreground">Total Assets</div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
        {loading ? "Loading..." : formatCurrency(asset, "USD")}
      </div>
    </div>
  );

}
export default TotalAsset