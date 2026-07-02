"use client";

import { revenueByMonth } from "@/lib/mockData";

const CHART_HEIGHT = 200;

export default function RevenueChart() {
  const max = Math.max(...revenueByMonth.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 pt-4" style={{ height: CHART_HEIGHT + 24 }}>
      {revenueByMonth.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-indigo-500/80 transition-all hover:bg-indigo-600"
            style={{ height: Math.round((d.value / max) * CHART_HEIGHT) }}
            title={`${d.month}: $${d.value}k`}
          />
          <span className="text-xs text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
