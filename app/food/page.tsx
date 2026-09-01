'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { getUserData, getTodayEntries, addFoodEntry, saveUserData } from '@/lib/storage';

export default function FoodPage() {
  const [userData, setUserData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [foodResult, setFoodResult] = useState<any>(null);
  const [servings, setServings] = useState(1);

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
    return null;
  }

  const caloriesEaten = todayData.food.reduce((sum: number, entry: any) => sum + entry.calories * entry.servings, 0);
  const caloriesBurned = todayData.workout.reduce((sum: number, entry: any) => sum + entry.calories, 0);
  const caloriesRemaining = userData.calorieGoal + caloriesBurned - caloriesEaten;

  const macros = todayData.food.reduce(
    (totals: any, entry: any) => ({
      protein: totals.protein + entry.protein * entry.servings,
      carbs: totals.carbs + entry.carbs * entry.servings,
      fat: totals.fat + entry.fat * entry.servings,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return;
    
    setLoading(true);
    setFoodResult(null);

    try {
      const offRes = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const offData = await offRes.json();
      
      if (offData.status === 1 && offData.product) {
        const nutriments = offData.product.nutriments || {};
        setFoodResult({
          name: offData.product.product_name || 'Unknown Product',
          calories: Math.round(nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0),
          protein: Math.round(nutriments.proteins_100g || 0),
          carbs: Math.round(nutriments.carbohydrates_100g || 0),
          fat: Math.round(nutriments.fat_100g || 0),
          source: 'OFF',
        });
        setLoading(false);
        return;
      }

      const usdaRes = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${barcode}&dataType=Foundation,SR%20Legacy`
      );
      const usdaData = await usdaRes.json();
      
      if (usdaData.foods && usdaData.foods.length > 0) {
        const food = usdaData.foods[0];
        const getNutrient = (id: number) => {
          const nutrient = food.foodNutrients?.find((n: any) => n.nutrientId === id);
          return Math.round(nutrient?.value || 0);
        };

        setFoodResult({
          name: food.description,
          calories: getNutrient(1008),
          protein: getNutrient(1003),
          carbs: getNutrient(1005),
          fat: getNutrient(1004),
          source: 'USDA',
        });
      } else {
        setFoodResult({
          name: 'Product not found',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          source: 'NONE',
        });
      }
    } catch (error) {
      setFoodResult({
        name: 'Error looking up product',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        source: 'ERROR',
      });
    }
    
    setLoading(false);
  };

  const handleAddFood = () => {
    if (!foodResult || foodResult.calories === 0) return;
    
    addFoodEntry({
      name: foodResult.name,
      calories: foodResult.calories,
      protein: foodResult.protein,
      carbs: foodResult.carbs,
      fat: foodResult.fat,
      servings,
    });
    
    setShowAddFood(false);
    setShowBarcode(false);
    setFoodResult(null);
    setBarcode('');
    setServings(1);
    loadData();
  };

  const handleEditGoal = (newGoal: number) => {
    saveUserData({ calorieGoal: newGoal });
    setShowEditGoal(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-dusk pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cream mb-6">Food</h1>

        <button
          onClick={() => setShowBarcode(true)}
          className="w-full bg-orange rounded-xl p-4 mb-6 font-medium text-cream hover:bg-orange-light transition-colors"
        >
          Scan barcode
        </button>

        <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e] mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-cream/60 text-sm">Remaining</h3>
            <button
              onClick={() => setShowEditGoal(true)}
              className="text-orange text-sm hover:text-orange-light"
            >
              Edit goal
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-cream mb-2">{Math.max(0, caloriesRemaining)}</div>
            <div className="text-cream/60 text-sm">cal remaining</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-cream/60 text-xs mb-1">GOAL</div>
              <div className="text-cream font-bold">{userData.calorieGoal}</div>
            </div>
            <div className="text-center">
              <div className="text-cream/60 text-xs mb-1">FOOD</div>
              <div className="text-cream font-bold">{caloriesEaten}</div>
            </div>
            <div className="text-center">
              <div className="text-cream/60 text-xs mb-1">EXERCISE</div>
              <div className="text-orange font-bold">{caloriesBurned}</div>
            </div>
          </div>
        </div>

        <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e] mb-4">
          <h3 className="text-cream/60 text-sm mb-4">Macros eaten</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-cream">Protein</span>
              <span className="text-cream font-medium">{Math.round(macros.protein)}g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream">Carbs</span>
              <span className="text-cream font-medium">{Math.round(macros.carbs)}g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream">Fat</span>
              <span className="text-cream font-medium">{Math.round(macros.fat)}g</span>
            </div>
          </div>
        </div>

        {todayData.food.length > 0 && (
          <div className="bg-plum rounded-2xl p-6 border border-[#2a1f2e]">
            <h3 className="text-cream/60 text-sm mb-4">Recents</h3>
            <div className="space-y-3">
              {todayData.food.slice(-5).reverse().map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-cream">{entry.name}</div>
                    <div className="text-cream/60 text-sm">
                      {entry.servings > 1 ? `${entry.servings} servings` : '1 serving'}
                    </div>
                  </div>
                  <div className="text-cream font-medium">{Math.round(entry.calories * entry.servings)} cal</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBarcode && (
        <div className="fixed inset-0 bg-dusk/95 z-50 flex items-end">
          <div className="w-full bg-dusk rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cream">Scan barcode</h2>
              <button
                onClick={() => {
                  setShowBarcode(false);
                  setFoodResult(null);
                  setBarcode('');
                }}
                className="text-cream/60 text-2xl"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="w-full bg-plum border border-[#2a1f2e] rounded-xl px-4 py-3 text-cream mb-4"
            />

            <button
              onClick={handleBarcodeSearch}
              disabled={loading}
              className="w-full bg-orange rounded-xl p-4 font-medium text-cream hover:bg-orange-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Looking up...' : 'Search'}
            </button>

            {foodResult && (
              <div className="mt-6 space-y-4">
                <div className="bg-plum rounded-xl p-4 border border-[#2a1f2e]">
                  <h3 className="text-cream font-medium mb-3">{foodResult.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-cream/60">Calories: </span>
                      <span className="text-cream">{foodResult.calories}</span>
                    </div>
                    <div>
                      <span className="text-cream/60">Protein: </span>
                      <span className="text-cream">{foodResult.protein}g</span>
                    </div>
                    <div>
                      <span className="text-cream/60">Carbs: </span>
                      <span className="text-cream">{foodResult.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-cream/60">Fat: </span>
                      <span className="text-cream">{foodResult.fat}g</span>
                    </div>
                  </div>
                </div>

                {foodResult.calories > 0 && (
                  <>
                    <div>
                      <label className="text-cream/60 text-sm mb-2 block">Servings</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                          className="bg-plum rounded-lg px-4 py-2 text-cream border border-[#2a1f2e]"
                        >
                          −
                        </button>
                        <span className="text-cream font-medium flex-1 text-center">{servings}</span>
                        <button
                          onClick={() => setServings(servings + 0.5)}
                          className="bg-plum rounded-lg px-4 py-2 text-cream border border-[#2a1f2e]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddFood}
                      className="w-full bg-orange rounded-xl p-4 font-medium text-cream hover:bg-orange-light transition-colors"
                    >
                      Add food
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showEditGoal && (
        <div className="fixed inset-0 bg-dusk/95 z-50 flex items-end">
          <div className="w-full bg-dusk rounded-t-3xl p-6">
            <h2 className="text-2xl font-bold text-cream mb-6">Edit calorie goal</h2>
            <input
              type="number"
              defaultValue={userData.calorieGoal}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  handleEditGoal(value);
                }
              }}
              className="w-full bg-plum border border-[#2a1f2e] rounded-xl px-4 py-3 text-cream mb-4"
            />
            <button
              onClick={() => setShowEditGoal(false)}
              className="w-full bg-plum rounded-xl p-4 text-cream border border-[#2a1f2e]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
