import { Sparkles, Flame, Trophy, Users, Calendar as CalendarIcon, Star, Play, CheckCircle2 } from 'lucide-react';
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
  setCourses?: (v: Course[] | ((prev: Course[]) => Course[])) => void;
}

export default function StudentOverview({
  xp, coins, level, user, studentGroups, groups, courses,
  setXp, setLevel, setGroups, setCoins,
  onNavigate, onEnterGroup, triggerStatus, isDarkMode, setCourses
}: Props) {
  const userDisplayName = user?.name || 'Biloliddin';
  const enrolledCourses = courses.filter((c) => c.enrolled);

  return (
    <div className="space-y-6">
      {/* Hero Banner - Indigo (ziyohrang) gradient */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 sm:p-8 rounded-3xl text-white shadow-lg overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white font-bold text-xs tracking-widest">🚀 AI TA'LIM 2.0</div>
            <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">Salom, {userDisplayName}!</h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-medium">
            🎯 Kunlik vazifalarni bajarib, XP yutib, yangi skilllar egasini bo'l! AI Murabbiyingiz hamma vaqt tayyor.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl font-bold text-sm">
              <Trophy className="w-4 h-4" /> Reyting: 4-o'rin
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl font-bold text-sm">
              <Flame className="w-4 h-4 text-orange-300 fill-current" /> {level} kunlik streak
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl font-bold text-sm">
              ⭐ Premium Akses
            </div>
          </div>
        </div>
      </div>

      {/* Stats row - Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: xp, label: "Umumiy XP", color: "from-indigo-500 to-violet-600", icon: Trophy },
          { value: coins, label: "Tangalar", color: "from-violet-500 to-purple-600", icon: Sparkles },
          { value: `${studentGroups.length}`, label: "Guruhlar", color: "from-purple-500 to-fuchsia-600", icon: Users },
          { value: level, label: "Streak (kun)", color: "from-fuchsia-500 to-pink-600", icon: Flame },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 bg-gradient-to-br ${stat.color} rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-white relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-2">
              <span className="text-4xl font-black block">{stat.value}</span>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wide">{stat.label}</p>
            </div>
            <stat.icon className="absolute bottom-2 right-2 w-8 h-8 text-white/20" />
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white">🤖 AI Maslahatlar</h3>
            <p className="text-xs text-gray-600 dark:text-slate-400">Shaxsiy tavsiyalar va mo'jiza planlar</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'IELTS Strategiya', desc: 'AI yazib bergan 30 kunlik plan', icon: '📚' },
            { title: 'SAT Maaster Klass', desc: 'Math va Reading uchun tips', icon: '🎯' },
            { title: 'Portfolio AI', desc: 'Universitetlar uchun tayyorlash', icon: '✨' },
          ].map((rec) => (
            <button key={rec.title} onClick={() => onNavigate('ai')} className="p-4 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400">
              <span className="text-2xl">{rec.icon}</span>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-2">{rec.title}</h4>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">{rec.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* My Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Sotib olgan kurslarim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${
                course.color === 'purple' ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' :
                course.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' :
                'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
              }`}>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{course.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{course.teacherName}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    course.color === 'purple' ? 'bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                    course.color === 'blue' ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                    'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                  }`}>Faol</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2 mb-3">{course.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400 mt-3">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    ⭐ {course.rating.toFixed(1)} ({course.ratingCount})
                  </span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Groups */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mening faol guruhlarim</h2>
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
