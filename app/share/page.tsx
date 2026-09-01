'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { getUserData, getTodayEntries } from '@/lib/storage';

export default function SharePage() {
  const [userData, setUserData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

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
  const caloriesRemaining = userData.calorieGoal + caloriesBurned - caloriesEaten;

  const handleShare = () => {
    const shareText = `🔥 ${userData.stage} (Lv ${userData.level})\n${caloriesRemaining} cal remaining today\nJoin me on Ember!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Ember Progress',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cream mb-6">Share</h1>

        <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e] mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🔥</div>
            <div className="text-2xl font-bold text-cream mb-1">{userData.stage}</div>
            <div className="text-cream/60 text-sm">Level {userData.level}</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-cream/60">Remaining today</span>
              <span className="text-cream font-bold">{Math.max(0, caloriesRemaining)} cal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream/60">Food logged</span>
              <span className="text-cream font-bold">{caloriesEaten} cal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream/60">Exercise</span>
              <span className="text-orange font-bold">{caloriesBurned} cal</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-orange rounded-xl p-4 font-medium text-cream hover:bg-orange-light transition-colors"
          >
            {copied ? 'Copied to clipboard!' : 'Share progress'}
          </button>
        </div>

        <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e]">
          <h3 className="text-cream font-medium mb-4">Connect with friends</h3>
          <p className="text-cream/60 text-sm mb-4">
            Invite friends to join Ember and compete together. Share your progress and keep each other motivated!
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-dusk rounded-lg">
              <span className="text-2xl">📧</span>
              <span className="text-cream text-sm">Invite via email</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dusk rounded-lg">
              <span className="text-2xl">💬</span>
              <span className="text-cream text-sm">Share invite link</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
