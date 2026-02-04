import React, { useState } from 'react';
import { WOD } from '../types';
import { ICON_NAMES } from '../constants';

interface WODViewProps {
  wod: WOD | null;
  filteredResults: any[];
  onStart: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  selectedYear: string | null;
  onYearChange: (year: string | null) => void;
  availableYears: string[];
  onSelectWod: (jsonWod: any) => void;
  onShuffle: () => void;
  // Fix: Added theme to props
  theme: 'light' | 'dark';
}

const WODView: React.FC<WODViewProps> = ({ 
  wod, 
  filteredResults, 
  onStart, 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  selectedYear,
  onYearChange,
  availableYears,
  onSelectWod,
  onShuffle,
  // Fix: Destructured theme from props
  theme
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [modalWod, setModalWod] = useState<any | null>(null);

  const categories = [
    { label: 'STANDARD', value: 'STANDARD' },
    { label: 'FOR TIME', value: 'FOR_TIME' },
    { label: 'AMRAP', value: 'AMRAP' },
    { label: 'EMOM', value: 'EMOM' },
    { label: 'TABATA', value: 'TABATA' },
  ];

  const hasFilterActive = searchTerm.trim() !== '' || selectedCategory !== null || selectedYear !== null;

  const toggleYear = (year: string | null) => {
    onYearChange(year);
    setShowYearDropdown(false);
  };

  const handleWodDoubleClick = (item: any) => {
    onSelectWod(item);
    setModalWod(item);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 font-sans text-black dark:text-white transition-colors duration-500 overflow-hidden relative">
      {/* Header */}
      <header className="px-8 pt-12 pb-4 flex justify-between items-center z-10 bg-white dark:bg-zinc-950 transition-colors duration-500">
        <div>
          <h1 className="text-[44px] font-[900] font-heading leading-none tracking-tight text-zinc-900 dark:text-white">WOD</h1>
          <p className="text-zinc-400 dark:text-zinc-500 font-bold text-sm tracking-wide mt-1 uppercase">
            {wod?.date || 'CHOOSE WORKOUT'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800">
          <span className="text-white dark:text-zinc-900 font-serif text-2xl lowercase">h</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-8 pb-48 no-scrollbar transition-colors duration-500">
        {/* Search & Filters */}
        <div className="sticky top-0 bg-white dark:bg-zinc-950 pt-2 pb-4 z-30 transition-colors duration-500">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <iconify-icon 
                icon="solar:magnifer-linear" 
                class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 text-lg"
              ></iconify-icon>
              <input 
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className={`w-12 h-full rounded-2xl flex items-center justify-center transition-all ${
                  selectedYear ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <iconify-icon icon="solar:filter-bold-duotone" class="text-xl"></iconify-icon>
              </button>

              {showYearDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowYearDropdown(false)}></div>
                  <div className="absolute right-0 top-14 w-32 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden">
                    <button
                      onClick={() => toggleYear(null)}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-zinc-50 dark:border-zinc-700 ${
                        selectedYear === null ? 'text-primary bg-primary/5' : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      All Years
                    </button>
                    {availableYears.map(year => (
                      <button
                        key={year}
                        onClick={() => toggleYear(year)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${
                          selectedYear === year ? 'text-primary bg-primary/5' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={onShuffle}
              className="bg-zinc-50 dark:bg-zinc-900 w-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <iconify-icon icon="solar:shuffle-bold" class="text-xl text-zinc-600 dark:text-zinc-400"></iconify-icon>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(selectedCategory === cat.value ? null : cat.value)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                  selectedCategory === cat.value 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' 
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {hasFilterActive && (
          <div className="mb-10 animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-50 dark:border-zinc-900 pb-2">
              <p className="text-[12px] font-black text-primary uppercase tracking-widest">
                Found {filteredResults.length} sessions
              </p>
              <p className="text-[9px] text-zinc-300 dark:text-zinc-700 font-bold uppercase">Double tap for detail</p>
            </div>
            
            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2 no-scrollbar mb-4 bg-zinc-50/30 dark:bg-zinc-900/30 p-2 rounded-[32px]">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectWod(item)}
                    onDoubleClick={() => handleWodDoubleClick(item)}
                    className={`group w-full text-left p-5 rounded-[24px] transition-all duration-300 transform active:scale-[0.98] ${
                      wod?.id === item.id 
                        ? 'bg-white dark:bg-zinc-800 border-2 border-primary shadow-xl' 
                        : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                        wod?.id === item.id ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
                      }`}>
                        {item.type.replace('_', ' ')}
                      </span>
                      <iconify-icon icon="solar:maximize-square-minimalistic-bold-duotone" class="text-primary opacity-0 group-hover:opacity-100 transition-opacity"></iconify-icon>
                    </div>
                    <h4 className={`text-[17px] font-[900] uppercase tracking-tight leading-tight ${
                      wod?.id === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-400'
                    }`}>
                      {item.girl_name || item.hero_name || item.title}
                    </h4>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-200 dark:text-zinc-800">
                  <iconify-icon icon="solar:sad-circle-bold" class="text-5xl mb-2"></iconify-icon>
                  <p className="text-xs font-bold uppercase">Empty set</p>
                </div>
              )}
            </div>
          </div>
        )}

        {wod && !modalWod ? (
          <div key={wod.id} className="animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
            <div className="mb-6">
              <h2 className="text-[44px] font-black font-heading mb-3 uppercase tracking-tighter text-zinc-900 dark:text-white leading-[0.85] break-words">
                {wod.name}
              </h2>
              <div className="flex gap-6 text-[13px] text-zinc-400 dark:text-zinc-500 font-bold">
                <div className="flex items-center gap-2">
                  <iconify-icon icon={ICON_NAMES.CLOCK} class="text-xl text-zinc-900 dark:text-white"></iconify-icon>
                  <span>{wod.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <iconify-icon icon={ICON_NAMES.FIRE} class="text-xl text-zinc-900 dark:text-white"></iconify-icon>
                  <span>{wod.intensity} Intensity</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-100 dark:bg-zinc-900 w-full my-8 transition-colors duration-500"></div>

            <div className="mb-10">
              <h3 className="text-2xl font-black font-heading tracking-tight uppercase text-zinc-900 dark:text-white mb-8">Warm Up</h3>
              <div className="space-y-6">
                {wod.warmUp.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <span className="font-black text-lg text-zinc-900 dark:text-white">{idx + 1}</span>
                      </div>
                      <div>
                        <p className="font-black text-[17px] leading-tight text-zinc-800 dark:text-zinc-200">{ex.name}</p>
                        <p className="text-[10px] text-zinc-300 dark:text-zinc-700 font-bold uppercase tracking-widest">Active Prep</p>
                      </div>
                    </div>
                    <span className="font-black text-2xl tabular-nums text-zinc-900 dark:text-white">{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-zinc-100 dark:bg-zinc-900 w-full my-8 transition-colors duration-500"></div>

            <div className="pb-10">
              <h3 className="text-2xl font-black font-heading tracking-tight uppercase mb-4 text-zinc-900 dark:text-white">Workout</h3>
              <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 mb-6 relative group cursor-pointer active:scale-[0.99] transition-all hover:bg-zinc-100/50 dark:hover:bg-zinc-900/80" 
                   onClick={() => setModalWod(wod)}>
                <div className="flex justify-between items-start mb-6">
                  <p className="text-sm font-black tracking-tighter text-zinc-900 dark:text-white">{wod.workout.scheme}</p>
                  <iconify-icon icon="solar:maximize-bold-duotone" class="text-2xl text-primary opacity-0 group-hover:opacity-100 transition-opacity"></iconify-icon>
                </div>
                <div className="whitespace-pre-line text-[20px] font-black leading-[1.2] text-zinc-900 dark:text-zinc-200 tracking-tight line-clamp-4">
                  {wod.workout.description}
                </div>
                <div className="mt-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">View Full Card</div>
              </div>
            </div>
          </div>
        ) : (
          !hasFilterActive && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-20 dark:opacity-10">
              <iconify-icon icon="solar:dumbbell-large-bold-duotone" class="text-9xl mb-4 text-zinc-900 dark:text-white"></iconify-icon>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">Athlete Ready</p>
            </div>
          )
        )}
      </main>

      {/* RESTORED START WORKOUT BUTTON (Green with White Text) */}
      {wod && !modalWod && (
        <div className="absolute bottom-24 left-0 right-0 px-8 z-20">
          <button
            onClick={onStart}
            className="w-full bg-primary text-white h-[68px] rounded-[24px] shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.97] transition-all transform hover:brightness-105"
          >
            <iconify-icon icon="solar:play-bold" class="text-2xl text-white"></iconify-icon>
            <span className="text-[18px] font-black tracking-widest uppercase font-heading">START WORKOUT</span>
          </button>
        </div>
      )}

      {/* Premium 3D Detail Modal */}
      {modalWod && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md [perspective:2000px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
             {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-[350px] h-[350px] rounded-full opacity-20 bg-primary/25 blur-[100px] animate-pulse"
                  style={{ 
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '5s',
                    transform: `translate(${Math.sin(i)*60}px, ${Math.cos(i)*60}px)` 
                  }}
                />
             ))}
          </div>

          <div 
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-[48px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)] overflow-hidden [transform-style:preserve-3d]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: theme === 'dark' ? 'linear-gradient(180deg, #18181b 0%, #09090b 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
              animation: 'premiumCardEnter 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="p-10 pb-14 max-h-[80vh] overflow-y-auto no-scrollbar">
              <header className="flex justify-between items-center mb-10">
                <span className="bg-primary/10 text-primary px-5 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]">
                  {modalWod.type.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => setModalWod(null)}
                  className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center active:scale-90 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <iconify-icon icon="solar:close-circle-bold" class="text-3xl text-zinc-400 dark:text-zinc-600"></iconify-icon>
                </button>
              </header>

              <h2 className="text-[48px] font-black font-heading leading-[0.85] uppercase tracking-tighter text-zinc-900 dark:text-white mb-8 [text-shadow:0_4px_12px_rgba(0,0,0,0.05)]">
                {modalWod.girl_name || modalWod.hero_name || modalWod.title || modalWod.name}
              </h2>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[11px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] mb-4">Protocol</h4>
                  <p className="text-4xl font-[1000] tracking-tighter text-zinc-900 dark:text-white italic">
                    {modalWod.rounds > 0 ? `${modalWod.rounds} Rounds` : (modalWod.type === 'AMRAP' ? 'AMRAP' : 'For Time')}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] mb-4">Mission Details</h4>
                  <div className="text-[21px] font-black leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-200 whitespace-pre-line bg-white/50 dark:bg-zinc-950/50 p-8 rounded-[40px] border border-white dark:border-zinc-800 shadow-sm ring-1 ring-zinc-50 dark:ring-zinc-900">
                    {modalWod.description || modalWod.workout?.description}
                  </div>
                </div>

                {modalWod.equipment && modalWod.equipment.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] mb-4">Arsenal</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {modalWod.equipment.map((item: string, i: number) => (
                        <span key={i} className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[18px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-zinc-900/10">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RESTORED MODAL BUTTON (Green with White Text) */}
              <button
                onClick={() => { setModalWod(null); onStart(); }}
                className="w-full bg-primary text-white h-[76px] rounded-[28px] mt-12 shadow-2xl flex items-center justify-center gap-4 active:scale-[0.96] transition-all font-black uppercase tracking-[0.2em] text-sm group"
              >
                START WORKOUT
                <iconify-icon icon="solar:arrow-right-bold" class="text-xl text-white group-hover:translate-x-1 transition-transform"></iconify-icon>
              </button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setModalWod(null)}></div>
        </div>
      )}

      <style>{`
        @keyframes premiumCardEnter {
          0% { 
            transform: rotateY(-40deg) rotateX(10deg) scale(0.8) translateY(60px); 
            opacity: 0; 
            filter: blur(10px);
          }
          100% { 
            transform: rotateY(0deg) rotateX(0deg) scale(1) translateY(0); 
            opacity: 1; 
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default WODView;
