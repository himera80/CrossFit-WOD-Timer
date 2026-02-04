
import React, { useState } from 'react';
import Calendar from './ui/Calendar';

interface ProfileViewProps {
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ theme = 'light', onThemeToggle }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: '28',
    height: '182',
    weight: '84',
    notifications: true,
    unit: 'LBS'
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1996, 5, 15));
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-6 pt-14 pb-32 animate-in slide-in-from-left-4 duration-300 overflow-y-auto no-scrollbar h-full bg-white dark:bg-zinc-950 transition-colors duration-500">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-primary p-1 shadow-2xl shadow-primary/20">
             <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-800">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
          <button className="absolute bottom-1 right-1 w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center text-white dark:text-zinc-900 border-2 border-white dark:border-zinc-800 shadow-lg active:scale-90 transition-transform">
            <iconify-icon icon="solar:camera-bold" class="text-sm"></iconify-icon>
          </button>
        </div>
        
        <div className="w-full px-4">
           <input 
              className="w-full text-center text-3xl font-heading font-[1000] tracking-tighter bg-transparent border-none focus:ring-0 p-0 outline-none placeholder:text-zinc-100 text-zinc-900 dark:text-white"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Full Name"
           />
           <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mt-2 animate-pulse">Tap name to edit</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-5 rounded-[32px] text-center border border-zinc-50 dark:border-zinc-800 shadow-sm">
           <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-60">Age</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none text-zinc-900 dark:text-white"
              value={profile.age}
              onChange={(e) => handleChange('age', e.target.value)}
           />
        </div>
        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-5 rounded-[32px] text-center border border-zinc-50 dark:border-zinc-800 shadow-sm">
           <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-60">Hgt (cm)</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none text-zinc-900 dark:text-white"
              value={profile.height}
              onChange={(e) => handleChange('height', e.target.value)}
           />
        </div>
        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-5 rounded-[32px] text-center border border-zinc-50 dark:border-zinc-800 shadow-sm">
           <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-60">Wgt (kg)</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none text-zinc-900 dark:text-white"
              value={profile.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
           />
        </div>
      </div>

      {/* Birth Date Section with Calendar */}
      <div className="mb-10">
        <h3 className="text-[11px] font-black mb-4 uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600 ml-4">Training Bio</h3>
        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-6 rounded-[36px] border border-zinc-50 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Date of Birth</p>
              <p className="text-[17px] font-black text-zinc-900 dark:text-white">
                {birthDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                showCalendar ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-700 shadow-sm'
              }`}
            >
              <iconify-icon icon="solar:calendar-bold-duotone" class="text-2xl"></iconify-icon>
            </button>
          </div>
          
          {showCalendar && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={(date) => {
                  setBirthDate(date);
                  if (date) {
                    const today = new Date();
                    let age = today.getFullYear() - date.getFullYear();
                    const m = today.getMonth() - date.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
                    handleChange('age', age.toString());
                  }
                }}
                className="w-full mt-2 dark:bg-zinc-800 dark:border-zinc-700"
                captionLayout="dropdown"
              />
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-full mt-4 py-3 bg-zinc-900 dark:bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg"
              >
                Apply Selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* App Preferences */}
      <div className="space-y-4 mb-10">
        <div className="flex justify-between items-center ml-4 mr-2 mb-4">
           <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600">Settings</h3>
           
           {/* THEME TOGGLE BUTTON - Adapted from KokonutUI code */}
           <button
             onClick={onThemeToggle}
             className="group relative h-10 px-4 flex items-center gap-2 rounded-xl transition-all duration-300 ease-out overflow-hidden
               bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 
               border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600
               shadow-sm active:shadow-none backdrop-blur-sm"
           >
              <div className="flex items-center gap-2 relative z-10">
                <iconify-icon 
                  icon="solar:sun-bold-duotone" 
                  class={`text-lg transition-all duration-700 ease-in-out ${
                    theme === 'dark' ? 'rotate-180 text-zinc-400' : 'rotate-0 text-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]'
                  }`}
                ></iconify-icon>
                <div className="relative h-4 overflow-hidden w-12 text-left">
                  <span className={`absolute inset-0 text-xs font-black uppercase tracking-widest transition-all duration-300 transform ${
                    theme === 'dark' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                  } text-zinc-600`}>Light</span>
                  <span className={`absolute inset-0 text-xs font-black uppercase tracking-widest transition-all duration-300 transform ${
                    theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  } text-zinc-300`}>Dark</span>
                </div>
              </div>
              
              {/* Animation Layer */}
              <span className="absolute inset-0 bg-gradient-to-r from-zinc-500/0 via-zinc-500/[0.05] to-zinc-500/0 dark:from-white/0 dark:via-white/[0.05] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></span>
           </button>
        </div>
        
        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-6 rounded-[36px] flex justify-between items-center border border-zinc-50 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                <iconify-icon icon="solar:bell-bold-duotone" class="text-primary text-xl"></iconify-icon>
              </div>
              <span className="font-black text-[16px] text-zinc-800 dark:text-zinc-200 tracking-tight">Notifications</span>
           </div>
           <button 
             onClick={() => handleChange('notifications', !profile.notifications)}
             className={`text-[11px] font-black tracking-widest px-5 py-2 rounded-2xl transition-all shadow-sm ${
               profile.notifications ? 'bg-primary text-white border-transparent' : 'bg-white dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-700'
             }`}
           >
              {profile.notifications ? 'ACTIVE' : 'MUTED'}
           </button>
        </div>

        <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-6 rounded-[36px] flex justify-between items-center border border-zinc-50 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                <iconify-icon icon="solar:ruler-bold-duotone" class="text-primary text-xl"></iconify-icon>
              </div>
              <span className="font-black text-[16px] text-zinc-800 dark:text-zinc-200 tracking-tight">System Units</span>
           </div>
           <button 
             onClick={() => handleChange('unit', profile.unit === 'LBS' ? 'KG' : 'LBS')}
             className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 font-black tracking-widest text-[11px] px-5 py-2 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 active:scale-95 transition-all"
           >
              {profile.unit}
           </button>
        </div>

        <button className="w-full bg-[#FFF5F5] dark:bg-red-950/20 p-6 rounded-[36px] flex justify-between items-center border border-red-50 dark:border-red-900/20 text-red-500 active:bg-red-100 dark:active:bg-red-900/30 transition-colors shadow-sm">
           <span className="font-black text-[16px] tracking-tight">Sign Out</span>
           <iconify-icon icon="solar:logout-3-bold-duotone" className="text-2xl"></iconify-icon>
        </button>
      </div>

      <div className="mt-8 text-center pb-4">
        <p className="text-[10px] font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-[0.5em]">CrossFit Labs • v2.9.1</p>
      </div>
    </div>
  );
};

export default ProfileView;
