import { useState } from 'react';
import { MessageSquare, Send, Play, Check, Video, Star, Users2, Calendar } from 'lucide-react';
import * as api from '../api';
import type { Group, Lesson } from '../types';

interface Props {
  groups: Group[];
  studentGroups: Group[];
  xp: number; coins: number;
  setXp: (v: number) => void; setCoins: (v: number) => void; setLevel: (v: number) => void;
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  triggerStatus: (msg: string) => void;
  isDarkMode: boolean;
}

export default function StudentGroupsView(props: Props) {
  const { groups, studentGroups, setXp, setCoins, setLevel, setGroups, triggerStatus } = props;
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [localChats, setLocalChats] = useState<Record<string, { author: string; text: string; time: string; isMe?: boolean }[]>>({});

  const sendMessage = (groupId: string) => {
    const text = chatInputs[groupId] || '';
    if (!text.trim()) return;
    const msg = { author: 'Biloliddin Akramov', text, time: 'Hozir', isMe: true };
    const prev = localChats[groupId] || [];
    setLocalChats({ ...localChats, [groupId]: [...prev, msg] });
    setChatInputs({ ...chatInputs, [groupId]: '' });
    api.sendGroupMessage(groupId, msg).catch(() => {});
    setTimeout(() => {
      const replies = ["Ajoyib savol!", "Rahmat!", "Ertangi darsgacha topshiriqlarni yakunlashimiz kerak.", "Tushunarli!"];
      setLocalChats((prev) => ({ ...prev, [groupId]: [...(prev[groupId] || []), { author: 'Guruhdoshingiz', text: replies[Math.floor(Math.random() * replies.length)], time: 'Hozirgina' }] }));
    }, 1500);
  };

  const finishLesson = (lesson: Lesson, gId: string) => {
    setGroups((prev) => prev.map((g) => g.id === gId ? { ...g, progress: Math.min(100, g.progress + 15), lessons: g.lessons.map((l) => l.id === lesson.id ? { ...l, completed: true } : l) } : g));
    api.rewardAndUpdate(setXp, setCoins, setLevel, 'finish_lesson');
    triggerStatus(`"${lesson.title}" darsi o'zlashtirildi! +30 XP, +5 Tangalar!`);
  };

  if (activeGroupId) {
    const activeG = groups.find((g) => g.id === activeGroupId);
    if (!activeG) return <p className="p-6">Guruh topilmadi</p>;

    return (
      <div className="bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 p-6 space-y-6 text-left">
        <button onClick={() => setActiveGroupId(null)} className="px-4 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">&larr; Guruhlar ro'yxatiga qaytish</button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-6 rounded-2xl">
          <div>
            <span className="text-[10px] font-bold tracking-widest bg-purple-200 dark:bg-purple-900/50 px-2.5 py-0.5 rounded-full text-purple-700 dark:text-purple-300 uppercase">{activeG.courseTitle}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">{activeG.name}</h2>
            <p className="text-xs text-gray-400 mt-1">Ustoz: <strong className="text-gray-800 dark:text-white">{activeG.teacherName}</strong></p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-purple-600">{activeG.progress}% o'zlashtirildi</span>
            <div className="w-36 bg-gray-200 dark:bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
              <div className="bg-purple-600 h-full transition-all" style={{ width: `${activeG.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeG.liveClass && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-amber-800 dark:text-amber-300 uppercase">FAOL LIVE DARS</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{activeG.liveClass.title}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">{activeG.liveClass.time}</p>
                </div>
                <a href={activeG.liveClass.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" aria-label="Jonli darsga ulanish"><Video className="w-3.5 h-3.5" /> Ulanish</a>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Guruh darslari</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeG.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${lesson.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 dark:bg-slate-800 text-gray-500'}`}>
                        {lesson.completed ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
                        <p className="text-[10px] text-gray-400">{lesson.duration || '45 daqiqa'} • {lesson.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedLesson(lesson)} className="px-3 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500" type="button">Videoni ko'rish</button>
                      {!lesson.completed && <button onClick={() => finishLesson(lesson, activeG.id)} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">Tugatdim (+30 XP)</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedLesson && (
              <div className="p-5 bg-white border border-gray-200 text-gray-900 rounded-3xl space-y-3 relative overflow-hidden shadow-xs">
                <button onClick={() => setSelectedLesson(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1" type="button" aria-label="Yopish">✕</button>
                <h4 className="text-xs font-bold text-gray-900">Video: {selectedLesson.title}</h4>
                <div className="aspect-video bg-gray-100 rounded-2xl relative border">
                  <iframe className="absolute inset-0 w-full h-full rounded-2xl" src={selectedLesson.videoUrl || 'https://www.youtube.com/embed/t29cQMUrhdM'} title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Uy Vazifalari</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeG.homeworks.map((hw) => (
                  <div key={hw.id} className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{hw.title}</h4>
                      <p className="text-[10px] text-gray-400">Muddat: <strong className="text-rose-500 font-mono">{hw.deadline}</strong></p>
                    </div>
                    {hw.status === 'completed' ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">✓ {hw.score} ball</span>
                    ) : (
                      <button onClick={() => {
                        setGroups((prev) => prev.map((g) => g.id === activeG.id ? { ...g, homeworks: g.homeworks.map((h) => h.id === hw.id ? { ...h, status: 'completed', score: 95 } : h) } : g));
                        api.rewardAndUpdate(setXp, null, setLevel, 'submit_homework');
                        triggerStatus('Vazifa topshirildi! (+40 XP)');
                      }} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">Yechimni topshirish (+40 XP)</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/30 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" /> Guruh Chati
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {(localChats[activeG.id] || [
                  { author: 'Saidabror Abdusaidov', text: "Hammaga salom!", time: '09:12' },
                  { author: 'Bunyodbek Nematov', text: 'Birinchi darsni yakunladim!', time: '09:15' },
                ]).map((msg, i) => (
                  <div key={i} className={`space-y-0.5 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] font-extrabold text-gray-400 block">{msg.author}</span>
                    <p className={`inline-block px-3 py-2 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-800 rounded-tl-none'}`}>{msg.text}</p>
                    <span className="text-[8px] font-mono text-gray-400 block">{msg.time}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <label htmlFor={`chat-input-${activeG.id}`} className="sr-only">Xabar yozish</label>
                <input
                  id={`chat-input-${activeG.id}`}
                  type="text"
                  value={chatInputs[activeG.id] || ''}
                  onChange={(e) => setChatInputs({ ...chatInputs, [activeG.id]: e.target.value })}
                  placeholder="Xabar yozing..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(activeG.id)}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
                <button onClick={() => sendMessage(activeG.id)} className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button" aria-label="Xabar yuborish"><Send className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" /> Dars taqvimi
              </h3>
              {activeG.courseDays?.length > 0 ? (
                <>
                  <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                    <span>Dars vaqti:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{activeG.courseTime || '14:00 - 15:30'}</strong>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => (
                      <div key={d} className="text-[8px] font-bold text-gray-400 text-center py-1">{d}</div>
                    ))}
                    {(() => {
                      const startDay = new Date(2026, 6, 1).getDay();
                      const daysInMonth = 31;
                      const days: React.ReactNode[] = [];
                      for (let i = 0; i < startDay; i++) {
                        days.push(<div key={`e${i}`} />);
                      }
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = `2026-07-${String(d).padStart(2, '0')}`;
                        const isCourseDay = activeG.courseDays?.includes(dateStr);
                        days.push(
                          <div
                            key={d}
                            className={`text-center py-1.5 rounded-lg text-[10px] font-bold ${
                              isCourseDay
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {d}
                          </div>
                        );
                      }
                      return days;
                    })()}
                  </div>
                  <p className="text-[9px] text-gray-400">
                    {activeG.courseDays.length} ta dars kuni belgilangan
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400">Hali dars jadvali belgilanmagan.</p>
              )}
            </div>

            <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">Guruhdoshlar</h3>
              <div className="space-y-2">
                {activeG.students.map((st) => (
                  <div key={st} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">{st[0]}</div>
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Siz a'zo bo'lgan o'quv guruhlari</h2>
      {studentGroups.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#151433] rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-xs font-bold">Sizda hali guruhlar yo'q. Kurslar do'konidan xarid qiling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentGroups.map((g) => (
            <div key={g.id} className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">{g.name}</h3>
              <p className="text-xs text-gray-400">{g.courseTitle}</p>
              <button onClick={() => setActiveGroupId(g.id)} className="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" type="button">Guruhga kirish</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
