'use client';

import { useState } from 'react';
import supabase from '../services/superbase';
import PropTypes from 'prop-types';

export default function CloseTradeButton({
  tradeId,
  defaultClosePrice,
  disabled,
  onClosed,
}) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(
    defaultClosePrice != null ? String(defaultClosePrice) : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async () => {
  setSubmitting(true);
  setErr(null);

  const payload = {
    p_position_id: tradeId,           // must be a real positions_2.id
    p_close_price: Number(price),
  };

  console.log('RPC payload', payload);        // <-- verify both keys exist
  if (!payload.p_position_id) {
    setSubmitting(false);
    setErr('Missing position id for positions_2');
    return;
  }

  const { error } = await supabase.rpc('close_position2_v1', payload);
  setSubmitting(false);

  if (error) return setErr(error.message || 'Failed to close trade.');

  setOpen(false);
  onClosed?.();
};

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="px-3 py-1.5 rounded-xl text-sm font-medium shadow hover:shadow-md border
                   disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label="Close trade"
      >
        Close
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold">Close Trade</h3>
              <button
                type="button"
                className="px-2 py-1 rounded-lg border"
                onClick={() => setOpen(false)}
                disabled={submitting}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>

            <label htmlFor="close-price" className="block text-sm mb-1">
              Fill price
            </label>
            <input
              id="close-price"
              name="close-price"
              type="number"
              inputMode="decimal"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 mb-3"
              placeholder="e.g. 123.45"
            />

            {err && <p className="text-sm text-red-600 mb-2">{err}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-black text-white disabled:opacity-50"
                onClick={submit}
                disabled={submitting || !price}
              >
                {submitting ? 'Closing…' : 'Confirm close'}
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 mt-3">
              This calls the <code>close_trade</code> Postgres function to atomically update the order and
              insert a transaction row.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

CloseTradeButton.propTypes = {
  tradeId: PropTypes.string.isRequired,
  defaultClosePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  onClosed: PropTypes.func,
};

CloseTradeButton.defaultProps = {
  defaultClosePrice: undefined,
  disabled: false,
  onClosed: undefined,
};
