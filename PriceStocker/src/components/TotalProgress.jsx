import React, { useState, useEffect } from "react";
import supabase from '../services/superbase';

const formatCash = (cash) =>
  Number(cash).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const TotalProgress = () => {
  const [loading, setLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchTotalProfit = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return console.log("No user logged in");

        const { data: transactions, error: transactionsError } = await supabase //GET FROM TRANSACTIONS TABLE
          .from("transactions")
          .select("type, quantity, price")
          .eq("user_id", user.id);
        if (transactionsError) throw transactionsError;

        let profit = 0; //CALCULATE PROFIT (SELL QUANTITY)-(BUY PRICE*QUANTITY)
        transactions.forEach(tx => {
          if (tx.type === "buy") {
            profit -= tx.quantity * tx.price; 
          } else if (tx.type === "sell") {
            profit += tx.quantity * tx.price; 
          }
        });

        setTotalProfit(profit);
      } catch (error) {
        console.error("Error calculating total profit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProfit();
  }, []);
  const profitColor = (totalProfit) => {
    if (totalProfit > 0) return "text-green-600";
    if (totalProfit < 0) return "text-red-600";
    return "text-muted-foreground";
  };
  return (
    <div className="h-28 aspect-square rounded-2xl border bg-background shadow-sm p-4 flex flex-col items-center justify-center text-center">
      <div className="text-sm font-medium text-muted-foreground">Total Profit:</div>
      <div className={`mt-2 text-5xl font-bold tracking-tight ${profitColor(totalProfit)}`} >
        {loading ? "Loading..." : formatCash(totalProfit)}
      </div>
    </div>
  );
};

export default TotalProgress;