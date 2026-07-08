import React, { useState, useEffect } from 'react';
import * as api from '../api';
import {
  Trophy,
  Award,
  Shield,
  Sparkle,
  Flame,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Gift,
  Search,
  BookOpen,
  GraduationCap,
  Globe,
  Plus,
  AlertTriangle,
  Check,
  FileText,
  Star
} from 'lucide-react';

interface CompetitionProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
}

interface Student {
  name: string;
  school: string;
  xp: number;
  sat: number;
  ielts: number;
  milliy: number; // percentage, e.g., 94 for 94%
  quiz: number; // quiz count
  avatar: string;
}

export default function Competition({ xp, setXp, setLevel, isDarkMode }: CompetitionProps) {
  const [activeLeague, setActiveLeague] = useState<'olmos' | 'oltin' | 'bronza'>('olmos');
  const [activeSubTab, setActiveSubTab] = useState<'xp' | 'sat' | 'ielts' | 'milliy' | 'quiz'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const [diamondStudents, setDiamondStudents] = useState<Student[]>([]);
  const [goldStudents, setGoldStudents] = useState<Student[]>([]);
  const [bronzeStudents, setBronzeStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mock/competition')
      .then(res => res.json())
      .then(data => {
        setDiamondStudents(data.diamondStudents || []);
        setGoldStudents(data.goldStudents || []);
        setBronzeStudents(data.bronzeStudents || []);
        setStudentsLoading(false);
      })
      .catch(() => setStudentsLoading(false));
  }, []);

  // Retrieve current active pool
  const getCurrentPool = () => {
    switch (activeLeague) {
      case 'olmos': return diamondStudents;
      case 'oltin': return goldStudents;
      case 'bronza': return bronzeStudents;
    }
  };

  // Sort function based on active dars metric
  const getSortedStudents = () => {
    const rawList = [...getCurrentPool()];
    
    // Sort logic
    rawList.sort((a, b) => {
      if (activeSubTab === 'xp') return b.xp - a.xp;
      if (activeSubTab === 'sat') return b.sat - a.sat;
      if (activeSubTab === 'ielts') return b.ielts - a.ielts;
      if (activeSubTab === 'milliy') return b.milliy - a.milliy;
      return b.quiz - a.quiz;
    });

    // Apply search filter
    if (searchQuery.trim() !== '') {
      return rawList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.school.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return rawList;
  };

  const sortedStudents = getSortedStudents();

  // Send gift/cheer action
  const handleSendGift = (recipient: string) => {
    triggerToast(`${recipient}ga tabriknoma va 5 XP bonus muvaffaqiyatli jo'natildi!`);
    api.rewardAndUpdate(setXp, null, setLevel, 'send_gift');
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto`} id="competition_main_panel">
      
      {/* Loading Spinner */}
      {studentsLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400 font-semibold">Talabalar ma'lumotlari yuklanmoqda...</p>
        </div>
      )}

      {!studentsLoading && (
        <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#7c3aed] text-white px-6 py-3 rounded-2xl shadow-xl border border-purple-400/20 font-bold animate-fade-in text-xs sm:text-sm">
          {toastMsg}
        </div>
      )}

      {/* 1. HERO CARDS: LEAGUES EXPLANATION & SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="leagues_overview_cards">
        
        {/* Diamond League Status Card */}
        <div 
          onClick={() => setActiveLeague('olmos')}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
            activeLeague === 'olmos' 
              ? 'ring-2 ring-[#7c3aed] bg-[#7c3aed]/5 border-[#7c3aed]/30 shadow-md transform scale-[1.01]' 
              : (isDarkMode ? 'bg-[#151433] border-slate-800/80 hover:border-slate-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs')
          }`}
          id="league_card_olmos"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <Sparkle className="w-6 h-6 fill-indigo-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Oliy Liga</span>
                <h3 className="text-base font-black tracking-tight">Olmos Liga</h3>
              </div>
            </div>
            {activeLeague === 'olmos' && <span className="text-[10px] bg-[#7c3aed] text-white px-2 py-0.5 rounded-full uppercase font-black">Faol</span>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <div className="text-left">
              <p className="text-gray-400 font-medium">Ko'tariladi <ArrowUp className="w-3 h-3 inline" /></p>
              <strong className="text-emerald-500 font-extrabold font-mono">Top 3 peshqadam</strong>
            </div>
            <div className="text-right">
              <p className="text-gray-400 font-medium">Tushib ketadi <AlertTriangle className="w-3 h-3 inline" /></p>
              <strong className="text-rose-500 font-extrabold font-mono">Bottom 3 o'quvchi</strong>
            </div>
          </div>
        </div>

        {/* Gold League Status Card */}
        <div 
          onClick={() => setActiveLeague('oltin')}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
            activeLeague === 'oltin' 
              ? 'ring-2 ring-[#7c3aed] bg-[#7c3aed]/5 border-[#7c3aed]/30 shadow-md transform scale-[1.01]' 
              : (isDarkMode ? 'bg-[#151433] border-slate-800/80 hover:border-slate-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs')
          }`}
          id="league_card_oltin"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                <Trophy className="w-6 h-6 fill-amber-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">O'rta Liga</span>
                <h3 className="text-base font-black tracking-tight">Oltin Liga</h3>
              </div>
            </div>
            {activeLeague === 'oltin' && <span className="text-[10px] bg-[#7c3aed] text-white px-2 py-0.5 rounded-full uppercase font-black">Faol</span>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <div className="text-left">
              <p className="text-gray-400 font-medium">Ko'tariladi <ArrowUp className="w-3 h-3 inline" /></p>
              <strong className="text-emerald-500 font-extrabold font-mono">Top 3 o'quvchi</strong>
            </div>
            <div className="text-right">
              <p className="text-gray-400 font-medium">Tushib ketadi <AlertTriangle className="w-3 h-3 inline" /></p>
              <strong className="text-rose-500 font-extrabold font-mono">Bottom 3 o'quvchi</strong>
            </div>
          </div>
        </div>

        {/* Bronze League Status Card */}
        <div 
          onClick={() => setActiveLeague('bronza')}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
            activeLeague === 'bronza' 
              ? 'ring-2 ring-[#7c3aed] bg-[#7c3aed]/5 border-[#7c3aed]/30 shadow-md transform scale-[1.01]' 
              : (isDarkMode ? 'bg-[#151433] border-slate-800/80 hover:border-slate-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs')
          }`}
          id="league_card_bronza"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-700/10 text-amber-700 rounded-2xl">
                <Shield className="w-6 h-6 fill-amber-700" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Boshlang'ich Liga</span>
                <h3 className="text-base font-black tracking-tight">Bronza Liga</h3>
              </div>
            </div>
            {activeLeague === 'bronza' && <span className="text-[10px] bg-[#7c3aed] text-white px-2 py-0.5 rounded-full uppercase font-black">Faol</span>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <div className="text-left">
              <p className="text-gray-400 font-medium">Ko'tariladi <ArrowUp className="w-3 h-3 inline" /></p>
              <strong className="text-emerald-500 font-extrabold font-mono">Top 3 o'quvchi</strong>
            </div>
            <div className="text-right">
              <p className="text-gray-400 font-medium">Tushib ketadi <AlertTriangle className="w-3 h-3 inline" /></p>
              <strong className="text-rose-500 font-extrabold font-mono">Bottom 3 o'quvchi</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 2. LEAGUE SYSTEM EXPLANATION BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white text-left relative overflow-hidden" id="league_rules_banner">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-10">
          <Trophy className="w-56 h-56 fill-current" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <h4 className="text-lg font-extrabold flex items-center gap-2">
            <Sparkles className="w-5 h-5 fill-current text-yellow-300" />
            Liga ko'tarilish va tushish tizimi qoidalari
          </h4>
          <p className="text-xs text-purple-100 opacity-95 leading-relaxed">
            Haftalik yangilanishda har bir liganing <strong>eng yuqori 3 taligi</strong> yuqoriroq ligaga muvaffaqiyatli ko'tariladi (Oltin → Olmos, Bronza → Oltin). Aksincha, liganing <strong>eng oxirgi 3 taligi</strong> o'z faolligini saqlamasa, pastki ligaga tushib ketadi. Ko'proq dars o'zlashtiring va testlarni topshiring!
          </p>
        </div>
      </div>

      {/* 3. SEARCH & SUB-TABS (METRICS: XP, SAT, IELTS, MILLIY, QUIZ) */}
      <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`} id="leaderboard_control_bar">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto" id="metric_sub_tabs">
            <button
              onClick={() => setActiveSubTab('xp')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeSubTab === 'xp'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <Star className="w-4 h-4" /> Umumiy XP
            </button>
            <button
              onClick={() => setActiveSubTab('sat')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeSubTab === 'sat'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <BookOpen className="w-4 h-4" /> SAT Reyting
            </button>
            <button
              onClick={() => setActiveSubTab('ielts')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeSubTab === 'ielts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <Globe className="w-4 h-4" /> IELTS Reyting
            </button>
            <button
              onClick={() => setActiveSubTab('milliy')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeSubTab === 'milliy'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <FileText className="w-4 h-4" /> Milliy Sertifikat
            </button>
            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeSubTab === 'quiz'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <FileText className="w-4 h-4" /> Quiz Testlar
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80" id="league_search_wrapper">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="O'quvchi yoki maktab nomi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]/20 transition-all ${
                isDarkMode 
                  ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                  : 'bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400 focus:border-purple-200'
              }`}
            />
          </div>

        </div>
      </div>

      {/* 4. RATING LIST JADVALI */}
      <div className={`p-6 rounded-3xl border text-left ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`} id="competition_table_card">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2 capitalize">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {activeLeague} Liga — {activeSubTab === 'xp' ? 'Umumiy XP ballari' : activeSubTab === 'sat' ? 'SAT Ko\'rsatkichlari' : activeSubTab === 'ielts' ? 'IELTS ko\'rsatkichlari' : activeSubTab === 'milliy' ? 'Milliy Sertifikat (%)' : 'Quiz testlar soni'} bo'yicha jadval
            </h2>
            <p className="text-[11px] text-gray-400">Peshqadamlar faollikni oshirgan sari, ularning o'rni darsga munosib ravishda yuksaladi.</p>
          </div>
          <span className="text-[10px] bg-indigo-50 dark:bg-slate-900 text-indigo-500 dark:text-indigo-400 border border-indigo-100/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
            {sortedStudents.length} talabalar
          </span>
        </div>

        {/* Main List */}
        <div className="divide-y divide-gray-100 dark:divide-slate-800/80 space-y-1.5" id="competition_rows_list">
          {sortedStudents.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs font-semibold">
              Hech qanday o'quvchi topilmadi.
            </div>
          ) : (
            sortedStudents.map((student, idx) => {
              const isSelf = student.name === "Biloliddin Akramov";
              
              // Zone Detection:
              // Top 3 gets Promoted "Ko'tariladi"
              // Bottom 3 gets Demoted "Tushadi" (if more than 5 total, otherwise last few elements)
              const totalItems = sortedStudents.length;
              const isPromotedZone = idx < 3 && activeLeague !== 'olmos'; // Diamond is top, cannot promote higher, but top 3 can represent champion zone!
              const isChampionZone = idx < 3 && activeLeague === 'olmos';
              const isDemotedZone = idx >= totalItems - 3 && totalItems >= 6;

              // Setup zone pill styling
              let zoneLabel: React.ReactNode = <><Check className="w-3 h-3 inline" /> Xavfsiz zona</>;
              let zoneStyle = "bg-slate-100/70 text-slate-500 text-[10px]";
              if (isPromotedZone) {
                zoneLabel = <>Ko'tariladi <ArrowUp className="w-3 h-3 inline" /></>;
                zoneStyle = "bg-emerald-500/10 text-emerald-500 text-[10px] border border-emerald-500/20";
              } else if (isChampionZone) {
                zoneLabel = <>Chempion <Trophy className="w-3 h-3 inline" /></>;
                zoneStyle = "bg-yellow-500/15 text-yellow-600 text-[10px] border border-yellow-500/25";
              } else if (isDemotedZone) {
                zoneLabel = <>Tushib ketadi <AlertTriangle className="w-3 h-3 inline" /></>;
                zoneStyle = "bg-rose-500/10 text-rose-500 text-[10px] border border-rose-500/20";
              }

              return (
                <div 
                  key={student.name}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl transition-all ${
                    isSelf 
                      ? (isDarkMode ? 'bg-[#7c3aed]/10 border border-[#7c3aed]/20 font-bold' : 'bg-purple-50/70 border border-purple-100 font-bold') 
                      : 'hover:bg-gray-50/50 dark:hover:bg-slate-900/10 border border-transparent'
                  }`}
                  id={`comp_row_${idx}`}
                >
                  
                  {/* Left content: Rank, Avatar, Name & School */}
                  <div className="flex items-center gap-3.5 text-left" id={`comp_left_${idx}`}>
                    
                    {/* Rank indicator */}
                    <span className="w-7 text-sm font-black text-gray-400 flex items-center justify-center font-mono">
                      {idx === 0 && <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                      {idx === 1 && <Award className="w-5 h-5 text-slate-400" />}
                      {idx === 2 && <Award className="w-5 h-5 text-amber-600" />}
                      {idx > 2 && idx + 1}
                    </span>

                    {/* Avatar */}
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/10" 
                    />

                    {/* Meta info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-extrabold">{student.name}</h4>
                        {isSelf && (
                          <span className="text-[9px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">Siz</span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{student.school}</p>
                    </div>

                  </div>

                  {/* Right Content: Zone Badge, Score value, and Congratulations action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-slate-800" id={`comp_right_${idx}`}>
                    
                    {/* Zone Status Badge */}
                    <div className="text-left sm:text-right">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold font-mono uppercase tracking-wider text-[9px] ${zoneStyle}`}>
                        {zoneLabel}
                      </span>
                    </div>

                    {/* Active Score Metric representation */}
                    <div className="text-right min-w-[80px]">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                        {activeSubTab === 'xp' && 'Umumiy XP'}
                        {activeSubTab === 'sat' && 'SAT ball'}
                        {activeSubTab === 'ielts' && 'IELTS Band'}
                        {activeSubTab === 'milliy' && 'Milliy Sert.'}
                        {activeSubTab === 'quiz' && 'Quiz testlar'}
                      </span>
                      <strong className="text-sm font-black font-mono text-[#7c3aed]">
                        {activeSubTab === 'xp' && `${student.xp} XP`}
                        {activeSubTab === 'sat' && `${student.sat} ball`}
                        {activeSubTab === 'ielts' && `${student.ielts} band`}
                        {activeSubTab === 'milliy' && `${student.milliy}% natija`}
                        {activeSubTab === 'quiz' && `${student.quiz} ta quiz`}
                      </strong>
                    </div>

                    {/* Cheer Button */}
                    {!isSelf ? (
                      <button 
                        onClick={() => handleSendGift(student.name)}
                        className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-rose-400 hover:bg-slate-700' : 'bg-gray-100 text-rose-500 hover:bg-rose-50'}`}
                        title={`${student.name}ga tabriknoma va rag'bat yuborish`}
                      >
                        <Gift className="w-4 h-4 fill-current" />
                      </button>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-xs text-purple-500" title="Sizning natijangiz">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
