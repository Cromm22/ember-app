"use client";

interface StatBarProps {
  level: number;
  intoLevel: number;
  needed: number;
  totalXp: number;
  streak: number;
}

export default function StatBar({
  level,
  intoLevel,
  needed,
  totalXp,
  streak,
}: StatBarProps) {
  const pct = Math.min(100, Math.round((intoLevel / needed) * 100));

  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm uppercase tracking-widest text-amber-200/60">
            Level
          </span>
          <span className="text-3xl font-bold text-amber-50">{level}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-amber-100/70">
          <span title="Total XP earned">🔥 {totalXp.toLocaleString()} XP</span>
          <span title="Day streak">⚡ {streak}-day streak</span>
        </div>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-amber-100/50">
        {intoLevel} / {needed} XP to level {level + 1}
      </div>
    </div>
  );
}
