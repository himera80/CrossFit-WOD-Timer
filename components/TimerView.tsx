
import React, { useState, useEffect, useRef } from 'react';
import { WOD } from '../types';
import { ICON_NAMES } from '../constants';

interface TimerViewProps {
  wod: WOD;
  isActive: boolean;
  onFinish: (time: string) => void;
}

type TimerPhase = 'IDLE' | 'PREP' | 'WORK' | 'PAUSED' | 'FINISHED';

const TimerView: React.FC<TimerViewProps> = ({ wod, isActive, onFinish }) => {
  // Determine if this is a countdown-style workout (AMRAP or has time cap)
  const isAMRAP = wod.type === 'AMRAP' || (wod.workout.scheme && wod.workout.scheme.includes('AMRAP'));
  const timeCapSeconds = wod.difficulty.includes('mins cap') 
    ? parseInt(wod.difficulty) * 60 
    : 20 * 60; // Default 20 mins for AMRAP if not specified

  const [phase, setPhase] = useState<TimerPhase>('IDLE');
  const [currentTime, setCurrentTime] = useState(isAMRAP ? timeCapSeconds : 0);
  const [prepTime, setPrepTime] = useState(10);
  const timerRef = useRef<number | null>(null);

  // Sync initial state with isActive prop
  useEffect(() => {
    if (isActive && phase === 'IDLE') {
      setPhase('PREP');
    }
  }, [isActive]);

  useEffect(() => {
    if (phase === 'PREP') {
      timerRef.current = window.setInterval(() => {
        setPrepTime((prev) => {
          if (prev <= 1) {
            setPhase('WORK');
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'WORK') {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (isAMRAP) {
            if (prev <= 1) {
              setPhase('FINISHED');
              clearInterval(timerRef.current!);
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isAMRAP]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (phase === 'IDLE') setPhase('PREP');
    else if (phase === 'PREP') setPhase('PAUSED');
    else if (phase === 'WORK') setPhase('PAUSED');
    else if (phase === 'PAUSED') {
      // Resume to wherever we were
      setPhase(prepTime > 0 ? 'PREP' : 'WORK');
    }
  };

  const handleReset = () => {
    setPhase('IDLE');
    setPrepTime(10);
    setCurrentTime(isAMRAP ? timeCapSeconds : 0);
  };

  const handleFinish = () => {
    onFinish(formatTime(isAMRAP ? timeCapSeconds - currentTime : currentTime));
  };

  // Visual Helper for prep phase
  const getTimerDisplay = () => {
    if (phase === 'PREP') return prepTime.toString();
    return formatTime(currentTime);
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-black animate-in fade-in duration-500 overflow-hidden relative">
      <header className="px-8 pt-12 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black font-heading tracking-tight text-black uppercase">
            {phase === 'PREP' ? 'PREPARE' : isAMRAP ? 'AMRAP' : 'FOR TIME'}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#5D4037] flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-white font-serif text-xl lowercase">h</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-20 px-6">
        <div className="flex flex-col items-center">
          {/* Main Display */}
          <div className={`font-black font-heading leading-none tracking-tighter tabular-nums transition-colors duration-300 ${
            phase === 'PREP' ? 'text-[#EF4444] text-[160px]' : 'text-black text-[100px]'
          }`}>
            {getTimerDisplay()}
          </div>
          
          {/* Exercise Info */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-black font-heading uppercase tracking-tight">
              {wod.name}
            </h2>
            <p className="text-[#A1A1AA] font-bold text-sm mt-2 tracking-widest uppercase">
              {phase === 'PREP' ? 'Get Ready!' : 'Work Period'}
            </p>
          </div>

          {/* Progress dots logic */}
          <div className="flex gap-2.5 mt-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  phase === 'WORK' && i <= 3 ? 'bg-[#58D289] scale-110' : 'border border-black'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-auto mb-32 flex flex-col items-center gap-8 w-full">
          <div className="relative">
            {/* Soft Glow Shadow for active states */}
            {(phase === 'WORK' || phase === 'PREP') && (
              <div className="absolute inset-0 bg-[#58D289] rounded-full blur-xl opacity-20 scale-150 animate-pulse"></div>
            )}
            <button
              onClick={handleTogglePlay}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 ${
                phase === 'PAUSED' || phase === 'IDLE' ? 'bg-[#58D289]' : 'bg-black'
              } text-white`}
            >
              <iconify-icon 
                icon={phase === 'PAUSED' || phase === 'IDLE' ? ICON_NAMES.PLAY : ICON_NAMES.PAUSE} 
                className="text-4xl"
              ></iconify-icon>
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full border border-black bg-white text-black font-black tracking-widest uppercase text-[10px] flex items-center gap-2 active:bg-gray-50 transition-colors"
            >
              <iconify-icon icon={ICON_NAMES.RESTART} className="text-xs"></iconify-icon>
              RESET
            </button>

            {(phase === 'PAUSED' || phase === 'FINISHED' || (phase === 'WORK' && isAMRAP && currentTime < timeCapSeconds - 10)) && (
              <button 
                onClick={handleFinish}
                className="px-8 py-3 rounded-full bg-black text-[#58D289] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
              >
                FINISH
              </button>
            )}
          </div>
        </div>
      </main>
      
      {/* Visual background pulse for prep phase last 3 seconds */}
      {phase === 'PREP' && prepTime <= 3 && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0"></div>
      )}
    </div>
  );
};

export default TimerView;
