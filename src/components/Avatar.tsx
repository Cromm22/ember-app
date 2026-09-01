"use client";

import { stageForLevel } from "@/lib/game";

interface AvatarProps {
  level: number;
  intensity: number; // 0..1 progress into current level
}

export default function Avatar({ level, intensity }: AvatarProps) {
  const stage = stageForLevel(level);
  // Scale grows with level but is clamped so it always fits its container.
  const scale = Math.min(1.6, 0.7 + level * 0.06);
  const glow = 0.35 + intensity * 0.5;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="ember-orbit relative flex h-56 w-56 items-center justify-center"
        aria-label={`${stage.name}, level ${level}`}
      >
        <div
          className="ember-aura absolute inset-0 rounded-full"
          style={{ opacity: glow }}
        />
        <div
          className="ember-body relative"
          style={{ transform: `scale(${scale})` }}
        >
          <span className="ember-flame ember-flame-back" />
          <span className="ember-flame ember-flame-mid" />
          <span className="ember-flame ember-flame-core" />
          <span className="ember-face">
            <span className="ember-eye ember-eye-l" />
            <span className="ember-eye ember-eye-r" />
          </span>
        </div>
        {Array.from({ length: Math.min(6, level) }).map((_, i) => (
          <span
            key={i}
            className="ember-spark"
            style={{
              // deterministic positions so SSR and client match
              left: `${18 + ((i * 37) % 64)}%`,
              animationDelay: `${(i * 0.4).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
          Stage {stage.index + 1}
        </div>
        <div className="text-2xl font-semibold text-amber-50">{stage.name}</div>
        <div className="mt-1 text-sm text-amber-100/60">{stage.tagline}</div>
      </div>
    </div>
  );
}
