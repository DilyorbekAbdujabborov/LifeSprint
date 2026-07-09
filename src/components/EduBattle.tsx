import { Swords, Users, Trophy, Zap } from 'lucide-react';

interface EduBattleProps {
  xp: number;
  level: number;
  isDarkMode: boolean;
}

export default function EduBattle({ xp, level, isDarkMode }: EduBattleProps) {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
          <Swords className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edu Battle</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Talabalar o'rtasida bilim bellashuvi</p>
        </div>
      </div>

      <div className={`p-16 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        <Zap className="w-10 h-10 mx-auto mb-3 text-orange-400" />
        <p className="text-base font-bold">Bu sohada ishlanmoqda</p>
        <p className="text-xs mt-2 max-w-md mx-auto leading-relaxed">
          Edu Battle — talabalar bir-birlari bilan real vaqt rejimida bilim musobaqalashadi. 
          Har bir battle g'olibiga XP va coin mukofotlari beriladi. 
          Tez, aniq va strategik javoblar bilan reytingda ko'tariling!
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-xs">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Reyting</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-4 h-4 text-blue-400" />
            <span>1vs1</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Tezkor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
