// components/TotalProgress.jsx
import React from "react";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

const formatPercent = (p) => `${p > 0 ? "+" : ""}${p.toFixed(2)}%`; // pass 12.34 for 12.34%

function TotalProgress({
  amount = 0,        // absolute P/L in account currency (e.g., 1250.45 or -320.12)
  percent = 0,       // P/L percent, e.g., 12.34 or -7.89 (NOT 0.1234)
  currency = "USD",
  className = "",
}) {
  const [showPercent, setShowPercent] = React.useState(false);

  const isProfit = amount > 0 || (amount === 0 && percent > 0);
  const color =
    amount === 0 && percent === 0
      ? "text-muted-foreground"
      : isProfit
      ? "text-emerald-600"
      : "text-red-600";

  const displayValue = showPercent
    ? formatPercent(percent)
    : formatCurrency(amount, currency);

  return (
    <button
      type="button"
      onClick={() => setShowPercent((v) => !v)}
      aria-pressed={showPercent}
      className={`w-56 h-28 rounded-2xl border bg-background shadow-sm p-3 text-left
                  hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      title="Toggle amount/percentage"
    >
      <div className="text-sm font-medium text-muted-foreground">Total Profit/Loss</div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>{displayValue}</div>
    </button>
  );
}

export default TotalProgress;
export { TotalProgress };