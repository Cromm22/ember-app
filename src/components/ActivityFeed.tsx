"use client";

import { useEmber } from "@/lib/store";

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ActivityFeed() {
  const { state } = useEmber();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 text-lg font-semibold text-amber-50">
        Recent activity
      </h2>
      {state.log.length === 0 ? (
        <p className="text-sm text-amber-100/40">
          Nothing logged yet. Add a meal or workout to wake your Ember up.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {state.log.slice(0, 6).map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">
                  {entry.kind === "meal" ? "🍽️" : "💪"}
                </span>
                <span>
                  <span className="block text-sm text-amber-50">
                    {entry.label}
                  </span>
                  <span className="block text-xs text-amber-100/40">
                    {entry.detail} · {timeAgo(entry.at)}
                  </span>
                </span>
              </span>
              <span className="text-xs font-semibold text-amber-200">
                +{entry.xp} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
