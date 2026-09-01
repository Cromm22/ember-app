'use client';

import { useEffect, useState } from 'react';
import FlameAvatar from '@/components/FlameAvatar';
import BottomNav from '@/components/BottomNav';
import { getUserData, getTodayEntries, saveUserData } from '@/lib/storage';
import Link from 'next/link';

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [showWaterModal, setShowWaterModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getUserData();
    const today = getTodayEntries();
    setUserData(data);
    setTodayData(today);
  };

  if (!userData || !todayData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dusk">
        <div className="text-cream">Loading...</div>
      </div>
    );
  }

  const caloriesEaten = todayData.food.reduce((sum: number, entry: any) => sum + entry.calories * entry.servings, 0);
  const caloriesBurned = todayData.workout.reduce((sum: number, entry: any) => sum + entry.calories, 0);
  const caloriesRemaining = userData.calorieGoal + caloriesBurned - caloriesEaten;

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <FlameAvatar stage={userData.stage} level={userData.level} />
        </div>

        <div className="space-y-4">
          <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e]">
            <h3 className="text-cream/60 text-sm mb-3">Calories</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-cream">{Math.max(0, caloriesRemaining)}</span>
              <span className="text-cream/60 text-lg">remaining</span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div>
                <span className="text-cream/60">Goal: </span>
                <span className="text-cream font-medium">{userData.calorieGoal}</span>
              </div>
              <div>
                <span className="text-cream/60">Food: </span>
                <span className="text-cream font-medium">{caloriesEaten}</span>
              </div>
              {caloriesBurned > 0 && (
                <div>
                  <span className="text-cream/60">Exercise: </span>
                  <span className="text-orange font-medium">{caloriesBurned}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowWaterModal(true)}
            className="w-full bg-plum rounded-2xl p-6 border border-[#2a1f2e] hover:border-orange/30 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-cream/60 text-sm">Stay hydrated</h3>
              <span className="text-cream text-sm">{userData.waterLog}/{userData.waterGoal} fl oz</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-12 rounded-lg border-2 ${
                    i < Math.floor((userData.waterLog / userData.waterGoal) * 8)
                      ? 'bg-orange/20 border-orange'
                      : 'border-cream/20'
                  }`}
                >
                  {i < Math.floor((userData.waterLog / userData.waterGoal) * 8) && (
                    <div className="w-full h-full flex items-end justify-center pb-1">
                      <span className="text-xs">🔥</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </button>

          <Link href="/board" className="block bg-plum rounded-2xl p-6 border border-[#2a1f2e] hover:border-orange/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-cream font-medium mb-1">Compete</h3>
                <p className="text-cream/60 text-sm">See how you rank</p>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          </Link>

          <Link href="/share" className="block bg-plum rounded-2xl p-6 border border-[#2a1f2e] hover:border-orange/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-cream font-medium mb-1">Share</h3>
                <p className="text-cream/60 text-sm">Connect with friends</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </Link>
        </div>
      </div>

      {showWaterModal && (
        <div className="fixed inset-0 bg-dusk/95 z-50 flex items-end">
          <div className="w-full bg-dusk rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cream">Stay hydrated</h2>
              <button
                onClick={() => setShowWaterModal(false)}
                className="text-cream/60 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cream">Today's progress</span>
                <span className="text-cream font-bold">{userData.waterLog}/{userData.waterGoal} fl oz</span>
              </div>
              <div className="flex gap-2 mb-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-16 rounded-lg border-2 ${
                      i < Math.floor((userData.waterLog / userData.waterGoal) * 8)
                        ? 'bg-orange/20 border-orange'
                        : 'border-cream/20'
                    }`}
                  >
                    {i < Math.floor((userData.waterLog / userData.waterGoal) * 8) && (
                      <div className="w-full h-full flex items-end justify-center pb-2">
                        <span className="text-lg">🔥</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => {
                    saveUserData({ waterLog: Math.max(0, userData.waterLog - 8) });
                    loadData();
                  }}
                  className="flex-1 bg-plum rounded-xl p-4 text-cream border border-[#2a1f2e]"
                >
                  − 8 fl oz
                </button>
                <button
                  onClick={() => {
                    saveUserData({ waterLog: userData.waterLog + 8 });
                    loadData();
                  }}
                  className="flex-1 bg-orange rounded-xl p-4 text-cream"
                >
                  + 8 fl oz
                </button>
              </div>

              <div className="mb-4">
                <label className="text-cream/60 text-sm mb-2 block">Daily goal (fl oz)</label>
                <input
                  type="number"
                  value={userData.waterGoal}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 64;
                    saveUserData({ waterGoal: value });
                    loadData();
                  }}
                  className="w-full bg-plum border border-[#2a1f2e] rounded-xl px-4 py-3 text-cream"
                />
                <div className="text-cream/60 text-xs mt-2">
                  ≈ {Math.round((userData.waterGoal * 29.5735) / 1000)} mL
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
