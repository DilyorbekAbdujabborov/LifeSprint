import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { useStore } from '../store';
import Pandoo from './Pandoo';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Video,
  PenTool,
  Brain,
  Award,
  Book,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Volume2,
  Clock,
  Zap,
  Check,
  Plus,
  Users,
  Tag,
  ShoppingBag,
  Star,
  Gift,
  DollarSign,
  Calendar,
  Info,
  Rocket
} from 'lucide-react';
import { Question, Course } from '../types';
import CustomSelect from './CustomSelect';
import { useToast } from '../toast';

interface AcademicsProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userRole: 'student' | 'teacher' | 'parent' | 'admin';
  isDarkMode?: boolean;
}

export default function Academics({
  xp,
  setXp,
  setLevel,
  coins,
  setCoins,
  courses,
  setCourses,
  userRole,
  isDarkMode = false
}: AcademicsProps) {
  const { toast } = useToast();
  const [selectedHub, setSelectedHub] = useState<'IELTS' | 'SAT' | 'MILLIY' | 'KURSLAR' | null>(null);
  const [activeMockType, setActiveMockType] = useState<'reading' | 'listening' | 'writing' | 'speaking' | 'math' | 'english' | 'full' | 'subject' | null>(null);
  const [activeSubject, setActiveSubject] = useState<string>('');
  
  // Quiz Simulation State
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [essayAnswer, setEssayAnswer] = useState('');
  const [speakingAnswer, setSpeakingAnswer] = useState('');
  const [examFinished, setExamFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showPandoo, setShowPandoo] = useState(false);
  const [wrongMcqAnswers, setWrongMcqAnswers] = useState<{ question: string; options: string[]; correct: number; userAnswer: number; explanation: string }[]>([]);

  // Course/Group management states
  const [courseTab, setCourseTab] = useState<'store' | 'my' | 'create'>('store');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Dasturlash');
  const [newCoursePrice, setNewCoursePrice] = useState('60');
  const [newCourseDuration, setNewCourseDuration] = useState('3 oy (24 dars)');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('indigo');
  const [courseSuccessMsg, setCourseSuccessMsg] = useState('');
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');

  // Group chat state
  const [activeChatCourseId, setActiveChatCourseId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, { author: string, text: string, time: string, isMe?: boolean }[]>>({
    'c1': [
      { author: 'Bunyodbek Nematov', text: 'Salom hamma guruhdoshlarga! Darslar qachon boshlanadi?', time: '10:15' },
      { author: 'Saidabror Abdusaidov', text: 'Assalomu alaykum. Ustoz dars bugun 20:00 da bo\'ladi dedilar.', time: '10:20' },
      { author: 'Sardorbek Kobilov (Mentor)', text: 'Salom bolalar! Bugun birinchi kirish darsi, vaqtida qatnashishga harakat qiling.', time: '11:00' }
    ],
    'c2': [
      { author: 'Havasxon Mashrabova', text: 'Hey guys! Ready for the IELTS speaking practice group today?', time: '09:30' },
      { author: 'Hojiakbar Mashrabova', text: 'Yeah! I prepared the topic about environmental issues.', time: '09:35' }
    ]
  });

  const handleBuyCourse = async (course: Course) => {
    if (coins < course.priceCoins) {
      setBuyError(`Tanga yetarli emas! Lekin xavotirlanmang, biz sizga ushbu kursga ulanish va uning guruhiga qo'shilish uchun 100% BEPUL Grant (Simulyatsiya) beramiz!`);
      setTimeout(() => setBuyError(''), 10000);
      return;
    }

    const res = await api.reward('purchase_course', { priceCoins: course.priceCoins }).catch(() => null);
    if (res) {
      setXp(res.totalXp);
      setCoins(res.totalCoins);
      setLevel(res.level);
    }
    useStore.getState().enrollCourse(course.id);
    setBuySuccess(`Tabriklaymiz! "${course.title}" kursiga muvaffaqiyatli a'zo bo'ldingiz va dars guruhiga qo'shildingiz!`);
    setBuyError('');
    setTimeout(() => setBuySuccess(''), 5000);
  };

  const handleSimulateFreeEnroll = (course: Course) => {
    useStore.getState().enrollCourse(course.id);
    setBuySuccess(`Simulyatsiya Granti: "${course.title}" kursiga BEPUL a'zo bo'ldingiz va guruhga qo'shildingiz!`);
    setBuyError('');
    setTimeout(() => setBuySuccess(''), 5000);
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
      toast("Iltimos, barcha maydonlarni to'ldiring!", 'warning');
      return;
    }

    const price = parseInt(newCoursePrice) || 50;
    const newId = `c_${Date.now()}`;
    const courseObj: Course = {
      id: newId,
      title: newCourseTitle,
      description: newCourseDescription,
      teacherName: userRole === 'teacher' ? 'Biloliddin Akramov (O\'qituvchi)' : 'Boburjon G\'ulomov',
      priceCoins: price,
      enrolled: false,
      duration: newCourseDuration,
      lessonsCount: 18,
      rating: 5.0,
      ratingCount: 1,
      category: newCourseCategory,
      color: newCourseColor
    };

    setCourses(prev => [courseObj, ...prev]);
    setNewCourseTitle('');
    setNewCourseDescription('');
    api.publishCourse(courseObj).then(res => {
      if (res.courses) setCourses(res.courses);
    }).catch(() => {});
    setCourseSuccessMsg(`"${newCourseTitle}" kursi muvaffaqiyatli sotuvga joylandi! Barcha o'quvchilar uni darsliklar bo'limidan sotib olishlari mumkin.`);
    setTimeout(() => setCourseSuccessMsg(''), 5000);
  };

  const handleSendChatMessage = (courseId: string) => {
    if (!chatInput.trim()) return;

    const newMsg = {
      author: 'Siz (O\'quvchi)',
      text: chatInput,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatHistory(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), newMsg]
    }));
    setChatInput('');

    setTimeout(() => {
      const responseMsg = {
        author: 'Bunyodbek Nematov',
        text: `Ajoyib fikr! Guruhimizga qo'shilganingizdan xursandmiz.`,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => ({
        ...prev,
        [courseId]: [...(prev[courseId] || []), responseMsg]
      }));
    }, 1500);
  };

  // AI Feedback state for Writing/Speaking
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  interface MockQuestion {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  }

  const [academicsData, setAcademicsData] = useState<{
    ieltsReading: MockQuestion[];
    ieltsListening: MockQuestion[];
    ieltsFull: MockQuestion[];
    satMath: MockQuestion[];
    satEnglish: MockQuestion[];
    satFull: MockQuestion[];
    milliyMath: MockQuestion[];
    milliyPhysics: MockQuestion[];
    milliyNative: MockQuestion[];
    milliyFull: MockQuestion[];
  } | null>(null);
  const [academicsLoading, setAcademicsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mock/academics')
      .then(res => res.json())
      .then(data => {
        setAcademicsData(data);
        setAcademicsLoading(false);
      })
      .catch(() => setAcademicsLoading(false));
  }, []);

  const activeQuestions = 
    selectedHub === 'IELTS' && activeMockType === 'reading' ? (academicsData?.ieltsReading || []) :
    selectedHub === 'IELTS' && activeMockType === 'listening' ? (academicsData?.ieltsListening || []) :
    selectedHub === 'IELTS' && activeMockType === 'full' ? (academicsData?.ieltsFull || []) :
    selectedHub === 'SAT' && activeMockType === 'math' ? (academicsData?.satMath || []) :
    selectedHub === 'SAT' && activeMockType === 'english' ? (academicsData?.satEnglish || []) :
    selectedHub === 'SAT' && activeMockType === 'full' ? (academicsData?.satFull || []) :
    selectedHub === 'MILLIY' && activeSubject === 'Matematika' ? (academicsData?.milliyMath || []) :
    selectedHub === 'MILLIY' && activeSubject === 'Fizika' ? (academicsData?.milliyPhysics || []) :
    selectedHub === 'MILLIY' && activeSubject === 'Ona tili' ? (academicsData?.milliyNative || []) :
    selectedHub === 'MILLIY' && activeMockType === 'full' ? (academicsData?.milliyFull || []) :
    (academicsData?.milliyFull || []);

  // Start exam flow
  const handleStartExam = (type: typeof activeMockType, subject: string = '') => {
    setActiveMockType(type);
    setActiveSubject(subject);
    setExamStarted(true);
    setAnswers({});
    setEssayAnswer('');
    setSpeakingAnswer('');
    setExamFinished(false);
    setAiFeedback('');
    setShowPandoo(false);
    setWrongMcqAnswers([]);
  };

  // Submit exam and payout XP based on gamification logic
  const handleFinishExam = () => {
    setExamFinished(true);

    // Calculate MCQ scores if any
    let score = 0;
    const wrongs: { question: string; options: string[]; correct: number; userAnswer: number; explanation: string }[] = [];
    if (activeMockType !== 'writing' && activeMockType !== 'speaking') {
      activeQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
          score += 1;
        } else {
          wrongs.push({
            question: q.q,
            options: q.options,
            correct: q.correct,
            userAnswer: answers[idx] ?? -1,
            explanation: q.explanation || "Pandoo tahlil qilmoqda...",
          });
        }
      });
      setFinalScore(score);
      setWrongMcqAnswers(wrongs);
      if (activeQuestions.length > 0 && score / activeQuestions.length < 0.5) {
        setShowPandoo(true);
      }
    }

    // Reward calculation: Full Mock = 2000XP, Single Section = 500XP
    const isFullMock = activeMockType === 'full';
    const action = isFullMock ? 'complete_mock_full' : 'complete_mock_section';

    api.rewardAndUpdate(setXp, setCoins, setLevel, action);
  };

  // Evaluate writing essay / speaking speech via Gemini API Proxy
  const handleAiEvaluation = async () => {
    setIsAiLoading(true);
    setAiFeedback('');

    const textToEvaluate = activeMockType === 'writing' ? essayAnswer : speakingAnswer;
    const typeLabel = activeMockType === 'writing' ? 'IELTS Writing Essay' : 'IELTS Speaking Speech';

    if (!textToEvaluate.trim()) {
      toast("Iltimos, baholash olish uchun matn kiriting!", 'warning');
      setIsAiLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Siz IELTS bo'yicha eng tajribali xalqaro imtihon oluvchi murabbiysiz. Berilgan ${typeLabel} matnini tahlil qiling:
          
          Matn:
          "${textToEvaluate}"
          
          Quyidagilarni aniqlab bering:
          1. Taxminiy IELTS Band Score (masalan: Band 6.5, 7.0 va h.k.)
          2. Grammatika, so'z boyligi, ravonlik (Fluency/Cohesion) bo'yicha xato va kamchiliklar tahlili.
          3. O'quvchi o'z darajasini oshirishi uchun amaliy maslahatlar.
          
          Javobingizni o'zbek tilida, juda tushunarli, aniq, muloyim va chiroyli tartiblangan formatda bering.`,
          systemInstruction: 'Siz IELTS tayyorlash bo\'yicha dunyodagi eng yetakchi o\'zbek murabbiysiz.'
        })
      });

      const data = await response.json();
      if (data.text) {
        setAiFeedback(data.text);
      } else {
        setAiFeedback('AI tahlil olishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      }
    } catch (e) {
      console.error(e);
      setAiFeedback('Kechirasiz, server bilan bog\'lanishda xatolik yuz berdi.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (selectedHub && academicsLoading) {
    return (
      <div className="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Savollar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (selectedHub && !academicsData) {
    return (
      <div className="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Savollarni yuklashda xatolik yuz berdi.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto" id="academics_main_wrapper">
      
      {/* 1. HUB LIST VIEW (Default screen) */}
      {!selectedHub && !examStarted && (
        <div className="space-y-8" id="hubs_selection_screen">
          <div id="hubs_header">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Akademik Darslar va Mock Imtihonlar</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              IELTS, SAT yoki Milliy sertifikat yo'nalishlaridan birini tanlang va o'zingizni sinab ko'ring. Har bir mock uchun yuqori XP ballariga ega bo'ling.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6" id="hubs_banners_grid">
            
            {/* Box 1: IELTS Hub (Long rectangular card) */}
            <div 
              onClick={() => setSelectedHub('IELTS')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200')` }}
              className="w-full h-44 md:h-40 rounded-3xl cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:shadow-lg relative overflow-hidden flex items-center p-8 bg-cover bg-center"
              id="hub_card_ielts"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-indigo-900/80 to-transparent" />
              <div className="space-y-1.5 relative z-10 max-w-2xl text-white">
                <span className="text-[10px] font-extrabold tracking-widest bg-white dark:bg-[#151433]/20 px-3 py-1 rounded-full uppercase">IELTS HUB</span>
                <h3 className="text-2xl font-black">IELTS Akademik Prep Hub</h3>
                <p className="text-xs text-indigo-100 leading-relaxed max-w-lg hidden sm:block">
                  Reading, Listening, Writing, va Speaking mock testlarini topshiring. Insho va nutqlarni AI yordamida baholang.
                </p>
                <div className="flex gap-4 pt-1 text-[11px] font-medium text-indigo-200">
                  <span>Maqsad: Band 7.5+</span>
                  <span><Zap className="w-3 h-3 inline" /> 2000XP gacha mukofot</span>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="px-5 py-3 bg-white dark:bg-[#151433] text-indigo-800 font-extrabold text-xs rounded-2xl hover:bg-indigo-50 transition-all flex items-center gap-1.5 shadow-sm">
                  Hubga Kirish <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Box 2: SAT Hub (Long rectangular card) */}
            <div 
              onClick={() => setSelectedHub('SAT')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200')` }}
              className="w-full h-44 md:h-40 rounded-3xl cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:shadow-lg relative overflow-hidden flex items-center p-8 bg-cover bg-center"
              id="hub_card_sat"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-950/95 via-orange-900/80 to-transparent" />
              <div className="space-y-1.5 relative z-10 max-w-2xl text-white">
                <span className="text-[10px] font-extrabold tracking-widest bg-white dark:bg-[#151433]/20 px-3 py-1 rounded-full uppercase">SAT HUB</span>
                <h3 className="text-2xl font-black">Digital SAT Prep Hub</h3>
                <p className="text-xs text-amber-100 leading-relaxed max-w-lg hidden sm:block">
                  SAT Matematika va Ingliz tili qismlari bo'yicha moslashuvchan savollar hamda to'liq mock simulyatsiyasi.
                </p>
                <div className="flex gap-4 pt-1 text-[11px] font-medium text-amber-200">
                  <span>Maqsad: 1550+ Ball</span>
                  <span><Zap className="w-3 h-3 inline" /> 2000XP gacha mukofot</span>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="px-5 py-3 bg-white dark:bg-[#151433] text-orange-800 font-extrabold text-xs rounded-2xl hover:bg-orange-50 transition-all flex items-center gap-1.5 shadow-sm">
                  Hubga Kirish <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Box 3: Milliy Sertifikat Hub (Long rectangular card) */}
            <div 
              onClick={() => setSelectedHub('MILLIY')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200')` }}
              className="w-full h-44 md:h-40 rounded-3xl cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:shadow-lg relative overflow-hidden flex items-center p-8 bg-cover bg-center"
              id="hub_card_milliy"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-teal-900/80 to-transparent" />
              <div className="space-y-1.5 relative z-10 max-w-2xl text-white">
                <span className="text-[10px] font-extrabold tracking-widest bg-white dark:bg-[#151433]/20 px-3 py-1 rounded-full uppercase">MILLIY SERTIFIKATLAR</span>
                <h3 className="text-2xl font-black">Milliy Sertifikat (DTM) Hub</h3>
                <p className="text-xs text-teal-100 leading-relaxed max-w-lg hidden sm:block">
                  Matematika, Fizika va Ona tili fanlaridan milliy sertifikat namunaviy testlari va darsliklari.
                </p>
                <div className="flex gap-4 pt-1 text-[11px] font-medium text-teal-200">
                  <span>Maqsad: A+ Daraja</span>
                  <span><Zap className="w-3 h-3 inline" /> 2000XP gacha mukofot</span>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="px-5 py-3 bg-white dark:bg-[#151433] text-teal-800 font-extrabold text-xs rounded-2xl hover:bg-teal-50 transition-all flex items-center gap-1.5 shadow-sm">
                  Hubga Kirish <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Box 4: Onlayn Kurslar & Guruhlar Hub (Long rectangular card) */}
            <div 
              onClick={() => setSelectedHub('KURSLAR')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200')` }}
              className="w-full h-44 md:h-40 rounded-3xl cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:shadow-lg relative overflow-hidden flex items-center p-8 bg-cover bg-center"
              id="hub_card_kurslar"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-fuchsia-950/80 to-transparent" />
              <div className="space-y-1.5 relative z-10 max-w-2xl text-white">
                <span className="text-[10px] font-extrabold tracking-widest bg-white dark:bg-[#151433]/20 px-3 py-1 rounded-full uppercase">KURS SOTISH VA SOTIB OLISH</span>
                <h3 className="text-2xl font-black">Onlayn Kurslar & Guruhlar</h3>
                <p className="text-xs text-fuchsia-100 leading-relaxed max-w-lg hidden sm:block">
                  O'qituvchilardan onlayn kurslarni sotib oling, o'z darslaringizni soting va maxsus o'quv guruhlariga a'zo bo'ling.
                </p>
                <div className="flex gap-4 pt-1 text-[11px] font-medium text-fuchsia-200">
                  <span><GraduationCap className="w-3 h-3 inline" /> O'quvchilar: Kurslar & Guruhlar</span>
                  <span><GraduationCap className="w-3 h-3 inline" /> O'qituvchilar: Kurs yaratish & Sotish</span>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="px-5 py-3 bg-white dark:bg-[#151433] text-violet-800 font-extrabold text-xs rounded-2xl hover:bg-violet-50 transition-all flex items-center gap-1.5 shadow-sm">
                  Do'konga Kirish <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. SPECIFIC HUB DETAIL SCREEN */}
      {selectedHub && !examStarted && (
        <div className="space-y-8" id="hub_detail_screen">
          
          {/* Back button to Hub selections */}
          <button 
            id="back_to_hubs_btn"
            onClick={() => setSelectedHub(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-800/30 hover:bg-gray-200 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Asosiy darsliklarga qaytish
          </button>

          {/* IELTS HUB DETAIL */}
          {selectedHub === 'IELTS' && (
            <div className="space-y-6" id="ielts_hub_details">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">IELTS hubga xush kelibsiz!</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Qaysi section bo'yicha mock yechasiz?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="ielts_sections_selection">
                {/* Reading Mock card */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_ielts_reading">
                  <div className="space-y-2">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm">Reading</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Akademik Reading matnlari va 3 ta savol tahlili.</p>
                  </div>
                  <button 
                    id="start_ielts_reading_btn"
                    onClick={() => handleStartExam('reading')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Yechish (+500 XP)
                  </button>
                </div>

                {/* Listening Mock card */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_ielts_listening">
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm">Listening</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Audio kliplar matni asosida javob yozish.</p>
                  </div>
                  <button 
                    id="start_ielts_listening_btn"
                    onClick={() => handleStartExam('listening')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Yechish (+500 XP)
                  </button>
                </div>

                {/* Writing Mock card */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_ielts_writing">
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
                      <PenTool className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm">Writing</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Task 2 insho yozish va sun'iy intellekt bahosi.</p>
                  </div>
                  <button 
                    id="start_ielts_writing_btn"
                    onClick={() => handleStartExam('writing')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Yechish (+500 XP)
                  </button>
                </div>

                {/* Speaking Mock card */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_ielts_speaking">
                  <div className="space-y-2">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm">Speaking</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Mavzuli nutq yozish va AI murabbiyi tahlili.</p>
                  </div>
                  <button 
                    id="start_ielts_speaking_btn"
                    onClick={() => handleStartExam('speaking')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Yechish (+500 XP)
                  </button>
                </div>

                {/* FULL MOCK */}
                <div className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_ielts_full">
                  <div className="space-y-2">
                    <div className="p-3 bg-violet-600 text-white rounded-2xl w-fit">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-indigo-950 text-sm">Full</h3>
                    <p className="text-[10px] text-indigo-700/80 font-medium">Barcha bo'limlarni o'z ichiga olgan mukammal IELTS mock imtihoni.</p>
                  </div>
                  <button 
                    id="start_ielts_full_btn"
                    onClick={() => handleStartExam('full')}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-sm"
                  >
                    Full Mock (+2000 XP)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAT HUB DETAIL */}
          {selectedHub === 'SAT' && (
            <div className="space-y-6" id="sat_hub_details">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Digital SAT Hub-ga Xush Kelibsiz!</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Iltimos, pastdagi bo'limlardan birini tanlang va darhol testlarni yechishga o'ting.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="sat_sections_selection">
                {/* SAT Math card */}
                <div className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_sat_math">
                  <div className="space-y-2">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 dark:text-slate-100 text-base">Math (Matematika)</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">Algebra, Ma'lumotlar tahlili va trigonometriya bo'yicha oddiy moslashuvchan testlar.</p>
                  </div>
                  <button 
                    id="start_sat_math_btn"
                    onClick={() => handleStartExam('math')}
                    className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Boshlash (+500 XP)
                  </button>
                </div>

                {/* SAT English card */}
                <div className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_sat_verbal">
                  <div className="space-y-2">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 dark:text-slate-100 text-base">English (Ingliz tili)</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">Matn tahlili, grammatika va lug'at boyligi bo'yicha qulay va sodda savollar.</p>
                  </div>
                  <button 
                    id="start_sat_english_btn"
                    onClick={() => handleStartExam('english')}
                    className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Boshlash (+500 XP)
                  </button>
                </div>

                {/* SAT Full Mock */}
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm" id="card_sat_full">
                  <div className="space-y-2">
                    <div className="p-3 bg-orange-500 text-white rounded-2xl w-fit">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-amber-950 text-base">Full Mock</h3>
                    <p className="text-xs text-amber-700 font-medium">Matematika va Ingliz tili qismlarini birlashtirgan to'liq SAT sinov imtihoni.</p>
                  </div>
                  <button 
                    id="start_sat_full_btn"
                    onClick={() => handleStartExam('full')}
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-xs"
                  >
                    Boshlash (+2000 XP)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MILLIY SERTIFIKAT HUB DETAIL */}
          {selectedHub === 'MILLIY' && (
            <div className="space-y-6" id="milliy_hub_details">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Milliy Sertifikat (DTM) Namunaviy Hub</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Davlat oliy o'quv yurtlariga kirish imtihonlarida maksimal ball beradigan milliy sertifikatlar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="milliy_sections_selection">
                {/* Matematika */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4" id="card_milliy_math">
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 dark:text-slate-100 text-sm">Matematika sertifikati</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">DTM standarti bo'yicha matematikadan milliy mock imtihoni.</p>
                  </div>
                  <button 
                    id="start_milliy_math_btn"
                    onClick={() => handleStartExam('subject', 'Matematika')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Mock (+500 XP)
                  </button>
                </div>

                {/* Fizika */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4" id="card_milliy_physics">
                  <div className="space-y-2">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 dark:text-slate-100 text-sm">Fizika sertifikati</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Kinematika, dinamika va kvant fizikasiga oid dars va testlar.</p>
                  </div>
                  <button 
                    id="start_milliy_physics_btn"
                    onClick={() => handleStartExam('subject', 'Fizika')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Mock (+500 XP)
                  </button>
                </div>

                {/* Ona tili */}
                <div className="p-5 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4" id="card_milliy_native">
                  <div className="space-y-2">
                    <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl w-fit">
                      <Book className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 dark:text-slate-100 text-sm">Ona tili (Grammatika)</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">O'zbek tili va adabiyotidan milliy sertifikat testi.</p>
                  </div>
                  <button 
                    id="start_milliy_native_btn"
                    onClick={() => handleStartExam('subject', 'Ona tili')}
                    className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    Mock (+500 XP)
                  </button>
                </div>

                {/* Full Mock */}
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl flex flex-col justify-between space-y-4" id="card_milliy_full">
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl w-fit">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-emerald-950 text-sm">Full Milliy Mock</h3>
                    <p className="text-[10px] text-emerald-700 font-medium">Barcha majburiy va asosiy blok fanlaridan to'liq mock imtihon.</p>
                  </div>
                  <button 
                    id="start_milliy_full_btn"
                    onClick={() => handleStartExam('full', 'To\'liq Milliy')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    Full Mock (+2000 XP)
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedHub === 'KURSLAR' && (
            <div className="space-y-6" id="kurslar_hub_details">
              
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden" id="kurslar_banner">
                <div className="absolute top-0 right-0 translate-x-12 -translate-y-6 w-60 h-60 rounded-full bg-white dark:bg-[#151433]/10 blur-2xl" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-extrabold tracking-widest bg-black/20 px-3 py-1 rounded-full uppercase">IT SHAHARCHA ACADEMY</span>
                  <h2 className="text-2xl sm:text-3xl font-black">Onlayn Kurslar & Guruhlar Ekotizimi</h2>
                  <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
                    O'qituvchilar tomonidan yaratilgan professional kurslarni sotib oling va o'zaro tajriba almashish uchun o'quv guruhlariga a'zo bo'ling!
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-slate-700/50 pb-3" id="kurslar_subtabs">
                <div className="flex gap-2 bg-gray-100 dark:bg-slate-800/30 p-1.5 rounded-2xl" id="subtabs_btn_group">
                  <button
                    onClick={() => setCourseTab('store')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      courseTab === 'store'
                        ? 'bg-white dark:bg-[#151433] text-violet-700 shadow-xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 inline" /> Kurslar Do'koni
                  </button>
                  <button
                    onClick={() => setCourseTab('my')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      courseTab === 'my'
                        ? 'bg-white dark:bg-[#151433] text-violet-700 shadow-xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <Star className="w-4 h-4 inline" /> Mening Kurslarim & Guruhlarim
                  </button>
                  <button
                    onClick={() => setCourseTab('create')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      courseTab === 'create'
                        ? 'bg-white dark:bg-[#151433] text-violet-700 shadow-xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 inline" /> Kurs yaratish (Sotuv)
                  </button>
                </div>

                {/* Coin balance display */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs font-black text-amber-800" id="academics_coin_balance">
                  <span><DollarSign className="w-4 h-4 inline" /> Mening balansim:</span>
                  <span className="font-mono text-sm bg-amber-200/50 px-2.5 py-0.5 rounded-lg text-amber-950">{coins} tanga</span>
                </div>
              </div>

              {/* Status messages */}
              {buySuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-extrabold text-emerald-800 animate-fade-in flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{buySuccess}</span>
                </div>
              )}

              {buyError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-extrabold text-rose-800 animate-fade-in space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>{buyError}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const targetCourse = courses.find(c => !c.enrolled);
                        if (targetCourse) handleSimulateFreeEnroll(targetCourse);
                      }}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase"
                    >
                      <Gift className="w-4 h-4 inline" /> Grant Orqali Bepul Qo'shilish (Simulyatsiya)
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: COURSE STORE */}
              {courseTab === 'store' && (
                <div className="space-y-4" id="store_courses_section">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Sotuvdagi onlayn darsliklar</h3>
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-bold">{courses.length} ta umumiy kurs mavjud</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="store_courses_grid">
                    {courses.map((course) => {
                      const colorClasses = 
                        course.color === 'indigo' ? { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white' } :
                        course.color === 'emerald' ? { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' } :
                        course.color === 'amber' ? { bg: 'bg-amber-50 border-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700 text-white' } :
                        { bg: 'bg-rose-50 border-rose-100 text-rose-700', btn: 'bg-rose-600 hover:bg-rose-700 text-white' };

                      return (
                        <div 
                          key={course.id}
                          className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm relative overflow-hidden"
                          id={`store_course_${course.id}`}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${colorClasses.bg}`}>
                                {course.category}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 inline fill-amber-500" /> {course.rating} <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">({course.ratingCount})</span>
                              </div>
                            </div>

                            <h4 className="font-black text-gray-900 dark:text-white text-lg leading-snug">{course.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-gray-50 dark:border-slate-700/30 text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                              <span><GraduationCap className="w-3 h-3 inline" /> Ustoz: <strong className="text-gray-700 dark:text-slate-300">{course.teacherName}</strong></span>
                              <span><Calendar className="w-3 h-3 inline" /> Davomiyligi: <strong className="text-gray-700 dark:text-slate-300">{course.duration}</strong></span>
                              <span><BookOpen className="w-3 h-3 inline" /> Darslar: <strong className="text-gray-700 dark:text-slate-300">{course.lessonsCount} ta dars</strong></span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">Kurs narxi</span>
                              <span className="text-lg font-black text-purple-600 font-mono">{course.priceCoins} tanga</span>
                            </div>

                            {course.enrolled ? (
                              <button
                                disabled
                                className="px-5 py-2.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl cursor-default flex items-center gap-1.5"
                              >
                                <Check className="w-4 h-4" /> A'zo bo'lingan
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBuyCourse(course)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black ${colorClasses.btn}`}
                              >
                                Sotib olish & Guruhga qo'shilish
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: MY ENROLLED COURSES & GROUPS */}
              {courseTab === 'my' && (
                <div className="space-y-4" id="my_courses_section">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Mening faol darslarim va o'quv guruhlarim</h3>
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-bold">
                      {courses.filter(c => c.enrolled).length} ta kursga ulaningiz
                    </span>
                  </div>

                  {courses.filter(c => c.enrolled).length === 0 ? (
                    <div className="p-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-3xl space-y-4 border border-dashed border-gray-200 dark:border-slate-600/50">
                      <svg className="w-12 h-12 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                        <path d="M12 22V12" />
                        <path d="M3.29 7 L7 4.5 L12 6.5" />
                        <path d="M20.71 7 L17 4.5 L12 6.5" />
                        <path d="M7 4.5 L17 4.5" />
                      </svg>
                      <h4 className="font-extrabold text-gray-700 dark:text-slate-300">Sizda hali sotib olingan kurslar yo'q</h4>
                      <p className="text-xs text-gray-400 dark:text-slate-500 max-w-md mx-auto">
                        Kurslar do'konidan biror kurs sotib olsangiz, u avtomatik ravishda ushbu darsliklar ro'yxatida va tegishli dars guruhida shakllanadi.
                      </p>
                      <button
                        onClick={() => setCourseTab('store')}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs rounded-xl"
                      >
                        Do'konga o'tish
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="my_courses_grid">
                      {courses.filter(c => c.enrolled).map((course) => {
                        const isChatActive = activeChatCourseId === course.id;
                        return (
                          <div 
                            key={course.id}
                            className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs"
                            id={`my_course_${course.id}`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full uppercase">
                                  {course.category}
                                </span>
                                <span className="text-xs text-emerald-600 font-black bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                  ● Guruh faol (G1)
                                </span>
                              </div>

                              <h4 className="font-black text-gray-950 dark:text-white text-base leading-snug">{course.title}</h4>
                              
                              <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-gray-500 dark:text-slate-400 space-y-1">
                                <p><GraduationCap className="w-3 h-3 inline" /> O'qituvchi: <strong className="text-gray-800 dark:text-slate-100">{course.teacherName}</strong></p>
                                <p><Calendar className="w-3 h-3 inline" /> Kelgusi darslik: <strong className="text-indigo-600">Ertaga, soat 20:00 (Mavzu: Kirish darsi)</strong></p>
                                <p><Users className="w-3 h-3 inline" /> Guruhdoshlar: <strong className="text-gray-800 dark:text-slate-100">12 ta o'quvchi qo'shildi</strong></p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => {
                                  toast(`Ushbu onlayn kursning dars materiallari yuklanmoqda...\nUstoz ${course.teacherName} tomonidan taqdim etilgan 24 ta video-ma'ruza sizga bepul ochildi.`, 'success');
                                  api.rewardAndUpdate(setXp, null, setLevel, 'start_video_lessons');
                                }}
                                className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-black"
                              >
                                <Video className="w-4 h-4 inline" /> Darslarni boshlash (+20 XP)
                              </button>

                              <button
                                onClick={() => setActiveChatCourseId(isChatActive ? null : course.id)}
                                className={`flex-1 py-2.5 border rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                                  isChatActive
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100'
                                }`}
                              >
                                <MessageSquare className="w-4 h-4" />
                                {isChatActive ? "Chatni yopish" : "Guruh Chati"}
                              </button>
                            </div>

                            {/* COLLAPSED GROUP CHAT INTERFACE */}
                            {isChatActive && (
                              <div className="mt-4 border-t border-gray-100 dark:border-slate-700/50 pt-4 space-y-4" id={`chat_box_${course.id}`}>
                                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 max-h-56 overflow-y-auto" id={`chat_messages_wrapper_${course.id}`}>
                                  <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase block tracking-wider text-center border-b border-gray-100 dark:border-slate-700/50 pb-1 mb-2">
                                    <MessageSquare className="w-3 h-3 inline" /> {course.title} - O'QUVCHILAR CHATI
                                  </span>

                                  {(chatHistory[course.id] || [
                                    { author: 'Bunyodbek Nematov', text: 'Salom hamma guruhdoshlarga! Darslar qachon boshlanadi?', time: '10:15' },
                                    { author: 'Saidabror Abdusaidov', text: 'Ustoz dars bugun 20:00 da bo\'ladi dedilar.', time: '10:20' }
                                  ]).map((msg, mIdx) => (
                                    <div key={mIdx} className={`space-y-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                      <div className={`inline-block p-3 rounded-2xl text-xs max-w-[85%] ${
                                        msg.isMe
                                          ? 'bg-violet-600 text-white rounded-tr-none'
                                          : 'bg-white dark:bg-[#151433] text-gray-800 dark:text-slate-100 shadow-2xs border border-gray-50 dark:border-slate-700/30 rounded-tl-none'
                                      }`}>
                                        <span className="font-extrabold text-[10px] block opacity-80 mb-1">{msg.author}</span>
                                        <p className="leading-relaxed font-medium">{msg.text}</p>
                                        <span className="text-[9px] block text-right mt-1 opacity-60 font-mono">{msg.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Guruhga xabar yozing..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSendChatMessage(course.id);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600/50 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-violet-300"
                                  />
                                  <button
                                    onClick={() => handleSendChatMessage(course.id)}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-xs"
                                  >
                                    Yuborish
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CREATE COURSE (FOR TEACHERS) */}
              {courseTab === 'create' && (
                <div className="bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto" id="create_course_section">
                  <div className="border-b border-gray-50 dark:border-slate-700/30 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-2.5 bg-violet-100 text-violet-700 rounded-xl">
                        <GraduationCap className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white">Yangi Onlayn Kurs yaratish</h3>
                        <p className="text-xs text-gray-400 dark:text-slate-500">Kurs yaratganingizda u dars guruhlari bilan birga do'kon darsliklariga qo'shiladi.</p>
                      </div>
                    </div>
                  </div>

                  {courseSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-extrabold text-emerald-800 animate-fade-in">
                      {courseSuccessMsg}
                    </div>
                  )}

                  {/* Teacher Simulation Alert */}
                  {userRole !== 'teacher' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-extrabold text-amber-800">
                      <Info className="w-4 h-4 inline" /> Siz hozirda <span className="underline uppercase">Talaba</span> rolidasiz. Lekin sizga o'qituvchilar kurs sotishini sinab ko'rishingiz uchun ushbu formadan foydalanish imkoniyatini mutlaqo bepul beramiz!
                    </div>
                  )}

                  <form onSubmit={handlePublishCourse} className="space-y-4" id="create_course_form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Kurs nomi (Sarlavha)</label>
                        <input
                          type="text"
                          required
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          placeholder="Masalan: SAT Matematika Rocket"
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600/50 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-violet-300"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Yo'nalishi</label>
                        <CustomSelect
                          value={newCourseCategory}
                          onChange={setNewCourseCategory}
                          options={[
                            { value: 'Dasturlash', label: 'Dasturlash' },
                            { value: 'Ingliz tili', label: 'Ingliz tili (IELTS)' },
                            { value: 'SAT', label: 'SAT Prep' },
                            { value: 'Milliy Sertifikat', label: 'Milliy Sertifikat' },
                            { value: 'Matematika', label: 'Matematika' },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Price in Coins */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Sotish narxi (Tanga)</label>
                        <input
                          type="number"
                          required
                          value={newCoursePrice}
                          onChange={(e) => setNewCoursePrice(e.target.value)}
                          placeholder="60"
                          min="10"
                          max="500"
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600/50 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-violet-300"
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Dars davomiyligi</label>
                        <input
                          type="text"
                          required
                          value={newCourseDuration}
                          onChange={(e) => setNewCourseDuration(e.target.value)}
                          placeholder="3 oy (24 dars)"
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600/50 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-violet-300"
                        />
                      </div>

                      {/* Card Color Theme */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Vizual rang dizayni</label>
                        <CustomSelect
                          value={newCourseColor}
                          onChange={setNewCourseColor}
                          options={[
                            { value: 'indigo', label: 'Indigo (Binafsha)' },
                            { value: 'emerald', label: 'Emerald (Yashil)' },
                            { value: 'amber', label: 'Amber (Sariq)' },
                            { value: 'rose', label: 'Rose (Qizil)' },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-600 dark:text-slate-400 block uppercase">Kurs haqida qisqacha tavsif (Guruh shartlari)</label>
                      <textarea
                        required
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                        placeholder="Ushbu kurs kimlar uchun mo'ljallangan, darslar qachon va qanday tartibda o'tilishi, guruhga ulanish shartlarini batafsil yozing..."
                        rows={4}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600/50 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-violet-300 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 uppercase"
                      >
                        <Rocket className="w-4 h-4 inline" /> Kursni sotuvga chiqarish & Guruhni shakllantirish
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 3. ACTIVE MOCK TEST EXAM PANEL */}
      {examStarted && (
        <div className="space-y-6" id="active_exam_panel">
          
          {/* Header of active exam */}
          <div className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-3xl" id="exam_header">
            <div>
              <span className="text-[10px] font-mono tracking-widest bg-white dark:bg-[#151433]/10 px-2.5 py-1 rounded-full text-yellow-400 uppercase">
                {selectedHub} IMTIHONI KETMOQDA
              </span>
              <h3 className="text-lg font-black mt-1">
                {activeMockType === 'full' ? 'To\'liq Full Mock Imtihon' : `${activeMockType?.toUpperCase()} Section Mock`} {activeSubject && `(${activeSubject})`}
              </h3>
            </div>
            
            {/* Countdown clock */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#151433]/10 px-4 py-2 rounded-2xl text-xs font-bold font-mono" id="exam_timer">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{activeMockType === 'full' ? '60:00' : '20:00'}</span>
            </div>
          </div>

          {/* If the test is NOT yet finished */}
          {!examFinished ? (
            <div className="space-y-6" id="exam_questions_section">
              
              {/* Conditional rendering based on mock types */}
              
              {/* WRITING TASK */}
              {activeMockType === 'writing' ? (
                <div className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4" id="writing_task_interface">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <span className="text-[10px] text-purple-700 font-bold font-mono block">WRITING TASK 2 PROMPT:</span>
                    <h4 className="text-xs font-bold text-purple-950 mt-1">
                      "Some people believe that university education should be free for all students, while others argue that students should pay for their own higher education. Discuss both views and give your opinion."
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-slate-400">Sizning inshoingiz (Essay - Kamida 250 ta so'z bo'lishi tavsiya etiladi):</label>
                    <textarea 
                      id="essay_exam_textarea"
                      value={essayAnswer}
                      onChange={(e) => setEssayAnswer(e.target.value)}
                      placeholder="Inshoingizni ingliz tilida yozing..."
                      className="w-full h-80 p-4 border rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              ) : 
              
              /* SPEAKING TASK */
              activeMockType === 'speaking' ? (
                <div className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4" id="speaking_task_interface">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <span className="text-[10px] text-rose-700 font-bold font-mono block">SPEAKING CARD CUE TOPIC:</span>
                    <h4 className="text-xs font-bold text-rose-950 mt-1">
                      "Describe a skill that you learned in your childhood. You should say: what it is, who taught you, how you learned it, and explain how you felt after learning this skill."
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-slate-400">Nutq matningiz (Speech-to-Text simulyatsiyasi uchun matn shaklida yozing):</label>
                    <textarea 
                      id="speaking_exam_textarea"
                      value={speakingAnswer}
                      onChange={(e) => setSpeakingAnswer(e.target.value)}
                      placeholder="Masalan: One of the skills that I learned when I was a child is riding a bicycle. My father taught me this..."
                      className="w-full h-48 p-4 border rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              ) : 
              
              /* STANDARD MCQ QUESTIONS (Reading, Listening, Math, Verbal, Milliy, etc.) */
              (
                <div className="space-y-6" id="standard_mcq_list">
                  {activeQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4" id={`mcq_item_${qIdx}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-slate-100 leading-relaxed">{q.q}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id={`mcq_options_${qIdx}`}>
                        {q.options.map((option, optIdx) => {
                          const isSelected = answers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              id={`mcq_btn_${qIdx}_${optIdx}`}
                              onClick={() => {
                                setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                              }}
                              className={`p-3.5 border rounded-2xl text-xs font-semibold text-left transition ${
                                isSelected ? 'bg-black text-white border-black' : 'bg-gray-50/50 dark:bg-slate-800/25 hover:bg-gray-100 dark:bg-slate-800/30 dark:hover:bg-slate-700/30 border-gray-100 dark:border-slate-700/50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submission section */}
              <div className="flex justify-between items-center" id="exam_submission_footer">
                <button
                  id="cancel_exam_progress_btn"
                  onClick={() => {
                    if (confirm("Haqiqatan ham imtihonni yakunlamasdan chiqib ketmoqchimisiz? XP berilmaydi.")) {
                      setExamStarted(false);
                    }
                  }}
                  className="text-xs font-bold text-gray-400 dark:text-slate-500 hover:text-red-500 transition"
                >
                  Imtihonni bekor qilish
                </button>
                <button
                  id="submit_exam_progress_btn"
                  onClick={handleFinishExam}
                  className="px-8 py-3.5 bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-extrabold text-xs rounded-2xl shadow-sm transition"
                >
                  Imtihonni topshirish ✓
                </button>
              </div>

            </div>
          ) : (
            
            /* 4. RESULTS / CERTIFICATE CARD PREPARATION */
            <div className="space-y-6" id="exam_results_section">
              
              {/* Congratulations Header */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 rounded-3xl text-center space-y-4 shadow-md relative overflow-hidden" id="results_certificate_card">
                <div className="bg-white dark:bg-[#151433]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-yellow-300">
                  <Award className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest bg-black/10 px-3 py-1 rounded-full uppercase">IMTIHON NATIJASI</span>
                  <h3 className="text-2xl font-black">Muvaffaqiyatli topshirildi!</h3>
                  <p className="text-xs text-emerald-100 max-w-md mx-auto">
                    Tabriklaymiz! Siz ushbu imtihonni to'liq yakunladingiz. Tizim sizning bilimingizni qayd etdi va mukofotlarni taqdim etdi.
                  </p>
                </div>

                {/* Score and XP rewards display */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-black/10 p-4 rounded-2xl border border-white/10" id="rewards_box">
                  <div className="text-center border-r border-white/10">
                    <span className="text-[10px] text-emerald-200 block font-bold uppercase">MUKOFOT XP</span>
                    <span className="text-xl font-mono font-black text-yellow-300">+{activeMockType === 'full' ? 2000 : 500} XP</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-emerald-200 block font-bold uppercase">MUKOFOT TANGALAR</span>
                    <span className="text-xl font-mono font-black text-yellow-300">+{activeMockType === 'full' ? 100 : 25} <DollarSign className="w-4 h-4 inline" /></span>
                  </div>
                </div>

                {/* Certificate design lines */}
                <div className="absolute left-4 top-4 border-l-2 border-t-2 border-white/20 w-8 h-8" />
                <div className="absolute right-4 bottom-4 border-r-2 border-b-2 border-white/20 w-8 h-8" />
              </div>

              {/* AI evaluation if Writing/Speaking */}
              {(activeMockType === 'writing' || activeMockType === 'speaking') && (
                <div className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-xs space-y-4" id="ai_assessment_panel">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-[#7c3aed]" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Sun'iy Intellekt (Gemini) IELTS Tahlili</h4>
                    </div>
                    
                    <button
                      id="ai_evaluation_trigger_btn"
                      onClick={handleAiEvaluation}
                      disabled={isAiLoading}
                      className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition"
                    >
                      {isAiLoading ? 'Yuklanmoqda...' : 'Gemini AI tahlilini olish'}
                    </button>
                  </div>

                  {aiFeedback ? (
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-purple-950 leading-relaxed font-medium whitespace-pre-line">
                      {aiFeedback}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-slate-500">Nutq yoki inshoingiz xalqaro IELTS murabbiysi darajasidagi Gemini AI orqali tekshirishga tayyor. Tahlilni bosing!</p>
                  )}
                </div>
              )}

              {/* Detailed review checklist for MCQ */}
              {activeMockType !== 'writing' && activeMockType !== 'speaking' && (
                <div className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-xs space-y-4" id="detailed_review_panel">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Savollar Tahlili va Xatolar Ustida Ishlash:</h4>
                  <div className="space-y-4" id="review_questions_list">
                    {activeQuestions.map((q, idx) => {
                      const userAns = answers[idx];
                      const isCorrect = userAns === q.correct;

                      return (
                        <div key={idx} className="p-4 border rounded-2xl bg-gray-50/50 dark:bg-slate-800/25 space-y-3" id={`review_item_${idx}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2.5">
                              <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center font-mono mt-0.5 ${
                                isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}>
                                {idx + 1}
                              </span>
                              <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{q.q}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                              isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {isCorrect ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-500 dark:text-slate-400 space-y-1 font-medium pl-7">
                            <p>Sizning javobingiz: <span className="text-black font-semibold">{userAns !== undefined ? q.options[userAns] : 'Belgilanmagan'}</span></p>
                            <p>To'g'ri javob: <span className="text-emerald-600 font-semibold">{q.options[q.correct]}</span></p>
                            
                            <div className="mt-2 p-2.5 bg-white dark:bg-[#151433] rounded-xl border border-gray-100 dark:border-slate-700/50 text-gray-600 dark:text-slate-400 font-sans italic">
                              <span className="font-bold text-gray-700 dark:text-slate-300 font-sans not-italic block mb-0.5">Yechilish izohi:</span>
                              {q.explanation}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Close results button */}
              <button
                id="close_results_btn"
                onClick={() => {
                  setExamStarted(false);
                  setShowPandoo(false);
                }}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold text-xs py-3 rounded-2xl transition"
              >
                Imtihonlarni yakunlash va Hub-ga qaytish
              </button>

            </div>
          )}

        </div>
      )}

      {showPandoo && (
        <Pandoo
          isOpen={showPandoo}
          onClose={() => setShowPandoo(false)}
          testTitle="Akademik Mock Imtihon"
          wrongQuestions={wrongMcqAnswers}
          correctCount={finalScore}
          totalQuestions={activeQuestions.length}
          setXp={setXp}
          setCoins={setCoins}
          setLevel={setLevel}
        />
      )}
    </div>
  );
}
