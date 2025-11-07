import React from "react";

export default function AddAssetModal({
  open,
  onClose,
  onSubmit,
  symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT"],
  initialSymbol = "BTCUSDT",
  // NEW: redirect behavior
  redirectTo = "/input",
  navigate,             // pass router.push (Next) or useNavigate() (React Router)
  closeOnSubmit = true, // optional
}) {
  const [symbol, setSymbol] = React.useState(initialSymbol);
  const [current, setCurrent] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [useTPSL, setUseTPSL] = React.useState(false);
  const [tp, setTp] = React.useState("");
  const [sl, setSl] = React.useState("");

  const fetchPrice = React.useCallback(async (s) => {
    try {
      const r = await fetch(`/api/price?symbol=${s}`);
      const { price } = await r.json();
      setCurrent(Number(price));
      setPrice((prev) => (prev === "" ? String(price) : prev));
    } catch (e) {
      console.error(e);
    }
  }, []);

  React.useEffect(() => { if (open) fetchPrice(symbol); }, [open, symbol, fetchPrice]);
  React.useEffect(() => {
    if (!open) return;
    const id = setInterval(() => fetchPrice(symbol), 5000);
    return () => clearInterval(id);
  }, [open, symbol, fetchPrice]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const notional = price && qty ? Number(price) * Number(qty) : null;

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      symbol,
      price: Number(price),
      qty: Number(qty),
      tp: useTPSL && tp !== "" ? Number(tp) : null,
      sl: useTPSL && sl !== "" ? Number(sl) : null,
    };

    try {
      await onSubmit?.(payload);
    } finally {
      if (closeOnSubmit) onClose?.();
    }

    // --- NEW: navigate to /input (or custom path) ---
    if (redirectTo) {
      if (typeof navigate === "function") {
        navigate(redirectTo);          // SPA navigation (React Router / Next router.push)
      } else if (typeof window !== "undefined") {
        window.location.assign(redirectTo); // fallback full reload
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border bg-white text-gray-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Asset</h2>
          <button className="p-1 rounded-md hover:bg-black/5" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Cryptocurrency</label>
            <select className="mt-1 w-full rounded-lg border p-2"
                    value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              {symbols.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="mt-1 text-xs text-muted-foreground">
              Current: {current == null ? "…" : current.toLocaleString(undefined, { maximumFractionDigits: 8 })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Buy at</label>
              <input type="number" step="any" placeholder="Limit price"
                     className="mt-1 w-full rounded-lg border p-2"
                     value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Amount</label>
              <input type="number" step="any" placeholder="Quantity"
                     className="mt-1 w-full rounded-lg border p-2"
                     value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          </div>

          {notional != null && (
            <div className="text-xs text-muted-foreground">
              Order value ≈ {notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useTPSL} onChange={(e) => setUseTPSL(e.target.checked)} />
              <span className="text-sm font-medium">Enable TP/SL</span>
            </label>

            {useTPSL && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Take Profit (price)</label>
                  <input type="number" step="any" placeholder="e.g. 75000"
                         className="mt-1 w-full rounded-lg border p-2"
                         value={tp} onChange={(e) => setTp(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Loss (price)</label>
                  <input type="number" step="any" placeholder="e.g. 58000"
                         className="mt-1 w-full rounded-lg border p-2"
                         value={sl} onChange={(e) => setSl(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button>
            <button type="submit" className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
