
import React from 'react';
import { HistoryEntry } from '../types';
import { ICON_NAMES } from '../constants';

interface HistoryViewProps {
  history: HistoryEntry[];
  onGoToWod: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onGoToWod }) => {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white font-sans text-black animate-in fade-in duration-500">
      <header className="px-6 pt-14 pb-10 bg-white z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black font-heading tracking-tight text-black uppercase">
              History
            </h1>
            <p className="text-[#A1A1AA] font-bold text-sm tracking-widest uppercase mt-1">
              {currentMonth}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#5D4037] flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-serif text-2xl lowercase">h</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40 no-scrollbar">
        {history.length > 0 ? (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between py-8 border-b border-[#E4E4E7]/60 group active:bg-[#F4F4F5]/40 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-[0.2em]">
                  {entry.date}
                </p>
                <h2 className="text-2xl font-black font-heading tracking-tight uppercase">
                  {entry.wodName}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-black tabular-nums">{entry.time}</p>
                  {entry.isPersonalBest ? (
                    <p className="text-[10px] font-bold text-[#50C878] uppercase tracking-widest">
                      Personal Best
                    </p>
                  ) : (
                    <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">
                      Completed
                    </p>
                  )}
                </div>
                <iconify-icon
                  icon={ICON_NAMES.ARROW_RIGHT}
                  className="text-xl text-[#71717A]"
                ></iconify-icon>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <iconify-icon icon="solar:calendar-minimalistic-linear" className="text-4xl text-gray-300"></iconify-icon>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">No workouts yet</h3>
            <p className="text-sm text-gray-400 font-bold max-w-[200px] leading-relaxed">
              Your completed training sessions will appear here automatically.
            </p>
            <button 
              onClick={onGoToWod} 
              className="mt-8 text-[10px] font-black text-primary uppercase tracking-widest border-b-2 border-primary/20 pb-1 active:scale-95 transition-transform"
            >
              Go to WOD
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryView;
