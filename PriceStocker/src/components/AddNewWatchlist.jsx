import React from 'react';
import { Plus } from 'lucide-react';

export default function AddNew({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border bg-background shadow-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    >
      <Plus className="h-4 w-4" />
      Add to Watchlist
    </button>
  );
}