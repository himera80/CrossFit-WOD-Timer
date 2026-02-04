
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AppTab, WOD, HistoryEntry } from './types';
import WODView from './components/WODView';
import TimerView from './components/TimerView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';

const WARMUP_EXERCISES = [
  { name: 'Jumping Jacks', min: 15, max: 30 },
  { name: 'Air Squats', min: 10, max: 20 },
  { name: 'Push-Ups', min: 5, max: 12 },
  { name: 'Mountain Climbers', min: 20, max: 40 },
  { name: 'Shoulder Taps', min: 10, max: 20 },
  { name: 'Inchworms', min: 5, max: 8 },
  { name: 'Bird-Dogs', min: 10, max: 16 },
  { name: 'Cat-Cows', min: 10, max: 15 },
  { name: 'High Knees', min: 20, max: 40 },
  { name: 'Butt Kicks', min: 20, max: 40 },
  { name: 'Leg Swings (ea)', min: 10, max: 15 },
  { name: 'Arm Circles', min: 15, max: 25 },
  { name: 'Scapular Pull-Ups', min: 8, max: 12 },
  { name: 'Cossack Squats', min: 10, max: 16 },
  { name: 'Burpees (Slow)', min: 5, max: 10 },
];

const generateRandomWarmUp = () => {
  const rounds = Math.random() > 0.5 ? 3 : 2;
  const shuffled = [...WARMUP_EXERCISES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3).map(ex => ({
    name: ex.name,
    reps: Math.floor(Math.random() * (ex.max - ex.min + 1)) + ex.min
  }));

  return {
    rounds,
    intensity: 'Low Intensity',
    exercises: selected
  };
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WOD);
  const [allWorkouts, setAllWorkouts] = useState<any[]>([]);
  const [currentWOD, setCurrentWOD] = useState<WOD | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Load and combine datasets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const files = ['data/wods.json', 'data/wods-2004.json'];
        const responses = await Promise.all(files.map(f => fetch(f)));
        const datasets = await Promise.all(responses.map(r => r.json()));
        
        const combinedWorkouts = datasets.flatMap(d => d.workouts);
        setAllWorkouts(combinedWorkouts);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique years from data for the filter
  // Fix: Explicitly ensure string type for localeCompare to avoid unknown type errors.
  const availableYears = useMemo(() => {
    const years = allWorkouts.map(w => String(w.date || '').split('-')[0]);
    return Array.from(new Set(years)).sort((a, b) => (b as string).localeCompare(a as string));
  }, [allWorkouts]);

  const mapWodData = useCallback((selectedJsonWod: any): WOD => {
    const dateObj = new Date(selectedJsonWod.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    
    return {
      id: selectedJsonWod.id,
      name: selectedJsonWod.girl_name || selectedJsonWod.hero_name || selectedJsonWod.title || 'CROSSFIT WOD',
      date: formattedDate,
      type: selectedJsonWod.type,
      difficulty: selectedJsonWod.time_cap ? `${selectedJsonWod.time_cap} mins cap` : '3 – 7 mins',
      intensity: 'High',
      duration: 'High Intensity',
      warmUp: generateRandomWarmUp(),
      workout: {
        scheme: selectedJsonWod.rounds > 0 ? `${selectedJsonWod.rounds} Rounds` : (selectedJsonWod.type === 'AMRAP' ? 'AMRAP' : 'For Time'),
        description: selectedJsonWod.description,
        exercises: selectedJsonWod.equipment ? selectedJsonWod.equipment.map((name: string) => ({ name, reps: '' })) : [{ name: 'Bodyweight', reps: '' }],
      },
      equipment: selectedJsonWod.equipment
    };
  }, []);

  // Filter logic: keywords + category + year
  const filteredWorkouts = useMemo(() => {
    return allWorkouts.filter(w => {
      const lowerSearch = searchTerm.toLowerCase().trim();
      const matchesSearch = !lowerSearch || 
        (w.title && w.title.toLowerCase().includes(lowerSearch)) || 
        (w.description && w.description.toLowerCase().includes(lowerSearch)) ||
        (w.girl_name && w.girl_name.toLowerCase().includes(lowerSearch)) ||
        (w.hero_name && w.hero_name.toLowerCase().includes(lowerSearch)) ||
        (w.equipment && w.equipment.some((e: string) => e.toLowerCase().includes(lowerSearch)));
      
      const matchesCategory = !selectedCategory || w.type === selectedCategory;
      const matchesYear = !selectedYear || w.date.startsWith(selectedYear);
      
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [allWorkouts, searchTerm, selectedCategory, selectedYear]);

  // Initial auto-selection
  useEffect(() => {
    if (!isLoading && allWorkouts.length > 0 && !currentWOD && !searchTerm && !selectedCategory && !selectedYear) {
      const randomIndex = Math.floor(Math.random() * allWorkouts.length);
      setCurrentWOD(mapWodData(allWorkouts[randomIndex]));
    }
  }, [isLoading, allWorkouts, currentWOD, mapWodData, searchTerm, selectedCategory, selectedYear]);

  const selectWod = (jsonWod: any) => {
    setCurrentWOD(mapWodData(jsonWod));
  };

  const startWorkout = () => {
    setActiveTab(AppTab.TIMER);
    setIsWorkoutActive(true);
  };

  const finishWorkout = useCallback((time: string) => {
    if (!currentWOD) return;
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      wodName: currentWOD.name,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase(),
      time,
      isPersonalBest: false,
    };
    setHistory(prev => [newEntry, ...prev]);
    setIsWorkoutActive(false);
    setActiveTab(AppTab.HISTORY);
  }, [currentWOD]);

  return (
    <div className="app-container">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isLoading && activeTab === AppTab.WOD && (
            <WODView 
              wod={currentWOD} 
              filteredResults={filteredWorkouts}
              onStart={startWorkout} 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              availableYears={availableYears}
              onSelectWod={selectWod}
              onShuffle={() => {
                if (filteredWorkouts.length > 0) {
                  const randomIndex = Math.floor(Math.random() * filteredWorkouts.length);
                  setCurrentWOD(mapWodData(filteredWorkouts[randomIndex]));
                }
              }}
            />
          )}
          
          {activeTab === AppTab.TIMER && currentWOD && (
            <TimerView wod={currentWOD} isActive={isWorkoutActive} onFinish={finishWorkout} />
          )}
          
          {activeTab === AppTab.HISTORY && (
            <HistoryView 
              history={history} 
              onGoToWod={() => setActiveTab(AppTab.WOD)} 
            />
          )}
          
          {activeTab === AppTab.PROFILE && (
            <ProfileView />
          )}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
