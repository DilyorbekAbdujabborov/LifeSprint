import React from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Activity
} from 'lucide-react';

interface AnalyticsProps {
  xp: number;
  isDarkMode: boolean;
}

export default function Analytics({ xp, isDarkMode }: AnalyticsProps) {
  // Simple, humble statistics to show as requested
  const yearlyXp = xp; // Dynamic from user's current XP
  const solvedTestsCount = 66; // Matching dashboard
  const championshipsCount = 3; // "necha marta chempion bo'lgani"
  const masteryPercentage = 89; // "o'zlashtirishi"
  
  // "erishgan yutuqlari" (achievements)
  const achievements = [
    {
      id: 'ach_1',
      title: 'Toshkent Prezident Maktabi Peshqadami',
      desc: 'Haftalik reytingda eng yuqori natija ko\'rsatgani uchun.',
      date: 'May 2026',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
    },
    {
      id: 'ach_2',
      title: 'Intizom Qiroli',
      desc: 'Ketma-ket 11 kunlik odatlar va kundalik vazifalarni to\'liq bajargani uchun.',
      date: 'Iyun 2026',
      icon: Flame,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'
    },
    {
      id: 'ach_3',
      title: 'Tezkor Yozuvchi (WPM Master)',
      desc: 'Tezyozar ligasida daqiqasiga 72 tadan ortiq so\'z yoza olgani uchun.',
      date: 'Iyun 2026',
      icon: Award,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10'
    },
    {
      id: 'ach_4',
      title: 'Sertifikatlangan Bilimdon',
      desc: 'SAT va IELTS bo\'limlaridan barcha simulyatsiya testlarini muvaffaqiyatli topshirgani uchun.',
      date: 'Iyul 2026',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
    }
  ];

  return (
    <div className={`p-4 sm:p-6 min-h-screen text-left transition-colors duration-300 max-w-7xl mx-auto ${isDarkMode ? 'text-slate-100' : 'text-stone-800'}`} id="analytics_view_container">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8" id="analytics_content_inner">
        
        {/* Simple & Humble Header */}
        <div className="space-y-2 border-b border-stone-200 dark:border-slate-800 pb-5" id="analytics_header_block">
          <span className="text-xs font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">Tahlil va Statistika</span>
          <h1 className="text-3xl font-black tracking-tight">O'zlashtirish Tahlili</h1>
          <p className="text-sm text-stone-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Sizning LifeSprint platformasidagi barcha yutuqlaringiz, ishlangan testlaringiz va akademik natijalaringizning qisqacha kamtarona tahlili.
          </p>
        </div>

        {/* 4 Cards Grid - Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="analytics_metrics_grid">
          
          {/* Yearly XP */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="stat_yearly_xp">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">Yillik To'plangan XP</span>
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <Sparkles className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black font-mono tracking-tight text-amber-500">{yearlyXp.toLocaleString()}</span>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">Joriy yildagi faollik ballari</p>
            </div>
          </div>

          {/* Solved Tests */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="stat_solved_tests">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">Yechilgan Testlar</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black font-mono tracking-tight text-emerald-500">{solvedTestsCount} ta</span>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">SAT, IELTS va milliy testlar</p>
            </div>
          </div>

          {/* Champion Count */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="stat_championships">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">Chempionliklar</span>
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                <Trophy className="w-4 h-4 fill-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black font-mono tracking-tight text-purple-500">{championshipsCount} marta</span>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">Guruh & olmos liga peshqadami</p>
            </div>
          </div>

          {/* Mastery Level */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="stat_mastery">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">O'zlashtirish</span>
              <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black font-mono tracking-tight text-cyan-500">{masteryPercentage}%</span>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">O'rtacha muvaffaqiyat ko'rsatkichi</p>
            </div>
          </div>

        </div>

        {/* Detailed Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="analytics_details_row">
          
          {/* Mastery Progress Card */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="detail_progress_card">
            <div className="space-y-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                O'zlashtirish tahlili (Fanlar bo'yicha)
              </h3>
              <p className="text-xs text-stone-400 dark:text-slate-400 leading-relaxed">
                Akademik topshiriqlar va oraliq test natijalariga asoslangan o'zlashtirish darajasi.
              </p>
            </div>

            {/* Simple Progress bars */}
            <div className="space-y-4" id="progress_bars_wrapper">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>SAT - Reading & Writing</span>
                  <span className="font-mono text-cyan-500">92%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>IELTS - Academic English</span>
                  <span className="font-mono text-cyan-500">86%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Matematika (SAT Math)</span>
                  <span className="font-mono text-cyan-500">95%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Dasturlash asoslari</span>
                  <span className="font-mono text-cyan-500">83%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>

            </div>

            <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed ${isDarkMode ? 'bg-slate-900/60 text-slate-300' : 'bg-stone-50 text-stone-500'}`} id="detail_tip_box">
              O'rtacha o'zlashtirish ko'rsatkichi <strong>89%</strong> ni tashkil etadi va siz o'z guruhingizda <strong>top 3 talik</strong> o'quvchi safidasiz.
            </div>
          </div>

          {/* Championship & Milestones Details */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`} id="detail_championship_card">
            <div className="space-y-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Chempionlik va Faollik Tarixi
              </h3>
              <p className="text-xs text-stone-400 dark:text-slate-400 leading-relaxed">
                Olmos ligasi va guruhlarda erishilgan muvaffaqiyatlar.
              </p>
            </div>

            <div className="space-y-3.5" id="championship_history_list">
              
              <div className="flex items-start gap-3 text-xs" id="champ_item_1">
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-extrabold text-stone-800 dark:text-white">Olmos Liga G'olibi (1-o'rin)</p>
                  <p className="text-[10px] text-stone-400 dark:text-slate-500">May oyining 3-haftasi — 5,836 XP to'plagan holda chempionlik.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs" id="champ_item_2">
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-extrabold text-stone-800 dark:text-white">Haftaning eng intizomli o'quvchisi</p>
                  <p className="text-[10px] text-stone-400 dark:text-slate-500">Iyun oyida ketma-ket barcha odatlarni bajarib birinchilikni qo'lga kiritdi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs" id="champ_item_3">
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-extrabold text-stone-800 dark:text-white">Tezkor Duellar Arenasi Qiroli</p>
                  <p className="text-[10px] text-stone-400 dark:text-slate-500">Ketma-ket 15 ta duelda g'alaba qozonib rekord o'rnatdi.</p>
                </div>
              </div>

            </div>

            <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed ${isDarkMode ? 'bg-slate-900/60 text-slate-300' : 'bg-stone-50 text-stone-500'}`} id="detail_champs_quote">
              Muntazam faollik sizga keyingi ligalarda ham muvaffaqiyat qozonish uchun mustahkam zamin yaratadi.
            </div>
          </div>

        </div>

        {/* Earned Achievements (Erishgan yutuqlari) */}
        <div className="space-y-4" id="analytics_achievements_section">
          <div className="flex justify-between items-center" id="achievements_sec_header">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Erishgan Yutuqlar va Nishonlar
            </h3>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Jami: {achievements.length} ta yutuq</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="achievements_cards_grid">
            {achievements.map((ach) => {
              const IconComponent = ach.icon;
              return (
                <div 
                  key={ach.id} 
                  className={`p-4 rounded-2xl border flex gap-4 text-left items-start transition-all ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-stone-200 shadow-xs'}`}
                  id={`ach_card_${ach.id}`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 ${ach.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-stone-800 dark:text-white">{ach.title}</h4>
                      <span className="text-[9px] font-semibold text-stone-400 dark:text-slate-500 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{ach.date}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-relaxed">
                      {ach.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
