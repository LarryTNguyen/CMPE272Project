import React from "react";

const fmt = (n) =>
  Number(n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function TotalCash({ summary, updating, err }) {
  const val = summary?.cash ?? 0;
  return (
    <div className="h-28 aspect-square rounded-2xl border bg-background shadow-sm p-4 flex flex-col items-center justify-center text-center">
      <div className="text-sm font-medium text-muted-foreground">
        Buying Power {updating && <span className="ml-1 text-xs">• updating</span>}
        {err && <span className="ml-1 text-xs text-red-600">• error</span>}
      </div>
      <div className="mt-2 text-5xl font-bold tracking-tight text-green-600">{fmt(val)}</div>
    </div>
  );
}
