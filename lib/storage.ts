export interface UserData {
  username: string;
  level: number;
  xp: number;
  stage: 'Spark' | 'Blaze' | 'Inferno';
  calorieGoal: number;
  waterGoal: number;
  foodLog: FoodEntry[];
  workoutLog: WorkoutEntry[];
  waterLog: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  timestamp: number;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: number;
}

const DEFAULT_USER_DATA: UserData = {
  username: 'Jules Park',
  level: 3,
  xp: 450,
  stage: 'Spark',
  calorieGoal: 2000,
  waterGoal: 64,
  foodLog: [],
  workoutLog: [],
  waterLog: 0,
};

export function getUserData(): UserData {
  if (typeof window === 'undefined') return DEFAULT_USER_DATA;
  
  const stored = localStorage.getItem('ember_user_data');
  if (!stored) {
    localStorage.setItem('ember_user_data', JSON.stringify(DEFAULT_USER_DATA));
    return DEFAULT_USER_DATA;
  }
  return JSON.parse(stored);
}

export function saveUserData(data: Partial<UserData>) {
  if (typeof window === 'undefined') return;
  
  const current = getUserData();
  const updated = { ...current, ...data };
  localStorage.setItem('ember_user_data', JSON.stringify(updated));
}

export function addFoodEntry(entry: Omit<FoodEntry, 'id' | 'timestamp'>) {
  const data = getUserData();
  const newEntry: FoodEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  data.foodLog.push(newEntry);
  saveUserData({ foodLog: data.foodLog });
}

export function addWorkoutEntry(entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) {
  const data = getUserData();
  const newEntry: WorkoutEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  data.workoutLog.push(newEntry);
  saveUserData({ workoutLog: data.workoutLog });
}

export function getTodayEntries() {
  const data = getUserData();
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  
  return {
    food: data.foodLog.filter(e => e.timestamp >= startOfDay),
    workout: data.workoutLog.filter(e => e.timestamp >= startOfDay),
  };
}

export function resetDailyData() {
  saveUserData({ waterLog: 0 });
}
