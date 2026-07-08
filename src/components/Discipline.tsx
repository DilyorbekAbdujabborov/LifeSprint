import React, { useState, useEffect, useRef } from 'react';
import * as api from '../api';
import {
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  TrendingUp,
  Brain,
  Maximize,
  Minimize,
  Sparkles,
  Droplets,
  Wind,
  Coffee,
  BookOpen
} from 'lucide-react';
import { Habit } from '../types';
import { useToast } from '../toast';

interface DisciplineProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

export default function Discipline({ habits, setHabits, xp, setXp, setLevel }: DisciplineProps) {
  const { toast } = useToast();
  // Widget switching and Fullscreen states
  const [activeWidget, setActiveWidget] = useState<'focus' | 'analytics'>('focus');
  const [isFullscreenFocus, setIsFullscreenFocus] = useState(false);

  // Focus Timer States
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'study' | 'break'>('study');
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(4);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);

  // New Habit creation
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState(30);
  const [newHabitUnit, setNewHabitUnit] = useState('daq');

  // Interactive Graph Hover State
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Sound Synthesizer State
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'wind' | 'alpha'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Dates exactly as per the user's 21-day schedule reference screenshot (June 9th to June 29th, 2026)
  const displayDates = [
    { key: '2026-06-09', dayLabel: 'SESH', dateNum: 9, isWeekend: false },
    { key: '2026-06-10', dayLabel: 'CHOR', dateNum: 10, isWeekend: false },
    { key: '2026-06-11', dayLabel: 'PAY', dateNum: 11, isWeekend: false },
    { key: '2026-06-12', dayLabel: 'JUM', dateNum: 12, isWeekend: false },
    { key: '2026-06-13', dayLabel: 'SHAN', dateNum: 13, isWeekend: true },
    { key: '2026-06-14', dayLabel: 'YAK', dateNum: 14, isWeekend: true },
    { key: '2026-06-15', dayLabel: 'DUSH', dateNum: 15, isWeekend: false },
    { key: '2026-06-16', dayLabel: 'SESH', dateNum: 16, isWeekend: false },
    { key: '2026-06-17', dayLabel: 'CHOR', dateNum: 17, isWeekend: false },
    { key: '2026-06-18', dayLabel: 'PAY', dateNum: 18, isWeekend: false },
    { key: '2026-06-19', dayLabel: 'JUM', dateNum: 19, isWeekend: false },
    { key: '2026-06-20', dayLabel: 'SHAN', dateNum: 20, isWeekend: true },
    { key: '2026-06-21', dayLabel: 'YAK', dateNum: 21, isWeekend: true },
    { key: '2026-06-22', dayLabel: 'DUSH', dateNum: 22, isWeekend: false },
    { key: '2026-06-23', dayLabel: 'SESH', dateNum: 23, isWeekend: false },
    { key: '2026-06-24', dayLabel: 'CHOR', dateNum: 24, isWeekend: false },
    { key: '2026-06-25', dayLabel: 'PAY', dateNum: 25, isWeekend: false },
    { key: '2026-06-26', dayLabel: 'JUM', dateNum: 26, isWeekend: false },
    { key: '2026-06-27', dayLabel: 'SHAN', dateNum: 27, isWeekend: true },
    { key: '2026-06-28', dayLabel: 'YAK', dateNum: 28, isWeekend: true },
    { key: '2026-06-29', dayLabel: 'DUSH', dateNum: 29, isWeekend: false },
  ];

  // Productivity points for the Area Graph matching completion rates
  const graphData = [
    { label: '9', value: 45, labelFull: '9 iyun (SESH)', desc: '3 ta dars bajarildi' },
    { label: '11', value: 55, labelFull: '11 iyun (PAY)', desc: 'Deep Work dars seansi' },
    { label: '13', value: 40, labelFull: '13 iyun (SHAN)', desc: 'Dam olish va xotira' },
    { label: '15', value: 75, labelFull: '15 iyun (DUSH)', desc: 'Darslar boshlanishi' },
    { label: '17', value: 80, labelFull: '17 iyun (CHOR)', desc: 'SAT mock tahlili' },
    { label: '19', value: 82, labelFull: '19 iyun (JUM)', desc: 'Deep Work 4 soat' },
    { label: '21', value: 70, labelFull: '21 iyun (YAK)', desc: 'Tahlil va rejalashtirish' },
    { label: '23', value: 85, labelFull: '23 iyun (SESH)', desc: 'IELTS mock darsi' },
    { label: '25', value: 92, labelFull: '25 iyun (PAY)', desc: 'Maksimal rekord natija!' },
    { label: '27', value: 65, labelFull: '27 iyun (SHAN)', desc: 'Tahliliy testlar' },
    { label: '29', value: 88, labelFull: '29 iyun (DUSH)', desc: 'Yangi maqsadlar sari' },
  ];

  // Pre-seed habits to match screenshot on first mount
  useEffect(() => {
    setHabits(prev => {
      // Check if any June 2026 history exists
      const hasJuneHistory = prev.some(h => h.history && Object.keys(h.history).some(k => k.startsWith('2026-06-')));
      if (hasJuneHistory) return prev;

      // Map current list and rename/seed them
      return prev.map((h, idx) => {
        const updatedHistory = { ...h.history };
        if (idx === 0) {
          // Deep Work pattern (SESH 9, PAY 11, YAK 14, SHAN 20)
          updatedHistory['2026-06-09'] = h.targetValue;
          updatedHistory['2026-06-11'] = h.targetValue;
          updatedHistory['2026-06-14'] = h.targetValue;
          updatedHistory['2026-06-20'] = h.targetValue;
          return { ...h, name: "Deep Work (4s)", history: updatedHistory };
        } else if (idx === 1) {
          // Kunlik reja pattern (CHOR 10, JUM 12, SESH 16, SHAN 20)
          updatedHistory['2026-06-10'] = h.targetValue;
          updatedHistory['2026-06-12'] = h.targetValue;
          updatedHistory['2026-06-16'] = h.targetValue;
          updatedHistory['2026-06-20'] = h.targetValue;
          return { ...h, name: "Kunlik reja", history: updatedHistory };
        }
        return h;
      });
    });
  }, [setHabits]);

  // Dynamic calculations for the "SAMARADORLIK" Banner
  const totalGridCells = habits.length * displayDates.length;
  const completedGridCells = habits.reduce((acc, h) => {
    return acc + displayDates.filter(d => h.history && h.history[d.key] >= h.targetValue).length;
  }, 0);
  const completionRate = totalGridCells > 0 ? Math.round((completedGridCells / totalGridCells) * 100) : 13;

  // Sound Synthesizer Engine
  const playAmbientSound = (type: 'rain' | 'wind' | 'alpha') => {
    try {
      stopAmbientSound();

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNodeRef.current = gain;

      if (type === 'rain') {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noiseSourceRef.current = noise;
      } else if (type === 'wind') {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noiseSourceRef.current = noise;
      } else if (type === 'alpha') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.frequency.setValueAtTime(140, ctx.currentTime); // 140Hz Left
        osc2.frequency.setValueAtTime(148, ctx.currentTime); // 148Hz Right -> 8Hz Alpha focus beat

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        noiseSourceRef.current = osc1; // Hold reference to toggle off
      }
      setActiveSound(type);
    } catch (e) {
      console.error("Audio synth error: ", e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) {}
      noiseSourceRef.current = null;
    }
    setActiveSound('none');
  };

  // Keep Pomodoro timer ticking
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      stopAmbientSound();
      if (sessionType === 'study') {
        setFocusSessionsCompleted(prev => prev + 1);
        api.rewardAndUpdate(setXp, null, setLevel, 'pomodoro_complete');
        toast("Tabriklaymiz! 25 daqiqalik Deep Work darsi yakunlandi. Sizga 150 XP berildi!", 'success');
        setTimeLeft(300); // 5 min break
        setSessionType('break');
      } else {
        toast("Tanaffus yakunlandi. Diqqatni jamlab darsga qaytamiz!", 'info');
        setTimeLeft(1500); // 25 min study
        setSessionType('study');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, sessionType, setXp, setLevel]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
    // Auto-trigger sound if none is active to enhance focus
    if (!isRunning && activeSound === 'none') {
      playAmbientSound('alpha');
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    stopAmbientSound();
    setTimeLeft(sessionType === 'study' ? 1500 : 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle habit check-off for a specific date in June grid
  const handleToggleDay = (habitId: string, dateStr: string) => {
    let toggleOn = false;
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const historyCopy = { ...h.history };
        const isCurrentlyCompleted = historyCopy[dateStr] >= h.targetValue;
        toggleOn = !isCurrentlyCompleted;
        if (isCurrentlyCompleted) {
          delete historyCopy[dateStr];
        } else {
          historyCopy[dateStr] = h.targetValue;
        }
        return { ...h, history: historyCopy };
      }
      return h;
    }));
    api.rewardAndUpdate(setXp, null, setLevel, toggleOn ? 'habit_toggle_on' : 'habit_toggle_off');
  };

  // Create new habit
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      name: newHabitName,
      category: 'coding',
      icon: 'Check',
      currentValue: 0,
      targetValue: newHabitTarget,
      unit: newHabitUnit,
      streak: 1,
      history: {}
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setShowAddHabitModal(false);
    api.rewardAndUpdate(setXp, null, setLevel, 'create_habit');
  };

  // Delete a habit
  const handleDeleteHabit = (id: string) => {
    if (confirm("Haqiqatdan ham ushbu vazifani o'chirmoqchimisiz?")) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 flex-1 overflow-y-auto max-w-7xl mx-auto" id="discipline_main_layout">
      
      {/* 1. SAMARADORLIK CARD (Exact 1-to-1 replica of the screenshot!) */}
      <div 
        className="bg-[#2463eb] rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 min-h-[220px]"
        id="samaradorlik_cobalt_replica"
      >
        {/* Left Side: Label and the 6 vertical bars */}
        <div className="flex flex-col justify-between h-full space-y-4" id="samaradorlik_left_side">
          <div>
            <h4 className="text-white font-sans font-black tracking-[0.25em] text-xs sm:text-sm uppercase opacity-90" id="samaradorlik_title">
              Samaradorlik
            </h4>
          </div>
          
          {/* Vertical white bars exactly as in the screenshot */}
          <div className="flex items-end gap-2 h-20" id="samaradorlik_bars">
            <div className="w-1 bg-white opacity-80 h-10 rounded-full" />
            <div className="w-1 bg-white opacity-80 h-12 rounded-full" />
            <div className="w-1 bg-white opacity-80 h-11 rounded-full" />
            <div className="w-1 bg-white opacity-80 h-12 rounded-full" />
            <div className="w-1 bg-white opacity-80 h-10 rounded-full" />
            <div className="w-1.5 bg-white h-24 rounded-full" />
          </div>
        </div>

        {/* Center: Circular Progress showing 13% */}
        <div className="flex flex-col items-center justify-center relative" id="samaradorlik_progress_ring">
          <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="48"
                className="stroke-white/10"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="48"
                className="stroke-white transition-all duration-500"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="301"
                strokeDashoffset={301 - (301 * completionRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white leading-none tracking-tighter">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: "30 KUN" badge and the heartbeat peak graph line */}
        <div className="flex flex-col items-end justify-between h-full space-y-4" id="samaradorlik_right_side">
          <span 
            className="bg-white/10 text-white border border-white/25 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full select-none"
            id="samaradorlik_period_badge"
          >
            30 KUN
          </span>

          {/* White wave graph line replicating the screenshot perfectly */}
          <div className="relative h-16 w-56 hidden sm:block overflow-visible" id="samaradorlik_heartbeat_wave">
            <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
              <path
                d="M 10 40 L 30 40 Q 35 40 37 35 L 43 55 Q 45 60 47 40 L 53 40 Q 57 40 59 30 L 65 50 L 70 40 L 90 40 Q 94 40 96 10 L 102 75 L 108 40 L 200 40"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. CONTROL HEADER: "+ YANGI VAZIFA" & "VAZIFALAR" (Screenshot replica) */}
      <div className="flex items-center gap-6 my-4 pl-1" id="vazifalar_control_bar">
        <button
          onClick={() => setShowAddHabitModal(true)}
          className="bg-[#2463eb] text-white hover:bg-[#1d4ed8] font-black text-[11px] sm:text-xs px-6 py-3 rounded-2xl tracking-widest uppercase transition-all duration-200 shadow-md cursor-pointer"
          id="btn_yangi_vazifa"
        >
          + YANGI VAZIFA
        </button>
        <h3 className="text-xs sm:text-sm font-black tracking-[0.25em] text-[#2463eb] uppercase select-none" id="vazifalar_title_label">
          VAZIFALAR
        </h3>
      </div>

      {/* 3. GRID TABLE (Replica - Light borders, soft gray container, weekends in red) */}
      <div 
        className="overflow-x-auto rounded-[1.5rem] border border-gray-100 bg-white shadow-md max-w-full" 
        id="vazifalar_table_card"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#f8fafc]/80">
              <th className="p-4 sm:p-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-[200px]">
                VAZIFALAR
              </th>
              {displayDates.map(d => (
                <th key={d.key} className="p-2 sm:p-3 text-center min-w-[55px]" id={`th_col_${d.dateNum}`}>
                  <div className="flex flex-col items-center">
                    <span className={`text-[8px] font-black tracking-wider uppercase ${d.isWeekend ? 'text-red-500' : 'text-slate-400'}`}>
                      {d.dayLabel}
                    </span>
                    <span className={`text-xs sm:text-sm font-black mt-0.5 ${d.isWeekend ? 'text-red-500' : 'text-slate-700'}`}>
                      {d.dateNum}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id} className="border-b border-gray-50 hover:bg-slate-50/30 transition-colors">
                <td className="p-4 sm:p-5 text-left font-bold text-sm text-slate-800 flex items-center justify-between group min-w-[200px]" id={`td_habit_title_${habit.id}`}>
                  <span className="truncate">{habit.name}</span>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 ml-2 cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
                {displayDates.map(d => {
                  const isChecked = habit.history && habit.history[d.key] >= habit.targetValue;
                  return (
                    <td key={d.key} className="p-2 sm:p-3 text-center" id={`cell_${habit.id}_${d.dateNum}`}>
                      <button
                        onClick={() => handleToggleDay(habit.id, d.key)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                          isChecked
                            ? 'border-emerald-500 bg-white text-emerald-500 shadow-sm'
                            : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100 hover:border-slate-200 text-transparent'
                        } cursor-pointer`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}

            {habits.length === 0 && (
              <tr>
                <td colSpan={displayDates.length + 1} className="py-12 text-center text-slate-400 text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Hozircha hech qanday vazifa kiritilmagan. Yuqoridagi tugma orqali yangi vazifalar qo'shishingiz mumkin!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. SIMPLE SELECTION WIDGET TABS (Oddiy tanlash tugmalari) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-[2rem] my-8 shadow-xs" id="widget_selector_container">
        <div className="flex items-center gap-3 pl-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#2463eb]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yordamchi vositalar:</span>
        </div>
        
        <div className="flex gap-2.5 w-full sm:w-auto justify-end" id="widget_tabs_selector">
          <button
            onClick={() => setActiveWidget('focus')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
              activeWidget === 'focus'
                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Fokus Time
          </button>
          <button
            onClick={() => setActiveWidget('analytics')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
              activeWidget === 'analytics'
                ? 'bg-purple-900 border-purple-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Analitika
          </button>
        </div>
      </div>

      {/* 5. DYNAMIC WIDGET VIEWS */}
      {activeWidget === 'focus' ? (
        <div 
          className="w-full bg-slate-900 text-white rounded-[2.2rem] p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden transition-all duration-300"
          id="elegant_focus_time_section"
        >
          {/* Subtle decorative glowing background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 z-10">
            {/* Left Text details */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <span className="text-[9px] bg-blue-500/15 text-blue-300 font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border border-blue-500/20">
                Deep Work Station
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-sans">
                  Fokus Time
                </h3>
                <button
                  onClick={() => setIsFullscreenFocus(true)}
                  className="mx-auto md:mx-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/35 border border-blue-500/35 text-blue-300 rounded-xl text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                  title="To'liq Ekran / Fullscreen"
                >
                  <Maximize className="w-3 h-3" />
                  To'liq ekran
                </button>
              </div>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                Muvaffaqiyatli SAT va IELTS talabalari dars davomida diqqatni to'liq darsga qaratadi. 25 daqiqalik pomodoro taymerini ishga tushiring va miya faolligini oshiruvchi tovushlarni yoqing.
              </p>

              {/* Embedded Audio Synth widgets */}
              <div className="space-y-2 pt-2" id="embedded_synth">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block text-center md:text-left">
                  Ambient Fokus Tovushlar:
                </span>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => activeSound === 'rain' ? stopAmbientSound() : playAmbientSound('rain')}
                    className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      activeSound === 'rain' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <Droplets className="w-3 h-3 inline" /> Yomg'ir
                  </button>
                  <button
                    onClick={() => activeSound === 'wind' ? stopAmbientSound() : playAmbientSound('wind')}
                    className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      activeSound === 'wind' 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <Wind className="w-3 h-3 inline" /> Shamol
                  </button>
                  <button
                    onClick={() => activeSound === 'alpha' ? stopAmbientSound() : playAmbientSound('alpha')}
                    className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      activeSound === 'alpha' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <Brain className="w-3 h-3 inline" /> Alpha (8Hz)
                  </button>
                  {activeSound !== 'none' && (
                    <button
                      onClick={stopAmbientSound}
                      className="py-1.5 px-2 bg-rose-600 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                    >
                      O'chirish
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Timer Side */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 w-full md:w-auto" id="timer_side_dashboard">
              {/* Minimal timer progress ring */}
              <div className="relative w-24 h-24 rounded-full border-2 border-blue-500/10 flex flex-col items-center justify-center bg-slate-950">
                <span className="text-xl font-bold font-mono text-white">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[7px] font-bold uppercase tracking-wider text-blue-400">
                  {sessionType === 'study' ? 'Dars' : 'Break'}
                </span>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    className="stroke-blue-500 transition-all duration-1000"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray="276"
                    strokeDashoffset={276 - (276 * timeLeft) / (sessionType === 'study' ? 1500 : 300)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-1.5 flex-1 md:flex-initial min-w-[120px]">
                <button
                  onClick={toggleRunning}
                  className={`py-2 px-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    isRunning 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  {isRunning ? "Stop" : "Start"}
                </button>
                <button
                  onClick={resetTimer}
                  className="py-2 px-3.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="bg-[#120721] text-white rounded-[2.2rem] p-6 sm:p-8 border border-purple-950 shadow-xl space-y-4 relative overflow-hidden transition-all duration-300"
          id="glowing_natijalar_tahlili"
        >
          {/* Subtle purple background glow */}
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-950/85 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] bg-purple-500/20 text-purple-300 font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border border-purple-500/20">
                Muntazamlik Xaritasi
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight uppercase mt-2">
                Natijalar Tahlili
              </h3>
              <p className="text-[10px] text-purple-300/60">
                So'nggi darslar tahlili va unumdorlik dinamikasi ko'rsatkichi (Area Graph)
              </p>
            </div>

            <div className="flex gap-3" id="purple_quick_stats">
              <div className="bg-purple-950/40 rounded-xl px-3 py-1.5 text-center border border-purple-900/30">
                <span className="text-[8px] text-purple-400 font-extrabold uppercase tracking-wider block">O'rtacha</span>
                <span className="text-sm font-bold text-white font-mono">72%</span>
              </div>
              <div className="bg-purple-950/40 rounded-xl px-3 py-1.5 text-center border border-purple-900/30">
                <span className="text-[8px] text-purple-400 font-extrabold uppercase tracking-wider block">Trend</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">+18%</span>
              </div>
            </div>
          </div>

          {/* High fidelity Compact Area Graph */}
          <div className="relative pt-2" id="area_chart_compact_container">
            
            {/* Small Tooltip overlay */}
            <div className="absolute top-0 right-2 bg-[#21093b] border border-purple-500/25 text-white rounded-lg p-2 text-[10px] shadow-md z-10" id="graph_tooltip">
              {hoveredPoint !== null ? (
                <div>
                  <span className="font-extrabold text-purple-300">{graphData[hoveredPoint].labelFull}: </span>
                  <span className="font-mono font-bold text-emerald-400">{graphData[hoveredPoint].value}%</span>
                </div>
              ) : (
                <span className="text-purple-300/70">Nuqtalar ustiga keltiring</span>
              )}
            </div>

            {/* SVG Area Graph */}
            <div className="w-full h-44 sm:h-52 bg-[#0e041c]/60 rounded-xl border border-purple-950 p-3 relative overflow-visible">
              <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGradCompact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="50" y1="30" x2="950" y2="30" stroke="#4a1d96" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />
                <line x1="50" y1="90" x2="950" y2="90" stroke="#4a1d96" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />
                <line x1="50" y1="150" x2="950" y2="150" stroke="#4a1d96" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />
                <line x1="50" y1="170" x2="950" y2="170" stroke="#4a1d96" strokeWidth="1" opacity="0.4" />

                {/* Area Under Path */}
                <path
                  d="M 50 170 
                     L 50 107
                     L 140 93
                     L 230 114
                     L 320 65
                     L 410 58
                     L 500 55
                     L 590 72
                     L 680 51
                     L 770 41
                     L 860 79
                     L 950 46
                     L 950 170 Z"
                  fill="url(#areaGradCompact)"
                />

                {/* Wave Stroke */}
                <path
                  d="M 50 107
                     L 140 93
                     L 230 114
                     L 320 65
                     L 410 58
                     L 500 55
                     L 590 72
                     L 680 51
                     L 770 41
                     L 860 79
                     L 950 46"
                  fill="none"
                  stroke="#d946ef"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Axis Labels (X) */}
                {graphData.map((data, idx) => {
                  const x = 50 + idx * 90;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y="190"
                      className="fill-purple-300 font-mono font-bold text-[11px]"
                      textAnchor="middle"
                    >
                      {data.label}
                    </text>
                  );
                })}

                {/* Axis Labels (Y) */}
                <text x="30" y="34" className="fill-purple-400 font-mono font-bold text-[9px]" textAnchor="end">100%</text>
                <text x="30" y="94" className="fill-purple-400 font-mono font-bold text-[9px]" textAnchor="end">50%</text>
                <text x="30" y="154" className="fill-purple-400 font-mono font-bold text-[9px]" textAnchor="end">25%</text>

                {/* Dots */}
                {graphData.map((data, idx) => {
                  const x = 50 + idx * 90;
                  const y = 170 - (data.value / 100 * 140);
                  const isHovered = hoveredPoint === idx;

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r="16"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={() => setHoveredPoint(idx)}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? "6" : "4"}
                        fill={isHovered ? "#34d399" : "#d946ef"}
                        stroke="white"
                        strokeWidth={isHovered ? "2" : "1"}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Informative advice */}
          <div className="bg-purple-950/20 rounded-xl p-3 border border-purple-900/30 flex items-center gap-2.5" id="quote_box">
            <Brain className="w-4 h-4 text-purple-300 shrink-0" />
            <p className="text-[10px] text-purple-200 leading-relaxed font-semibold">
              Sizning darslardagi izchilligingiz o'sish dinamikasiga ega. Odatlarni tark etmasdan davom ettiring!
            </p>
          </div>
        </div>
      )}

      {/* 6. IMMERSIVE DEEP FOCUS FULLSCREEN OVERLAY */}
      {isFullscreenFocus && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 text-white select-none overflow-hidden" id="fullscreen_focus_container">
          {/* Top subtle glow progress bar */}
          <div 
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-90 transition-all duration-1000" 
            style={{ width: `${(timeLeft / (sessionType === 'study' ? 1500 : 300)) * 100}%` }}
          />
          
          {/* Background Ambient Radial Glow Blobs */}
          <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Header row */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10" id="fullscreen_header">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                Maksimal Diqqat Rejimi (Deep Focus Mode)
              </span>
            </div>
            <button
              onClick={() => setIsFullscreenFocus(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer"
              id="exit_fullscreen_btn"
            >
              <Minimize className="w-4 h-4 text-rose-400" />
              Tark etish
            </button>
          </div>

          {/* Central Mega Countdown Display */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 z-10 my-auto" id="fullscreen_timer_main">
            <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96" id="glowing_timer_ring">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-ping opacity-20" style={{ animationDuration: '4s' }} />
              
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-slate-900/60"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-blue-500 transition-all duration-1000"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="1100"
                  strokeDashoffset={1100 - (1100 * timeLeft) / (sessionType === 'study' ? 1500 : 300)}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(59,130,246,0.5))' }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center space-y-2">
                <span className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  {formatTime(timeLeft)}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  sessionType === 'study' 
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' 
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}>
                    {sessionType === 'study' ? <><BookOpen className="w-3.5 h-3.5 inline" /> dars vaqti</> : <><Coffee className="w-3.5 h-3.5 inline" /> tanaffus</>}
                </span>
              </div>
            </div>

            {/* Quick action buttons inside Fullscreen */}
            <div className="flex items-center gap-4 pt-4" id="fullscreen_controls">
              <button
                onClick={toggleRunning}
                className={`py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all duration-200 border ${
                  isRunning 
                    ? 'bg-rose-600 border-rose-600 hover:bg-rose-700 text-white' 
                    : 'bg-blue-600 border-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isRunning ? "To'xtatish" : "Boshlash"}
              </button>
              <button
                onClick={resetTimer}
                className="py-4 px-6 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest transition cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Bottom Ambient Music controller bar */}
          <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-md border border-slate-850 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10" id="fullscreen_sound_bar">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
              <div className="text-left">
                <p className="text-xs font-black text-slate-300 uppercase tracking-wider">Diqqatni Jamlash Tovushi</p>
                <p className="text-[10px] text-slate-400 font-semibold">Tanaffus va dars paytida fon sifatida ishlaydi</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => activeSound === 'rain' ? stopAmbientSound() : playAmbientSound('rain')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSound === 'rain' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 inline" /> Yomg'ir
              </button>
              <button
                onClick={() => activeSound === 'wind' ? stopAmbientSound() : playAmbientSound('wind')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSound === 'wind' 
                    ? 'bg-teal-600 text-white shadow-lg' 
                    : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Wind className="w-3.5 h-3.5 inline" /> Shamol
              </button>
              <button
                onClick={() => activeSound === 'alpha' ? stopAmbientSound() : playAmbientSound('alpha')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSound === 'alpha' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Brain className="w-3.5 h-3.5 inline" /> Alpha (8Hz)
              </button>
              {activeSound !== 'none' && (
                <button
                  onClick={stopAmbientSound}
                  className="py-2 px-3 bg-rose-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-lg"
                >
                  O'chirish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD HABIT MODAL OVERLAY */}
      {showAddHabitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form 
            onSubmit={handleCreateHabit} 
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-gray-100 shadow-2xl relative"
            id="add_habit_modal"
          >
            <button
              type="button"
              onClick={() => setShowAddHabitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-750 font-mono text-base font-black cursor-pointer"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 uppercase">Yangi vazifa qo'shish</h3>
              <p className="text-xs text-slate-400 font-semibold">Kuzatib borish uchun kunlik vazifangizni kiriting.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Vazifa nomi</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Masalan: SAT English Reading yoki IELTS Vocab"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Maqsad miqdori</label>
                  <input
                    type="number"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none focus:border-black text-slate-900"
                    min="1"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Birligi</label>
                  <input
                    type="text"
                    value={newHabitUnit}
                    onChange={(e) => setNewHabitUnit(e.target.value)}
                    placeholder="daq, sahifa, test"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none focus:border-black text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddHabitModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2463eb] hover:bg-[#1d4ed8] text-white font-black rounded-xl text-xs transition uppercase tracking-wider cursor-pointer"
              >
                Qo'shish
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
