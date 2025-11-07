import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

function MockLiveStockCard({
  symbol = "AAPL",
  height = 240,
  startPrice = 100,
  tickMs = 350,
  volatilityBps = 25,
  tradesPanelHeight = 200,   // 👈 fixed-height trades panel (px)
  maxTrades = 200,           // keep a rolling buffer
}) {
  const containerRef = useRef(null);
  const chartApiRef = useRef(null);
  const seriesRef = useRef(null);
  const timerRef = useRef(null);

  const [price, setPrice] = useState(null);
  const [changePct, setChangePct] = useState(0);
  const [trades, setTrades] = useState([]);
  const pointsRef = useRef([]);

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
      return () => {};
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
      try { chartApi.remove(); } catch {}
      chartApiRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  // seed + ticks + mock trades
  useEffect(() => {
    if (!seriesRef.current) return;

    // seed
    const now = Math.floor(Date.now() / 1000);
    let p = Math.max(0.5, Number(startPrice) || 100);
    pointsRef.current = [];
    for (let i = 60; i > 0; i--) {
      pointsRef.current.push({ time: now - i, value: p });
      p = Math.max(0.5, p + (Math.random() - 0.5) * (p * (volatilityBps / 10000) * 0.2));
    }
    seriesRef.current.setData(pointsRef.current);
    setPrice(pointsRef.current.at(-1)?.value ?? null);
    setChangePct(0);
    setTrades([]);

    // ticks
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const last = pointsRef.current.at(-1);
      const vol = Math.max(1, volatilityBps) / 10000;
      const drift = (Math.random() - 0.5) * vol * last.value;
      const next = {
        time: Math.floor(Date.now() / 1000),
        value: Number(Math.max(0.5, last.value + drift).toFixed(2)),
      };

      pointsRef.current.push(next);
      if (pointsRef.current.length > 1200) pointsRef.current.shift();
      seriesRef.current.update(next);

      setPrice(next.value);
      const first = pointsRef.current[0]?.value;
      if (first) setChangePct(((next.value - first) / first) * 100);

      // mock trade ~60% of ticks
      if (Math.random() < 0.6) {
        const side = Math.random() < 0.5 ? "buy" : "sell";
        const size = Math.floor(10 + Math.random() * 1200);
        const spread = Math.random() * Math.max(0.02, next.value * 0.0006);
        const tradePrice = Number(
          (side === "buy" ? next.value + spread : Math.max(0.01, next.value - spread)).toFixed(2)
        );
        const t = Date.now();

        setTrades((prev) => {
          const nextArr = [{ time: t, price: tradePrice, size, side }, ...prev];
          if (nextArr.length > maxTrades) nextArr.length = maxTrades;
          return nextArr;
        });
      }
    }, tickMs);

    return () => timerRef.current && clearInterval(timerRef.current);
  }, [symbol, startPrice, tickMs, volatilityBps, maxTrades]);

  return (
    <div style={{ background: "#12161c", border: "1px solid #1e232b", borderRadius: 10, padding: 8, color: "#e6e9ef" }}>
      {/* header */}
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

      {/* trades panel (contained, scrollable) */}
      <div
        style={{
          marginTop: 8,
          border: "1px solid #1e232b",
          borderRadius: 8,
          background: "#0f1318",
        }}
      >
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
export default MockLiveStockCard;