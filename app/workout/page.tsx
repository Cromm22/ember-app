'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { getTodayEntries, addWorkoutEntry } from '@/lib/storage';

const QUICK_WORKOUTS = [
  { name: 'Outdoor walk', icon: '🚶', defaultCalories: 150 },
  { name: 'Indoor walk', icon: '🏃', defaultCalories: 120 },
  { name: 'Functional strength training', icon: '💪', defaultCalories: 200 },
  { name: 'Pool swim', icon: '🏊', defaultCalories: 250 },
  { name: 'High Intensity Interval training', icon: '🔥', defaultCalories: 300 },
  { name: 'Outdoor cycle', icon: '🚴', defaultCalories: 220 },
];

export default function WorkoutPage() {
  const [todayData, setTodayData] = useState<any>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const today = getTodayEntries();
    setTodayData(today);
  };

  if (!todayData) {
    return null;
  }

  const totalCalories = todayData.workout.reduce((sum: number, entry: any) => sum + entry.calories, 0);

  const handleQuickAdd = (workout: any) => {
    setSelectedWorkout(workout);
    setCalories(workout.defaultCalories);
    setShowAddWorkout(true);
  };

  const handleAddWorkout = () => {
    if (!selectedWorkout || calories <= 0) return;
    
    addWorkoutEntry({
      name: selectedWorkout.name,
      calories,
    });
    
    setShowAddWorkout(false);
    setSelectedWorkout(null);
    setCalories(0);
    loadData();
  };

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cream mb-6">Workout</h1>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-6xl">💪</span>
          </div>
          <div className="relative bg-plum rounded-2xl p-8 border border-[#2a1f2e] text-center">
            <div className="text-cream/60 text-sm mb-2">Calories burned</div>
            <div className="text-5xl font-bold text-orange">{totalCalories}</div>
            <div className="text-cream/60 text-sm mt-1">cal</div>
          </div>
        </div>

        <h2 className="text-cream text-lg font-medium mb-4">Quick add</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {QUICK_WORKOUTS.map((workout) => (
            <button
              key={workout.name}
              onClick={() => handleQuickAdd(workout)}
              className="bg-plum rounded-xl p-4 border border-[#2a1f2e] hover:border-orange/30 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{workout.icon}</div>
              <div className="text-cream text-sm">{workout.name}</div>
            </button>
          ))}
        </div>

        {todayData.workout.length > 0 && (
          <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e]">
            <h3 className="text-cream/60 text-sm mb-4">Today's workouts</h3>
            <div className="space-y-3">
              {todayData.workout.slice().reverse().map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="text-cream">{entry.name}</div>
                  <div className="text-orange font-medium">{entry.calories} cal</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddWorkout && selectedWorkout && (
        <div className="fixed inset-0 bg-dusk/95 z-50 flex items-end">
          <div className="w-full bg-dusk rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cream">Log workout</h2>
              <button
                onClick={() => {
                  setShowAddWorkout(false);
                  setSelectedWorkout(null);
                }}
                className="text-cream/60 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-plum rounded-xl p-4 border border-[#2a1f2e] mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedWorkout.icon}</span>
                <span className="text-cream font-medium">{selectedWorkout.name}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-cream/60 text-sm mb-2 block">Calories burned</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-plum border border-[#2a1f2e] rounded-xl px-4 py-3 text-cream"
              />
            </div>

            <button
              onClick={handleAddWorkout}
              disabled={calories <= 0}
              className="w-full bg-orange rounded-xl p-4 font-medium text-cream hover:bg-orange-light transition-colors disabled:opacity-50"
            >
              Log workout
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
