import React, { useState, useEffect } from "react";
import supabase from '../services/superbase';

export default function PortfolioCard({ ticker, quantity, price }) {
  const [stock, setStock] = useState(null);
  const [calc, setCalc] = useState({ ret: 0, pct: 0, mv: 0 });

  useEffect(() => {
    let mounted = true;

    const fetchStock = async () => {
      const { data } = await supabase
        .from("stock_data")
        .select("*")
        .eq("ticker", ticker)
        .single();

      if (!mounted) return;
      setStock(data || null);

      const purchase = Number(price) || 0;
      const current = Number(data?.current_price) || 0;
      const qty = Number(quantity) || 0;

      const ret = (current - purchase) * qty;
      const pct = purchase > 0 ? ((current - purchase) / purchase) * 100 : 0;
      const mv = current * qty;

      setCalc({ ret, pct, mv });
    };

    fetchStock();
    return () => { mounted = false; };
  }, [ticker, price, quantity]);

  const fmt = (n) =>
    n == null ? "—" : Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-200 flex justify-between items-center w-full">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold tracking-wide text-gray-900">{ticker}</div>
        <div className="text-sm text-gray-500">
          Quantity: <span className="text-gray-700 font-medium">{fmt(quantity)}</span>
        </div>
        <div className="text-sm text-gray-500">
          Average Price: <span className="text-gray-700 font-medium">${fmt(price)}</span>
        </div>
        <div className="text-sm text-gray-500">
          Current Price: <span className="text-gray-700 font-medium">
            {stock?.current_price != null ? `$${fmt(stock.current_price)}` : "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="text-lg font-bold text-gray-900">
          {stock?.name || '\u00A0'}
        </div>
        <div className={`text-sm font-semibold ${calc.ret >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          Return: ${fmt(calc.ret)}
        </div>
        <div className={`text-sm font-semibold ${calc.pct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          Change: {fmt(calc.pct)}%
        </div>
        <div className="text-lg font-bold text-gray-900">
          Market Value: ${fmt(calc.mv)}
        </div>
      </div>
    </div>
  );
}
