import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import supabase from '../services/superbase';

function LiveStockCard({
  symbol = "AAPL",
  height = 240,
  startPrice = 100,
  tickMs = 350,
  volatilityBps = 25,
  tradesPanelHeight = 200,
  maxTrades = 200,
  onDelete,
}) {
  const containerRef = useRef(null);
  const chartApiRef = useRef(null);
  const seriesRef = useRef(null);
  const timerRef = useRef(null);

  const [price, setPrice] = useState(null);
  const [changePct, setChangePct] = useState(0);
  const [trades, setTrades] = useState([]);
  const pointsRef = useRef([]);
  const [data, setData] = useState({})
  const fmt = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
    []
  );
  const fmtTime = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    []
  );

  // init chart
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chartApi = createChart(el, {
      width: el.clientWidth,
      height,
      layout: { background: { type: "Solid", color: "white" }, textColor: "black" },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: true },
      timeScale: { rightBarStaysOnScroll: true, borderVisible: true },
    });

    const addSeries = chartApi.addAreaSeries;
    if (typeof addSeries !== "function") {
      console.error("lightweight-charts not imported correctly. Use: import { createChart } from 'lightweight-charts';");
      return () => { };
    }

    const series = chartApi.addAreaSeries({ lineWidth: 2, priceLineVisible: true });
    chartApiRef.current = chartApi;
    seriesRef.current = series;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) chartApi.applyOptions({ width: Math.floor(entry.contentRect.width) });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      timerRef.current && clearInterval(timerRef.current);
      try { chartApi.remove(); } catch { }
      chartApiRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("ticker", symbol);

      if (error) throw error;

      console.log(`Deleted ${symbol} from watchlist`);
      if (onDelete) onDelete(symbol);
    } catch (err) {
      console.error("Error deleting item:", err.message);
      alert("Failed to delete from watchlist");
    }
  };
  useEffect(() => {
    if (!seriesRef.current) return;

    const fetchStock = async () => {
      try {
        const { data, error } = await supabase
          .from("stock_data")
          .select("*")
          .eq("ticker", symbol)
          .single();

        if (error) throw error;
        if (!data) return;
        setData(data)


        const safeNumber = (v) =>
          typeof v === "number" && !isNaN(v) ? v : 0;
        const nextPoint = {
          time: Math.floor(new Date(data.last_updated).getTime() / 1000),
          value: safeNumber(data.current_price),
        };

        if (seriesRef.current && data) {
          pointsRef.current.push(nextPoint);
          if (pointsRef.current.length > 1200) pointsRef.current.shift();
          seriesRef.current.update(nextPoint);

          setPrice(data.current_price);
          setChangePct(data.percent_change);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStock();

    const interval = setInterval(fetchStock, 1000);

    return () => clearInterval(interval);
  }, [symbol]);



  return (
    <div style={{ background: "#12161c", border: "1px solid #1e232b", borderRadius: 10, padding: 8, color: "#e6e9ef" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 4px 0" }}>
        <strong>{String(symbol).toUpperCase()}</strong>
        <div style={{ fontVariantNumeric: "tabular-nums" }}>
          {price == null ? "—" : fmt.format(price)}
          <span className={`ml-2 text-xs ${changePct >= 0 ? "text-green-500" : "text-red-600"}`}>
            {price == null ? "" : ` ${(changePct >= 0 ? "+" : "")}${changePct.toFixed(2)}%`}
          </span>
        </div>

      </div>

      {/* chart */}
      <div ref={containerRef} style={{ width: "100%", height }} />
      <div className="mt-2 border border-[#1e232b] rounded-lg bg-[#0f1318]">
        <strong>{data.name}</strong>
        <div
          className={`h-[${tradesPanelHeight}px] overflow-y-auto overscroll-contain p-2 grid gap-1.5`}
        >
          <h1>Open: {data.open_price}</h1>
          <h1>Previous Close: {data.previous_close}</h1>
          <h1>Percent Change: {data.percent_change}%</h1>
          <h1>Today's high: {data.high_price}</h1>
          <h1>Today's low: {data.low_price}</h1>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="mt-2 w-full bg-red-600 text-white rounded-md py-2 px-3 font-bold hover:bg-red-700 transition-colors"
      >
        Delete from Watchlist
      </button>
    </div>
  );
}
export default LiveStockCard;