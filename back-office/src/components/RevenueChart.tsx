"use client";

import { revenueByMonth } from "@/lib/mockData";

export default function RevenueChart() {
  const max = Math.max(...revenueByMonth.map((d) => d.value));
  return (
    <div className="flex h-56 items-end gap-2 pt-4">
      {revenueByMonth.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-indigo-500/80 transition-all hover:bg-indigo-600"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.month}: $${d.value}k`}
            />
          </div>
          <span className="text-xs text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
