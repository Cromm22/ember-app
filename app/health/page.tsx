'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FlameAvatar from '@/components/FlameAvatar';
import BottomNav from '@/components/BottomNav';
import { getUserData, getTodayEntries, syncWatchWorkouts } from '@/lib/storage';
import { decodeWatchPayload, watchRowsFromPayload } from '@/lib/watchSync';

export default function HealthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [watchSyncMessage, setWatchSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    handleWatchSync();
  }, []);

  const handleWatchSync = () => {
    const watchParam = searchParams.get('watch');
    if (!watchParam) return;

    const payload = decodeWatchPayload(watchParam);
    if (!payload) {
      setWatchSyncMessage('Failed to sync Apple Watch data');
      // Strip query even on failure
      router.replace('/health');
      return;
    }

    const watchEntries = watchRowsFromPayload(payload);
    syncWatchWorkouts(watchEntries, payload.day);
    
    setWatchSyncMessage(`Synced ${watchEntries.length} workout${watchEntries.length !== 1 ? 's' : ''} from Apple Watch`);
    
    // Strip query parameter after applying
    router.replace('/health');
    
    // Reload data to show updated workouts
    setTimeout(loadData, 100);
  };

  const loadData = () => {
    const data = getUserData();
    const today = getTodayEntries();
    setUserData(data);
    setTodayData(today);
  };

  if (!userData || !todayData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dusk min-h-screen">
        <div className="text-cream">Loading...</div>
      </div>
    );
  }

  const caloriesEaten = todayData.food.reduce((sum: number, entry: any) => sum + entry.calories * entry.servings, 0);
  const caloriesBurned = todayData.workout.reduce((sum: number, entry: any) => sum + entry.calories, 0);
  const caloriesRemaining = userData.calorieGoal + caloriesBurned - caloriesEaten;

  const watchWorkouts = todayData.workout.filter((w: any) => w.id.startsWith('watch-'));
  const manualWorkouts = todayData.workout.filter((w: any) => !w.id.startsWith('watch-'));

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cream mb-6">Health</h1>

        {watchSyncMessage && (
          <div className="mb-6 bg-orange/20 border border-orange rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⌚</span>
              <span className="text-cream">{watchSyncMessage}</span>
            </div>
          </div>
        )}

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
            <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
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

          {todayData.workout.length > 0 && (
            <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e]">
              <h3 className="text-cream/60 text-sm mb-4">Today's Workouts</h3>
              
              {watchWorkouts.length > 0 && (
                <div className="mb-4">
                  <div className="text-cream/40 text-xs mb-2 flex items-center gap-1">
                    <span>⌚</span>
                    <span>Apple Watch</span>
                  </div>
                  <div className="space-y-2">
                    {watchWorkouts.map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between pl-4">
                        <div className="text-cream text-sm">{entry.name}</div>
                        <div className="text-orange font-medium text-sm">{entry.calories} cal</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {manualWorkouts.length > 0 && (
                <div>
                  {watchWorkouts.length > 0 && (
                    <div className="text-cream/40 text-xs mb-2">Manual</div>
                  )}
                  <div className="space-y-2">
                    {manualWorkouts.map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between">
                        <div className="text-cream text-sm">{entry.name}</div>
                        <div className="text-orange font-medium text-sm">{entry.calories} cal</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
