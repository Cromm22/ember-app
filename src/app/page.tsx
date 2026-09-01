"use client";

import { EmberProvider, useEmber } from "@/lib/store";
import { levelFromXp } from "@/lib/game";
import Avatar from "@/components/Avatar";
import StatBar from "@/components/StatBar";
import LogPanel from "@/components/LogPanel";
import Leaderboard from "@/components/Leaderboard";
import ActivityFeed from "@/components/ActivityFeed";

function Dashboard() {
  const { state, ready, reset } = useEmber();
  const { level, intoLevel, needed } = levelFromXp(state.xp);
  const intensity = needed > 0 ? intoLevel / needed : 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-50">
            <span className="text-amber-400">Ember</span>
          </h1>
          <p className="text-sm text-amber-100/50">
            Log meals &amp; workouts. Grow your living flame.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/10 px-4 py-2 text-xs text-amber-100/60 transition hover:border-white/30 hover:text-amber-50"
        >
          Reset
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent p-6">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
              <Avatar level={level} intensity={intensity} />
              <div className="flex-1">
                <StatBar
                  level={level}
                  intoLevel={intoLevel}
                  needed={needed}
                  totalXp={state.xp}
                  streak={state.streak}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <LogPanel />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Leaderboard />
          <ActivityFeed />
        </div>
      </div>

      {!ready && (
        <p className="mt-6 text-center text-xs text-amber-100/30">Loading…</p>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <EmberProvider>
      <Dashboard />
    </EmberProvider>
  );
}
