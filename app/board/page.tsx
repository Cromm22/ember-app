'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { getUserData, getTodayEntries } from '@/lib/storage';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sarah M.', level: 8, stage: 'Blaze', score: 2450 },
  { rank: 2, name: 'Mike T.', level: 7, stage: 'Blaze', score: 2280 },
  { rank: 3, name: 'Jules Park', level: 3, stage: 'Spark', score: 1650, isUser: true },
  { rank: 4, name: 'Emma L.', level: 5, stage: 'Spark', score: 1420 },
  { rank: 5, name: 'Alex K.', level: 4, stage: 'Spark', score: 1190 },
];

export default function BoardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);

  useEffect(() => {
    const data = getUserData();
    const today = getTodayEntries();
    setUserData(data);
    setTodayData(today);
  }, []);

  if (!userData || !todayData) {
    return null;
  }

  const caloriesEaten = todayData.food.reduce((sum: number, entry: any) => sum + entry.calories * entry.servings, 0);
  const caloriesBurned = todayData.workout.reduce((sum: number, entry: any) => sum + entry.calories, 0);

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cream mb-6">Leaderboard</h1>

        <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e] mb-6">
          <h3 className="text-cream/60 text-sm mb-3">Your stats today</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-cream/60 text-xs mb-1">Calories logged</div>
              <div className="text-cream text-xl font-bold">{caloriesEaten} cal</div>
            </div>
            <div>
              <div className="text-cream/60 text-xs mb-1">Calories burned</div>
              <div className="text-orange text-xl font-bold">{caloriesBurned} cal</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((user) => (
            <div
              key={user.rank}
              className={`rounded-xl p-4 border ${
                user.isUser
                  ? 'bg-orange/10 border-orange/30'
                  : 'bg-plum border-[#2a1f2e]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                  user.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                  user.rank === 3 ? 'bg-orange/20 text-orange' :
                  'bg-plum text-cream/60'
                }`}>
                  {user.rank}
                </div>
                <div className="flex-1">
                  <div className="text-cream font-medium">{user.name}</div>
                  <div className="text-cream/60 text-sm">
                    {user.stage} · Lv {user.level}
                  </div>
                </div>
                <div className="text-cream font-bold">{user.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
