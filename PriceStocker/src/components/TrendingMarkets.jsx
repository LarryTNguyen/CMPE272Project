import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

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

// --- Market row component ---
export const MarketRow = ({ item, index }) => {
  const isUp = item.change24hPct > 0;

  return (
    <div
      className="grid grid-cols-12 items-center gap-4 px-3 py-3 rounded-2xl hover:bg-muted/40 transition"
      role="row"
    >
      <div className="col-span-3 flex items-center gap-3" role="cell">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-sm font-semibold">
          {item.base.slice(0, 2)}
        </div>
        <div className="leading-tight">
          <div className="font-semibold">{item.base}/{item.quote}</div>
          <div className="text-xs text-muted-foreground">#{(index ?? 0) + 1} trending</div>
        </div>
      </div>

      <div className="col-span-2 font-medium" role="cell">
        {currency(item.last, "USD")}
      </div>

      <div
        className={`col-span-2 flex items-center gap-1 font-medium ${
          isUp ? "text-emerald-600" : "text-red-600"
        }`}
        role="cell"
      >
        {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {pct(item.change24hPct)}
      </div>

      <div className="col-span-2 text-muted-foreground" role="cell">
        {currency(item.high24h, "USD")}
      </div>

      <div className="col-span-2 text-muted-foreground" role="cell">
        {compact(item.volume24h)}
      </div>

      <div className="col-span-1 justify-self-end" role="cell">
        <Sparkline points={item.history} positive={isUp} />
      </div>
    </div>
  );
};

export default function TrendingMarkets() {
  const [items, setItems] = useState([]);

  const coins = ["bitcoin", "ethereum", "solana", "ripple", "dogecoin"];

  const fetchMarketData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(
          ","
        )}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      );
      const data = await res.json();

      const formatted = data.map((c) => ({
        symbol: c.symbol.toUpperCase() + "USDT",
        base: c.symbol.toUpperCase(),
        quote: "USDT",
        last: c.current_price,
        change24hPct: c.price_change_percentage_24h ?? 0,
        high24h: c.high_24h ?? 0,
        volume24h: c.total_volume ?? 0,
        history: c.sparkline_in_7d?.price?.slice(-10) ?? Array(10).fill(c.current_price),
      }));

      setItems(formatted);
    } catch (err) {
      console.error("Error fetching CoinGecko data:", err);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const timer = setInterval(fetchMarketData, 10000); // refresh every 10s
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-full overflow-hidden border-border/60">
      <CardContent className="p-0">
        <div
          className="grid grid-cols-12 gap-4 px-3 py-4 border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground"
          role="rowgroup"
        >
          <div className="col-span-3">Trading Pairs</div>
          <div className="col-span-2">Last Traded Price</div>
          <div className="col-span-2">24H Change</div>
          <div className="col-span-2">24H High</div>
          <div className="col-span-2">24H Trading Volume</div>
          <div className="col-span-1 justify-self-end">Chart</div>
        </div>

        <div role="rowgroup" className="divide-y">
          {items.map((m, i) => (
            <MarketRow key={m.symbol} item={m} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}