
import React from 'react';
import { AppTab } from '../types';
import { ICON_NAMES } from '../constants';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.WOD, label: 'WOD', icon: ICON_NAMES.WOD },
    { id: AppTab.TIMER, label: 'Timer', icon: ICON_NAMES.TIMER },
    { id: AppTab.HISTORY, label: 'History', icon: ICON_NAMES.HISTORY },
    { id: AppTab.PROFILE, label: 'Profile', icon: ICON_NAMES.PROFILE },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 z-30 pb-4 h-20 transition-colors duration-500">
      <div className="flex justify-around items-center h-full px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 ${
              activeTab === tab.id ? 'text-[#58D289]' : 'text-gray-400 dark:text-zinc-600'
            }`}
          >
            <iconify-icon icon={tab.icon} className="text-2xl"></iconify-icon>
            <span className={`text-[9px] uppercase tracking-wider font-black`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
