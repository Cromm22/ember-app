"use client";

import { useState } from "react";
import { useEmber } from "@/lib/store";
import type { LogKind } from "@/lib/types";

interface QuickItem {
  label: string;
  detail: string;
  xp: number;
  emoji: string;
}

const MEALS: QuickItem[] = [
  { label: "Balanced plate", detail: "Veg + protein + grains", xp: 40, emoji: "🥗" },
  { label: "Protein boost", detail: "Lean protein serving", xp: 30, emoji: "🍗" },
  { label: "Fruit & water", detail: "Hydration + vitamins", xp: 25, emoji: "🍎" },
  { label: "Home-cooked", detail: "Made it yourself", xp: 35, emoji: "🍲" },
];

const WORKOUTS: QuickItem[] = [
  { label: "Run", detail: "Cardio session", xp: 55, emoji: "🏃" },
  { label: "Strength", detail: "Resistance training", xp: 50, emoji: "🏋️" },
  { label: "Yoga", detail: "Mobility & recovery", xp: 35, emoji: "🧘" },
  { label: "Walk", detail: "Active steps", xp: 20, emoji: "🚶" },
];

function QuickButton({
  item,
  kind,
  onAdd,
}: {
  item: QuickItem;
  kind: LogKind;
  onAdd: (kind: LogKind, label: string, detail: string, xp: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onAdd(kind, item.label, item.detail, item.xp)}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-amber-400/60 hover:bg-amber-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <span className="flex items-center gap-3">
        <span className="text-2xl">{item.emoji}</span>
        <span>
          <span className="block text-sm font-medium text-amber-50">
            {item.label}
          </span>
          <span className="block text-xs text-amber-100/50">{item.detail}</span>
        </span>
      </span>
      <span className="rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-200 group-hover:bg-amber-400/25">
        +{item.xp}
      </span>
    </button>
  );
}

export default function LogPanel() {
  const { addEntry } = useEmber();
  const [tab, setTab] = useState<LogKind>("meal");
  const items = tab === "meal" ? MEALS : WORKOUTS;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-amber-50">Log activity</h2>
        <div className="flex rounded-full bg-white/5 p-1 text-sm">
          <button
            type="button"
            onClick={() => setTab("meal")}
            className={`rounded-full px-4 py-1 transition ${
              tab === "meal"
                ? "bg-amber-400 text-black"
                : "text-amber-100/60 hover:text-amber-50"
            }`}
          >
            Meals
          </button>
          <button
            type="button"
            onClick={() => setTab("workout")}
            className={`rounded-full px-4 py-1 transition ${
              tab === "workout"
                ? "bg-amber-400 text-black"
                : "text-amber-100/60 hover:text-amber-50"
            }`}
          >
            Workouts
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <QuickButton
            key={item.label}
            item={item}
            kind={tab}
            onAdd={addEntry}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-amber-100/40">
        Every log feeds your Ember. Keep the streak alive to level up faster.
      </p>
    </section>
  );
}
