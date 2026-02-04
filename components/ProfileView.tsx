
import React, { useState } from 'react';

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    level: 'Elite Athlete • Lvl 4',
    age: '28',
    height: '182',
    weight: '84',
    notifications: true,
    unit: 'LBS'
  });

  const handleChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-6 pt-14 pb-32 animate-in slide-in-from-left-4 duration-300 overflow-y-auto no-scrollbar h-full bg-white">
      {/* Header Info - Editable */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-primary p-1 shrink-0 shadow-lg shadow-primary/20">
           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="flex-1 min-w-0">
           <input 
              className="w-full text-3xl font-heading font-black tracking-tight bg-transparent border-none focus:ring-0 p-0 outline-none placeholder:text-gray-200"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your Name"
           />
           <input 
              className="w-full text-gray-400 text-sm font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 p-0 outline-none mt-1 placeholder:text-gray-200"
              value={profile.level}
              onChange={(e) => handleChange('level', e.target.value)}
              placeholder="Level / Rank"
           />
        </div>
      </div>

      {/* Grid Stats - Editable */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-[#F4F4F5] p-4 rounded-[24px] text-center border border-transparent focus-within:border-primary/30 transition-all">
           <p className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest opacity-60">Age</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none"
              value={profile.age}
              onChange={(e) => handleChange('age', e.target.value)}
           />
        </div>
        <div className="bg-[#F4F4F5] p-4 rounded-[24px] text-center border border-transparent focus-within:border-primary/30 transition-all">
           <p className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest opacity-60">Hgt (cm)</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none"
              value={profile.height}
              onChange={(e) => handleChange('height', e.target.value)}
           />
        </div>
        <div className="bg-[#F4F4F5] p-4 rounded-[24px] text-center border border-transparent focus-within:border-primary/30 transition-all">
           <p className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest opacity-60">Wgt (kg)</p>
           <input 
              type="number"
              className="w-full text-xl font-black font-heading bg-transparent border-none focus:ring-0 p-0 text-center outline-none"
              value={profile.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
           />
        </div>
      </div>

      {/* App Preferences - Editable */}
      <div className="space-y-4 mb-10">
        <h3 className="text-[11px] font-black mb-4 uppercase tracking-[0.25em] text-gray-400 ml-4">App Preferences</h3>
        
        <div className="bg-[#F4F4F5]/50 p-6 rounded-[32px] flex justify-between items-center border border-gray-100">
           <span className="font-bold text-[16px] text-gray-800">Notifications</span>
           <button 
             onClick={() => handleChange('notifications', !profile.notifications)}
             className="text-primary font-black tracking-widest text-sm px-4 py-2 bg-white rounded-2xl shadow-sm active:scale-95 transition-all border border-gray-100"
           >
              {profile.notifications ? 'ON' : 'OFF'}
           </button>
        </div>

        <div className="bg-[#F4F4F5]/50 p-6 rounded-[32px] flex justify-between items-center border border-gray-100">
           <span className="font-bold text-[16px] text-gray-800">Units</span>
           <button 
             onClick={() => handleChange('unit', profile.unit === 'LBS' ? 'KG' : 'LBS')}
             className="text-primary font-black tracking-widest text-sm px-4 py-2 bg-white rounded-2xl shadow-sm active:scale-95 transition-all border border-gray-100"
           >
              {profile.unit}
           </button>
        </div>

        <button className="w-full bg-[#F4F4F5]/50 p-6 rounded-[32px] flex justify-between items-center border border-gray-100 text-red-500 active:bg-red-50 transition-colors">
           <span className="font-bold text-[16px]">Logout Account</span>
           <iconify-icon icon="solar:logout-3-bold" className="text-2xl"></iconify-icon>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">CrossFit Labs • v2.8.4</p>
      </div>
    </div>
  );
};

export default ProfileView;
