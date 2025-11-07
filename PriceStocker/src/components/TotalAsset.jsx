// components/TotalAssets.jsx
import React from "react";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

export default function TotalAssets({
  amount = 0,
  currency = "USD",
  className = "",
}) {
  const color =
    amount === 0 ? "text-muted-foreground" : amount > 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div
      className={`h-28 aspect-square rounded-2xl border bg-background shadow-sm p-4
                  flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="text-sm font-medium text-muted-foreground">Total Assets</div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
        {formatCurrency(amount, currency)}
      </div>
    </div>
  );
}
