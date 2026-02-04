
import React, { useState } from 'react';

interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  captionLayout?: 'dropdown';
}

const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, className }) => {
  const [viewDate, setViewDate] = useState(selected || new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1));
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), currentMonth));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(currentYear, parseInt(e.target.value)));
  };

  const days = [];
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);
  
  // Empty slots for days of previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
  }
  
  // Month days
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const isSelected = selected && date.toDateString() === selected.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();

    days.push(
      <button
        key={d}
        onClick={() => onSelect?.(date)}
        className={`h-9 w-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center
          ${isSelected ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}
          ${isToday && !isSelected ? 'border border-primary/30 text-primary' : ''}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={`p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors duration-500 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
           <select 
            value={currentMonth} 
            onChange={handleMonthChange}
            className="text-sm font-black uppercase tracking-tight bg-transparent border-none focus:ring-0 p-0 cursor-pointer text-zinc-900 dark:text-white"
           >
             {monthNames.map((m, i) => <option key={m} value={i} className="dark:bg-zinc-900">{m}</option>)}
           </select>
           <select 
            value={currentYear} 
            onChange={handleYearChange}
            className="text-sm font-black tracking-tight bg-transparent border-none focus:ring-0 p-0 cursor-pointer text-zinc-500 dark:text-zinc-400"
           >
             {years.map(y => <option key={y} value={y} className="dark:bg-zinc-900">{y}</option>)}
           </select>
        </div>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <iconify-icon icon="solar:alt-arrow-left-linear" class="text-zinc-400 dark:text-zinc-600"></iconify-icon>
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-zinc-400 dark:text-zinc-600"></iconify-icon>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="h-9 w-9 flex items-center justify-center text-[10px] font-black uppercase text-zinc-300 dark:text-zinc-700 tracking-widest">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

export default Calendar;
