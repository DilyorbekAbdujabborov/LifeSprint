import React from 'react';
import { useStore } from '../store';
import { Trophy } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import AiAdventures from './AiAdventures';

export default function GameZone() {
  const { xp, level, coins } = useStore();
  const { isDarkMode } = useTheme();

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Trophy className="w-6 h-6 text-amber-400 fill-amber-400" />
            AI Adventures
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>AI kuchidan foydalanib, organishni qiziqarli o'yinga aylantir</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-purple-400 font-bold font-mono">{xp} XP</span>
          <span className="text-amber-400 font-bold font-mono">{coins} coin</span>
          <span className="text-emerald-400 font-bold font-mono">Lv.{level}</span>
        </div>
      </div>

      <AiAdventures />
    </div>
  );
}
