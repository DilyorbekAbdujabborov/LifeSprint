import { Shield, Users, Target, Medal } from 'lucide-react';

interface EduTeamProps {
  xp: number;
  level: number;
  isDarkMode: boolean;
}

export default function EduTeam({ xp, level, isDarkMode }: EduTeamProps) {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edu Team</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Guruh bo'lib o'rganish va hamkorlik tizimi</p>
        </div>
      </div>

      <div className={`p-16 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        <Target className="w-10 h-10 mx-auto mb-3 text-blue-400" />
        <p className="text-base font-bold">Bu sohada ishlanmoqda</p>
        <p className="text-xs mt-2 max-w-md mx-auto leading-relaxed">
          Edu Team — talabalar guruh bo'lib o'quv maqsadlariga erishadi. 
          Birgalikda topshiriqlar bajarish, jamoa reytingi va guruh loyihalari 
          orqali hamkorlikda o'rganish tizimi. Eng yaxshi jamoalar bonus XP oladi!
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Jamoa</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Target className="w-4 h-4 text-green-400" />
            <span>Maqsadlar</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Medal className="w-4 h-4 text-yellow-500" />
            <span>Bonuslar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
