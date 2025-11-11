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
        const nextPoint = {
          time: Math.floor(new Date(data.last_updated).getTime() / 1000),
          value: data.current_price,
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

          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: changePct >= 0 ? "#1fbf75" : "#e15241",
            }}
          >
            {price == null ? "" : ` ${(changePct >= 0 ? "+" : "")}${changePct.toFixed(2)}%`}
          </span>
        </div>

      </div>

      {/* chart */}
      <div ref={containerRef} style={{ width: "100%", height }} />

      <div
        style={{
          marginTop: 8,
          border: "1px solid #1e232b",
          borderRadius: 8,
          background: "#0f1318",
        }}
      >
        <strong>{data.name}</strong>

        <div
          style={{
            padding: "8px 10px",
            fontSize: 12,
            color: "#8a9099",
            borderBottom: "1px solid #1e232b",
          }}
        >
          Active trades (mock)
        </div>

        <div
          style={{
            height: tradesPanelHeight,       // 👈 fixed height
            overflowY: "auto",               // 👈 scroll inside the box
            overscrollBehavior: "contain",
            padding: 8,
            display: "grid",
            gap: 6,
          }}
        >
          {trades.length === 0 && <div style={{ color: "#8a9099" }}>Waiting for prints…</div>}
          {trades.map((t, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "90px 60px 1fr 80px",
                gap: 8,
                alignItems: "center",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: "#8a9099" }}>{fmtTime.format(new Date(t.time))}</span>
              <span style={{ color: t.side === "buy" ? "#1fbf75" : "#e15241" }}>
                {t.side.toUpperCase()}
              </span>
              <span>{fmt.format(t.price)}</span>
              <span style={{ textAlign: "right" }}>{t.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default LiveStockCard;