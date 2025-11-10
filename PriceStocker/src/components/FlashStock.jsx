import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// ---------- Utilities ----------
const currency = (n, currencyCode = "USD") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};

const compact = (n) =>
  new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 2 }).format(n);

const pct = (n) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

// Map common quote symbols to ISO currency codes for display
const quoteToFiat = {
  USDT: "USD",
  USDC: "USD",
  BUSD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  INR: "INR",
};

// ---------- Sparkline ----------
const Sparkline = ({ points, positive }) => {
  const data = points.map((y, i) => ({ x: i, y }));
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

// ---------- Row Component (your reusable "individual stock/coin" piece) ----------
export const MarketRow = ({ item, index }) => {
  const isUp = item.change24hPct > 0;
  const quoteFiat = quoteToFiat[item.quote] ?? "USD";

  return (
    <div
      className="grid grid-cols-12 items-center gap-4 px-3 py-3 rounded-2xl hover:bg-muted/40 transition"
      role="row"
    >
      {/* Pair */}
      <div className="col-span-3 flex items-center gap-3" role="cell">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-sm font-semibold">
          {item.base.slice(0, 2)}
        </div>
        <div className="leading-tight">
          <div className="font-semibold">{item.base}/{item.quote}</div>
          <div className="text-xs text-muted-foreground">#{(index ?? 0) + 1} trending</div>
        </div>
      </div>

      {/* Last Price */}
      <div className="col-span-2 font-medium" role="cell">
        {currency(item.last, quoteFiat)}
      </div>

      {/* 24H Change */}
      <div
        className={`col-span-2 flex items-center gap-1 font-medium ${
          isUp ? "text-emerald-600" : "text-red-600"
        }`}
        role="cell"
      >
        {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {pct(item.change24hPct)}
      </div>

      {/* 24H High */}
      <div className="col-span-2 text-muted-foreground" role="cell">
        {currency(item.high24h, quoteFiat)}
      </div>

      {/* 24H Volume */}
      <div className="col-span-2 text-muted-foreground" role="cell">
        {compact(item.volume24h)}
      </div>

      {/* Sparkline */}
      <div className="col-span-1 justify-self-end" role="cell">
        <Sparkline points={item.history} positive={isUp} />
      </div>
    </div>
  );
};

// ---------- Main Component (list the top 5 trending) ----------
const sample = [
  {
    symbol: "BTCUSDT",
    base: "BTC",
    quote: "USDT",
    last: 112926.1,
    change24hPct: -0.63,
    high24h: 116052.0,
    volume24h: 1.69e9,
    history: [101, 105, 110, 106, 104, 103, 102, 101, 100, 101],
  },
  {
    symbol: "ETHUSDT",
    base: "ETH",
    quote: "USDT",
    last: 4023.57,
    change24hPct: -1.18,
    high24h: 4174.0,
    volume24h: 1.59e9,
    history: [50, 55, 53, 56, 54, 52, 50, 49, 50, 48],
  },
  {
    symbol: "SOLUSDT",
    base: "SOL",
    quote: "USDT",
    last: 194.9351,
    change24hPct: -2.03,
    high24h: 203.8851,
    volume24h: 5.31e8,
    history: [20, 22, 23, 22, 21, 20, 19, 18, 19, 17],
  },
  {
    symbol: "XRPUSDT",
    base: "XRP",
    quote: "USDT",
    last: 2.6148,
    change24hPct: -0.25,
    high24h: 2.6881,
    volume24h: 1.46e8,
    history: [3.2, 3.3, 3.1, 3.4, 3.0, 2.9, 3.0, 2.8, 2.9, 2.7],
  },
  {
    symbol: "DOGEUSDT",
    base: "DOGE",
    quote: "USDT",
    last: 0.19381,
    change24hPct: -2.35,
    high24h: 0.20301,
    volume24h: 1.2452e8,
    history: [0.1, 0.12, 0.11, 0.115, 0.108, 0.104, 0.1, 0.098, 0.099, 0.097],
  },
];

export default function TrendingMarkets({ items = sample }) {
  return (
    <Card className="w-full overflow-hidden border-border/60">
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-3 py-4 border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground" role="rowgroup">
          <div className="col-span-3">Trading Pairs</div>
          <div className="col-span-2">Last Traded Price</div>
          <div className="col-span-2">24H Change</div>
          <div className="col-span-2">24H High</div>
          <div className="col-span-2">24H Trading Volume</div>
          <div className="col-span-1 justify-self-end">Chart</div>
        </div>

        {/* Rows */}
        <div role="rowgroup" className="divide-y">
          {items.slice(0, 5).map((m, i) => (
            <MarketRow key={m.symbol} item={m} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Optional: helper to adapt a typical exchange response ----------
// Example of transforming an exchange API response into an array for <TrendingMarkets items={...} />
//
// function mapToMarket(row) {
//   const symbol = row.symbol; // e.g., "BTCUSDT"
//   const quote = (symbol.match(/USDT|USDC|BUSD|EUR|GBP|JPY|INR$/) || ["USDT"])[0];
//   const base = symbol.replace(/USDT|USDC|BUSD|EUR|GBP|JPY|INR$/, "");
//   return {
//     symbol,
//     base,
//     quote,
//     last: parseFloat(row.lastPrice),
//     change24hPct: parseFloat(row.priceChangePercent),
//     high24h: parseFloat(row.highPrice),
//     volume24h: parseFloat(row.quoteVolume),
//     history: [], // plug in a sparkline array from another endpoint if available
//   };
// }
//
// // Usage:
// // const [markets, setMarkets] = React.useState([]);
// // React.useEffect(() => {
// //   fetch("/your-ticker-endpoint")
// //     .then((r) => r.json())
// //     .then((rows) => setMarkets(rows.slice(0, 5).map(mapToMarket)));
// // }, []);
// // <TrendingMarkets items={markets} />
