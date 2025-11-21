import React from "react";
import { Briefcase } from "lucide-react";

const fmt = (n) =>
  Number(n ?? 0).toLocaleString("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 2 
  });

export default function TotalAsset({ summary, updating, err }) {
  const val = summary?.total_assets ?? 0;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Total Assets
            </p>
            {updating && <span className="text-xs text-blue-600">Updating...</span>}
            {err && <span className="text-xs text-red-600">Error</span>}
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{fmt(val)}</p>
      </div>
    </div>
  );
}