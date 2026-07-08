import { Sparkles, Flame, Trophy, Users, Calendar as CalendarIcon, Star, Play, PlusCircle, CheckCircle2 } from 'lucide-react';
import * as api from '../api';
import type { Group, Course } from '../types';
import type { AuthUser } from '../api';

interface Props {
  xp: number; coins: number; level: number;
  user: AuthUser | null; studentGroups: Group[];
  groups: Group[]; courses: Course[];
  setXp: (v: number) => void; setCoins: (v: number) => void; setLevel: (v: number) => void;
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  onNavigate: (tab: string) => void;
  onEnterGroup: (groupId: string) => void;
  triggerStatus: (msg: string) => void;
  isDarkMode: boolean;
}

export default function StudentOverview({
  xp, coins, level, user, studentGroups, groups,
  setXp, setLevel, setGroups, setCoins,
  onNavigate, onEnterGroup, triggerStatus, isDarkMode
}: Props) {
  const userDisplayName = user?.name || 'Biloliddin';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-6 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-extrabold tracking-widest bg-black/25 px-3 py-1 rounded-full uppercase">KOSMIK TA'LIM EKOTIZIMI</span>
          <h1 className="text-2xl sm:text-4xl font-bold">Salom, {userDisplayName}!</h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
            Kunlik challengeni bajarib qo'shimcha tangalarni yutib oling!
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[10px] bg-white/15 px-3 py-1.5 rounded-xl font-bold">Joriy reyting: 4-o'rin</span>
            <span className="text-[10px] bg-white/15 px-3 py-1.5 rounded-xl font-bold"><Flame className="w-3.5 h-3.5 inline fill-current" /> Streak: {level} kunlik zanjir</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: xp, label: "Umumiy ball (XP)", color: "purple", icon: Trophy },
          { value: coins, label: "Tangalar balansi", color: "amber", icon: Sparkles },
          { value: `${studentGroups.length} ta`, label: "O'quv guruhlarim", color: "emerald", icon: Users },
          { value: `${level} kun`, label: "Intizom streak", color: "rose", icon: Flame },
        ].map((stat) => (
          <div key={stat.label} className="p-5 bg-white dark:bg-[#151433] rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className={`text-2xl font-bold font-mono block text-${stat.color}-600`}>{stat.value}</span>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">{stat.label}</p>
            </div>
            <div className={`p-3 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* My Groups */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mening darslarim va faol guruhlarim</h2>
        </div>
        {studentGroups.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#151433] border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl space-y-4">
            <svg className="w-10 h-10 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
              <path d="M12 22V12" />
              <path d="M3.29 7 L7 4.5 L12 6.5" />
              <path d="M20.71 7 L17 4.5 L12 6.5" />
              <path d="M7 4.5 L17 4.5" />
            </svg>
            <h3 className="font-bold text-gray-700 dark:text-slate-200">Siz hali hech qanday guruhga qo'shilmagansiz.</h3>
            <button onClick={() => onNavigate('mock_store')} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">Kurslarni ko'rish</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentGroups.map((group) => (
              <div key={group.id} className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-full uppercase">{group.courseTitle}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">{group.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg text-amber-500 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-500" /> {group.rating}
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-500 dark:text-slate-400">
                  <div className="flex justify-between"><span>O'qituvchi:</span><strong className="text-gray-800 dark:text-white">{group.teacherName}</strong></div>
                  <div className="flex justify-between"><span>Sinfdoshlar:</span><strong className="text-gray-800 dark:text-white">{group.studentsCount} ta o'quvchi</strong></div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold"><span>O'zlashtirish:</span><span>{group.progress}%</span></div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full transition-all" style={{ width: `${group.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button onClick={() => onEnterGroup(group.id)} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">
                    <Play className="w-4 h-4 fill-current" /> Darsga kirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available groups */}
      {groups.filter((g) => !g.students.includes(user?.name || 'Biloliddin Akramov') && !(g.pendingStudents || []).includes(user?.name || 'Biloliddin Akramov')).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Boshqa ochiq darslar va guruhlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.filter((g) => !g.students.includes(user?.name || 'Biloliddin Akramov') && !(g.pendingStudents || []).includes(user?.name || 'Biloliddin Akramov')).map((group) => (
              <div key={group.id} className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full uppercase">{group.courseTitle || 'Kurs'}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">{group.name}</h3>
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-xs text-gray-500">O'qituvchi: {group.teacherName}</span>
                  <button onClick={() => {
                    setGroups((prev) => prev.map((g) => g.id === group.id ? { ...g, pendingStudents: [...(g.pendingStudents || []), user?.name || 'Biloliddin Akramov'] } : g));
                    api.rewardAndUpdate(setXp, null, setLevel, 'join_group');
                    triggerStatus(`"${group.name}" guruhiga ulanish so'rovi yuborildi! O'qituvchi tasdiqlashini kuting. (+50 XP)`);
                  }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" type="button">
                    <PlusCircle className="w-4 h-4 inline mr-1" /> Guruhga ulanish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Course Calendar */}
      {studentGroups.length > 0 && (
        <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-wider mb-4">
            <CalendarIcon className="w-5 h-5" />
            <span>Mening darslarim taqvimi</span>
          </div>
          {(() => {
            const allDays = studentGroups.flatMap(g => (g.courseDays || []).map(d => ({ date: d, time: g.courseTime || '14:00 - 15:30', group: g.name })));
            const uniqueDays = [...new Set(allDays.map(d => d.date))].sort();
            if (uniqueDays.length === 0) return <p className="text-xs text-gray-400">Dars jadvali hali belgilanmagan.</p>;
            return (
              <>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold border-b border-gray-100 dark:border-slate-800 pb-2 mb-2 text-gray-400">
                  {['Du','Se','Ch','Pa','Ju','Sha','Yak'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold font-mono">
                  {(() => {
                    const startDay = new Date(2026, 6, 1).getDay();
                    const cells: React.ReactNode[] = [];
                    for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} />);
                    for (let d = 1; d <= 31; d++) {
                      const dateStr = `2026-07-${String(d).padStart(2, '0')}`;
                      const isCourseDay = uniqueDays.includes(dateStr);
                      const dayInfo = isCourseDay ? allDays.filter(a => a.date === dateStr) : [];
                      cells.push(
                        <div key={d} className={`p-2 rounded-lg flex flex-col items-center justify-center relative ${isCourseDay ? 'bg-blue-500 text-white font-bold shadow-sm' : 'text-gray-800 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                          <span>{d}</span>
                          {dayInfo.length > 0 && (
                            <span className="text-[6px] leading-tight mt-0.5 opacity-80">{dayInfo[0].time}</span>
                          )}
                        </div>
                      );
                    }
                    return cells;
                  })()}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
