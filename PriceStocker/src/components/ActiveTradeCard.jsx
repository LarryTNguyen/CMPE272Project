import React from "react";
import { Card, CardContent } from "./ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// ---- helpers ----
const quoteToFiat = { USDT: "USD", USDC: "USD", BUSD: "USD", EUR: "EUR", GBP: "GBP", JPY: "JPY" };
const fmtCurrency = (n, code = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: 2 }).format(n);
const fmtNum = (n, max = 8) => n.toLocaleString(undefined, { maximumFractionDigits: max });
const fmtPct = (p) => `${p >= 0 ? "+" : ""}${p.toFixed(2)}%`;

const Sparkline = ({ points }) => {
  const data = (points || []).map((y, i) => ({ x: i, y }));
  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Area type="monotone" dataKey="y" fillOpacity={0.15} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

function TradeRow({ t, index }) {
  const base = t.base || (t.symbol ? t.symbol.replace(/USDT|USDC|BUSD|EUR|GBP|JPY$/, "") : "");
  const quote = t.quote || (t.symbol ? (t.symbol.match(/USDT|USDC|BUSD|EUR|GBP|JPY$/) || ["USDT"])[0] : "USDT");
  const quoteFiat = quoteToFiat[quote] || "USD";

  const current = t.current ?? (t.history?.length ? t.history[t.history.length - 1] : t.entry);
  const pnlAmount = (current - t.entry) * t.qty;
  const pnlPct = t.entry ? ((current / t.entry - 1) * 100) : 0;
  const up = pnlAmount >= 0;

  return (
    <div className="grid grid-cols-12 items-center gap-4 px-4 py-3" role="row">
      {/* Pair */}
      <div className="col-span-2 flex items-center gap-3" role="cell">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-sm font-semibold">
          {base.slice(0, 2)}
        </div>
        <div className="leading-tight">
          <div className="font-semibold">{base}/{quote}</div>
          <div className="text-xs text-muted-foreground">#{(index ?? 0) + 1}</div>
        </div>
      </div>

      {/* Current */}
      <div className="col-span-2 font-medium" role="cell">
        {fmtCurrency(current, quoteFiat)}
      </div>

      {/* Entry */}
      <div className="col-span-2 text-muted-foreground" role="cell">
        {fmtCurrency(t.entry, quoteFiat)}
      </div>

      {/* Quantity */}
      <div className="col-span-1" role="cell">
        {fmtNum(t.qty)} <span className="text-xs text-muted-foreground">{base}</span>
      </div>

      {/* PnL amount */}
      <div className={`col-span-2 font-semibold ${up ? "text-emerald-600" : "text-red-600"}`} role="cell">
        {fmtCurrency(pnlAmount, quoteFiat)}
      </div>

      {/* PnL % */}
      <div className={`col-span-1 ${up ? "text-emerald-600" : "text-red-600"}`} role="cell">
        {fmtPct(pnlPct)}
      </div>

      {/* Chart */}
      <div className="col-span-2 justify-self-end" role="cell">
        <Sparkline points={t.history || []} />
      </div>
    </div>
  );
}

const mock = [
  {
    symbol: "BTCUSDT",
    base: "BTC",
    quote: "USDT",
    entry: 98000,
    qty: 0.25,
    current: 112500,
    history: [95000, 97000, 100000, 98500, 103000, 108000, 110000, 112500],
  },
  {
    symbol: "ETHUSDT",
    base: "ETH",
    quote: "USDT",
    entry: 3800,
    qty: 1.5,
    current: 4025,
    history: [3650, 3720, 3900, 3820, 3950, 4000, 4050, 4025],
  },
  {
    symbol: "SOLUSDT",
    base: "SOL",
    quote: "USDT",
    entry: 210,
    qty: 20,
    current: 195,
    history: [230, 225, 220, 215, 210, 205, 198, 195],
  },
];

export default function ActiveTradesCard({ trades = mock, title = "Active Trades", className = "" }) {
  return (
    <Card className={`w-full overflow-x-auto border-border/60 ${className}`}>
      <CardContent className="p-0">
        <div className="px-4 pt-4 pb-3 text-sm font-medium text-muted-foreground">{title}</div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="col-span-2">Pair</div>
          <div className="col-span-2">Current</div>
          <div className="col-span-2">Entry</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-2">P/L (Amount)</div>
          <div className="col-span-1">P/L (%)</div>
          <div className="col-span-2 justify-self-end">Trend</div>
        </div>

        <div className="divide-y" role="rowgroup">
          {trades.map((t, i) => (
            <TradeRow key={`${t.symbol}-${i}`} t={t} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Usage example (Home.jsx) ---
// import ActiveTradesCard from "@/components/ActiveTradesCard";
// <ActiveTradesCard />
// or pass your own data: <ActiveTradesCard trades={yourTradesArray} />
