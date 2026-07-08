import { useStore } from '../store';
import { Flame, Trophy, Sparkle, Shield, GraduationCap, BookOpen, Award, FileText } from 'lucide-react';

const TABS = [
  { key: 'sat', label: 'SAT', icon: GraduationCap },
  { key: 'ielts', label: 'IELTS', icon: BookOpen },
  { key: 'milliy', label: 'Milliy Sertifikat', icon: Award },
  { key: 'quiz', label: 'Quiz Testlar', icon: FileText },
  { key: 'xp', label: 'Umumiy XP', icon: Trophy },
  { key: 'liga', label: 'Liga', icon: Shield },
] as const;

const RANKING_TEMPLATES: Record<string, { label: string; badge: string; scoreKey: string; unit: string; data: { rank: string; name: string; score: string; isSelf: boolean; school: string }[] }> = {
  sat: {
    label: 'SAT Natijalari bo\'yicha Reyting', badge: 'Haftalik yangilanish', scoreKey: 'ball', unit: 'ball',
    data: [
      { rank: '1', name: 'Biloliddin Akramov', score: '1540', isSelf: true, school: 'Toshkent Prezident Maktabi' },
      { rank: '2', name: 'Saidabror Abdusaidov', score: '1510', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '3', name: 'Bunyodbek Nematov', score: '1490', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '4', name: 'Havasxon Mashrabova', score: '1470', isSelf: false, school: 'Samarkand Prezident Maktabi' },
      { rank: '5', name: 'Dilnavoz Karimova', score: '1430', isSelf: false, school: 'Namangan PM' },
    ],
  },
  ielts: {
    label: 'IELTS Natijalari bo\'yicha Reyting', badge: 'Haftalik yangilanish', scoreKey: 'Band', unit: 'Band',
    data: [
      { rank: '1', name: 'Biloliddin Akramov', score: '8.5', isSelf: true, school: 'Toshkent Prezident Maktabi' },
      { rank: '2', name: 'Saidabror Abdusaidov', score: '8.0', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '3', name: 'Bunyodbek Nematov', score: '7.5', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '4', name: 'Havasxon Mashrabova', score: '7.5', isSelf: false, school: 'Samarkand Prezident Maktabi' },
      { rank: '5', name: 'Dilnavoz Karimova', score: '7.0', isSelf: false, school: 'Namangan PM' },
    ],
  },
  milliy: {
    label: 'Milliy Sertifikat Natijalari', badge: 'Matematika & Fanlar', scoreKey: '', unit: '%',
    data: [
      { rank: '1', name: 'Biloliddin Akramov', score: '98%', isSelf: true, school: 'Toshkent Prezident Maktabi' },
      { rank: '2', name: 'Saidabror Abdusaidov', score: '94%', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '3', name: 'Bunyodbek Nematov', score: '91%', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '4', name: 'Havasxon Mashrabova', score: '89%', isSelf: false, school: 'Samarkand Prezident Maktabi' },
      { rank: '5', name: 'Dilnavoz Karimova', score: '86%', isSelf: false, school: 'Namangan PM' },
    ],
  },
  quiz: {
    label: 'Quiz Testlar bo\'yicha Peshqadamlar', badge: 'Ishlangan testlar', scoreKey: 'ta', unit: 'ta',
    data: [
      { rank: '1', name: 'Biloliddin Akramov', score: '120 ta', isSelf: true, school: 'Toshkent Prezident Maktabi' },
      { rank: '2', name: 'Saidabror Abdusaidov', score: '114 ta', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '3', name: 'Bunyodbek Nematov', score: '105 ta', isSelf: false, school: 'Toshkent Prezident Maktabi' },
      { rank: '4', name: 'Havasxon Mashrabova', score: '98 ta', isSelf: false, school: 'Samarkand Prezident Maktabi' },
      { rank: '5', name: 'Dilnavoz Karimova', score: '92 ta', isSelf: false, school: 'Namangan PM' },
    ],
  },
};

const AVATARS = [
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
];

const LIGA_THEME = {
  cyan: {
    card: 'bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20',
    badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300',
    circle: 'bg-cyan-500/20 text-cyan-500',
    title: 'text-cyan-500 dark:text-cyan-400',
    desc: 'text-cyan-600/80 dark:text-cyan-400/60',
    trophy: 'fill-cyan-500',
  },
  amber: {
    card: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    circle: 'bg-amber-500/20 text-amber-500',
    title: 'text-amber-500 dark:text-amber-400',
    desc: 'text-amber-600/80 dark:text-amber-400/60',
    trophy: 'fill-amber-500',
  },
  orange: {
    card: 'bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/20',
    badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
    circle: 'bg-orange-500/20 text-orange-500',
    title: 'text-orange-500 dark:text-orange-400',
    desc: 'text-orange-600/80 dark:text-orange-400/60',
    trophy: 'fill-orange-500',
  },
} as const;

export default function LevelModal() {
  const { showLevelModal, setShowLevelModal, levelModalTab, setLevelModalTab, xp, level, isDarkMode } = useStore();
  if (!showLevelModal) return null;

  const template = RANKING_TEMPLATES[levelModalTab];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="app-panel relative my-8 w-full max-w-4xl space-y-8 rounded-3xl p-6 text-left text-[color:var(--text)] shadow-2xl sm:p-8 animate-fade-in">
        <button
          onClick={() => setShowLevelModal(false)}
          className="absolute right-6 top-6 rounded-full p-2 font-mono text-lg font-bold text-[color:var(--text-subtle)] transition-all hover:bg-[color:var(--surface-2)] hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          aria-label="Modalni yopish"
          type="button"
        >
          ✕
        </button>

        <div className="app-panel-soft flex flex-col items-center justify-between gap-8 rounded-3xl p-6 shadow-2xs lg:flex-row sm:p-8">
          <div className="relative flex items-center justify-center w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="60" className="stroke-[color:var(--surface-3)]" strokeWidth="10" fill="transparent" />
              <circle cx="72" cy="72" r="60" className="stroke-[color:var(--brand)]" strokeWidth="10" fill="transparent" strokeDasharray="377" strokeDashoffset="37" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-[color:var(--brand)] font-sans" id="level_modal_level">{level}</span>
              <span className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-[color:var(--text-subtle)]">daraja</span>
            </div>
          </div>

          <div className="flex-1 text-left space-y-2 w-full">
            <h3 className="text-2xl font-black text-[color:var(--text)]">Afsona {level}</h3>
            <p className="font-mono text-sm font-black text-[color:var(--reward)]">{xp} XP</p>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-3)]">
              <div className="h-full rounded-full bg-[color:var(--brand)] transition-all duration-500" style={{ width: `${((xp % 1000) / 10).toFixed(1)}%` }} />
            </div>
            <span className="mt-1 block text-xs font-extrabold text-[color:var(--text-subtle)]">
              Keyingi darajagacha yana {1000 - (xp % 1000)} XP
            </span>
          </div>

          <div className="flex gap-4 flex-wrap sm:flex-nowrap flex-shrink-0">
            <div className="app-panel-soft flex w-28 flex-col items-center justify-center gap-1 rounded-2xl p-4 text-center">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <span className="font-mono text-2xl font-black text-[color:var(--text)]">{level}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-[color:var(--text-subtle)]">kun ketma-ket</span>
            </div>
            <div className="app-panel-soft flex w-28 flex-col items-center justify-center gap-1 rounded-2xl p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="font-mono text-2xl font-black text-[color:var(--text)]">{level}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-[color:var(--text-subtle)]">streak rekordi</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto border-b border-[color:var(--border)] pb-3 scrollbar-thin">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setLevelModalTab(key)}
                className={`flex whitespace-nowrap items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                   levelModalTab === key
                     ? 'bg-[color:var(--brand)] text-[color:var(--brand-contrast)] border-[color:var(--brand)] shadow-xs'
                     : 'bg-[color:var(--surface)] text-[color:var(--text-muted)] border-[color:var(--border)] hover:bg-[color:var(--surface-2)]'
                 }`}
                type="button"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-5">
            {/* SAT / IELTS / Milliy / Quiz tabs */}
            {(levelModalTab === 'sat' || levelModalTab === 'ielts' || levelModalTab === 'milliy' || levelModalTab === 'quiz') && template && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black uppercase tracking-wider text-[color:var(--text)]">{template.label}</h4>
                  <span className="rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold uppercase text-[color:var(--brand)]">{template.badge}</span>
                </div>
                <div className="space-y-2 divide-y divide-[color:var(--border)]">
                  {template.data.map((u, i) => (
                    <div key={u.name} className={`flex items-center justify-between rounded-xl px-3 py-3 ${u.isSelf ? 'border border-[color:var(--brand)]/20 bg-[color:var(--brand-soft)] font-bold' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-10 font-mono text-xs font-black text-[color:var(--text-subtle)]">{u.rank}</span>
                        <img src={AVATARS[i]} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[color:var(--brand)]/10" />
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-extrabold text-[color:var(--text)]">
                            {u.name}
                            {u.isSelf && <span className="rounded-full bg-[color:var(--brand)] px-1.5 py-0.5 text-[9px] text-[color:var(--brand-contrast)]">Siz</span>}
                          </p>
                          <p className="text-[10px] text-[color:var(--text-subtle)]">{u.school}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-[color:var(--brand)]">{u.score} {template.scoreKey}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {levelModalTab === 'xp' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black uppercase tracking-wider text-[color:var(--text)]">Umumiy XP reytingi</h4>
                  <span className="rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold uppercase text-[color:var(--brand)]">Haftalik yangilanish</span>
                </div>
                <div className="space-y-2 divide-y divide-[color:var(--border)]">
                  {[
                    { rank: '1', name: 'Biloliddin Akramov', xp: 0, isSelf: true, school: 'Toshkent Prezident Maktabi' },
                    { rank: '2', name: 'Saidabror Abdusaidov', xp: 9836, isSelf: false, school: 'Toshkent Prezident Maktabi' },
                    { rank: '3', name: 'Bunyodbek Nematov', xp: 9249, isSelf: false, school: 'Toshkent Prezident Maktabi' },
                    { rank: '4', name: 'Havasxon Mashrabova', xp: 8541, isSelf: false, school: 'Samarkand Prezident Maktabi' },
                    { rank: '5', name: 'Dilnavoz Karimova', xp: 7921, isSelf: false, school: 'Namangan PM' },
                  ].map((u, i) => (
                    <div key={u.name} className={`flex items-center justify-between rounded-xl px-3 py-3 ${u.isSelf ? 'border border-[color:var(--brand)]/20 bg-[color:var(--brand-soft)] font-bold' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-10 font-mono text-xs font-black text-[color:var(--text-subtle)]">{u.rank}</span>
                        <img src={AVATARS[i]} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[color:var(--brand)]/10" />
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-extrabold text-[color:var(--text)]">
                            {u.name}
                            {u.isSelf && <span className="rounded-full bg-[color:var(--brand)] px-1.5 py-0.5 text-[9px] text-[color:var(--brand-contrast)]">Siz</span>}
                          </p>
                          <p className="text-[10px] text-[color:var(--text-subtle)]">{u.school}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-[color:var(--brand)]">{u.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {levelModalTab === 'liga' && (
              <div className="space-y-4 animate-fade-in text-center py-4">
                <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-[color:var(--text-subtle)]">Mavjud Ligalar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { name: 'Olmos Liga', desc: 'Oliy bosqich', color: 'cyan' },
                    { name: 'Oltin Liga', desc: 'O\'rta bosqich', color: 'amber' },
                    { name: 'Bronza Liga', desc: 'Boshlang\'ich bosqich', color: 'orange' },
                  ].map((liga) => (
                    <div key={liga.name} className={`flex flex-col items-center justify-center space-y-2 rounded-2xl border p-5 ${LIGA_THEME[liga.color as keyof typeof LIGA_THEME].card}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${LIGA_THEME[liga.color as keyof typeof LIGA_THEME].circle}`}>
                        <Trophy className={`w-5 h-5 ${LIGA_THEME[liga.color as keyof typeof LIGA_THEME].trophy}`} />
                      </div>
                      <h3 className={`text-sm font-black uppercase tracking-wider ${LIGA_THEME[liga.color as keyof typeof LIGA_THEME].title}`}>{liga.name}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${LIGA_THEME[liga.color as keyof typeof LIGA_THEME].desc}`}>{liga.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
