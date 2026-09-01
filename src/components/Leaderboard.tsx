"use client";

import { useEmber } from "@/lib/store";
import { levelFromXp } from "@/lib/game";

export default function Leaderboard() {
  const { state } = useEmber();

  const rows = [
    ...state.friends.map((f) => ({
      id: f.id,
      name: f.name,
      emoji: f.emoji,
      xp: f.xp,
      you: false,
    })),
    { id: "you", name: "You", emoji: "🔥", xp: state.xp, you: true },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-amber-50">Friends league</h2>
        <span className="text-xs text-amber-100/50">Weekly XP</span>
      </div>
      <ol className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <li
            key={row.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              row.you
                ? "border border-amber-400/50 bg-amber-400/10"
                : "bg-white/[0.02]"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i === 0
                  ? "bg-amber-400 text-black"
                  : "bg-white/10 text-amber-100/70"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-xl">{row.emoji}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-amber-50">
                {row.name}
                {row.you && (
                  <span className="ml-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                    you
                  </span>
                )}
              </span>
              <span className="block text-xs text-amber-100/50">
                Level {levelFromXp(row.xp).level}
              </span>
            </span>
            <span className="text-sm font-semibold text-amber-100/80">
              {row.xp.toLocaleString()}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
