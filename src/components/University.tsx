import React, { useState } from 'react';
import {
  Globe,
  Award,
  Search,
  Filter,
  GraduationCap,
  Calculator,
  Bookmark,
  CheckSquare,
  FileCheck,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Info,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Languages
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import { University } from '../types';
import { useToast } from '../toast';

interface EnrichedUniversity extends University {
  worldRank: number;
  enrollment: string;
  employmentRate: number;
  campusType: string;
  recommendedPortfolio: string[];
  essayPrompt: string;
  languageRequirementText: string;
}

const enrichedUniversities: EnrichedUniversity[] = [
  {
    id: 'u1',
    name: 'Harvard University',
    country: 'AQSH',
    city: 'Cambridge, MA',
    major: ['Kompyuter Ilmlari', 'Iqtisodiyot', 'Tibbiyot', 'Siyosatshunoslik'],
    ieltsMin: 7.5,
    satMin: 1540,
    gpaMin: 4.0,
    tuition: 58000,
    acceptanceRate: 4,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
    worldRank: 1,
    enrollment: '21,000+ talaba',
    employmentRate: 98,
    campusType: 'Tarixiy, Shovqinli shahar (Urban)',
    recommendedPortfolio: [
      'Xalqaro darajadagi olimpiada g\'olibligi (IMO, IPhO, etc.)',
      'Kamida 2 ta yirik ijtimoiy / startap loyihasini muvaffaqiyatli boshqargan bo\'lish',
      'Nufuzli ilmiy jurnallarda chop etilgan maqola'
    ],
    essayPrompt: 'Common App Personal Essay + "O\'zingizning intellektual sayohatingiz va uning shakllanishiga ta\'sir qilgan muhim voqea haqida yozing."',
    languageRequirementText: 'IELTS 7.5+ yoki TOEFL 100+'
  },
  {
    id: 'u2',
    name: 'Seoul National University',
    country: 'Janubiy Koreya',
    city: 'Seoul',
    major: ['Injiniring', 'Biznes boshqaruvi', 'Koreys tili', 'Axborot Texnologiyalari'],
    ieltsMin: 6.5,
    satMin: 1420,
    gpaMin: 3.7,
    tuition: 8000,
    acceptanceRate: 12,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    worldRank: 29,
    enrollment: '28,000+ talaba',
    employmentRate: 94,
    campusType: 'Tog\'li, Tabiat qo\'ynida (Gwanak Campus)',
    recommendedPortfolio: [
      'TOPIK Level 4+ yoki unga tenglashtirilgan ingliz tili sertifikati',
      'Maktab / kollej bitiruv loyihasidagi yuqori natijalar',
      'Koreya madaniyati va texnologiyalariga oid yutuqlar'
    ],
    essayPrompt: 'Nega SNU va tanlangan yo\'nalishni tanladingiz? Kelajakdagi akademik rejalaringiz qanday?',
    languageRequirementText: 'IELTS 6.5+ yoki TOPIK Level 4+'
  },
  {
    id: 'u3',
    name: 'Tashkent State University of Economics',
    country: 'O\'zbekiston',
    city: 'Toshkent',
    major: ['Moliya', 'Iqtisodiyot', 'Marketing', 'Logistika'],
    ieltsMin: 5.5,
    satMin: 1100,
    gpaMin: 3.0,
    tuition: 1500,
    acceptanceRate: 35,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600',
    worldRank: 1001,
    enrollment: '15,000+ talaba',
    employmentRate: 85,
    campusType: 'Zamonaviy shahar kampusi',
    recommendedPortfolio: [
      'Iqtisodiy tahlil / biznes reja tanlovlarida ishtirok etganlik',
      'IELTS va matematika chuqurlashtirilgan sertifikatlari',
      'Jamoat faoliyati va tashkilotchilik tajribasi'
    ],
    essayPrompt: 'Ushbu soha orqali O\'zbekiston iqtisodiyotiga qanday hissa qo\'shmoqchisiz?',
    languageRequirementText: 'IELTS 5.5+ yoki Milliy Sertifikat B2'
  },
  {
    id: 'u4',
    name: 'University of Oxford',
    country: 'Buyuk Britaniya',
    city: 'Oxford',
    major: ['Falsafa', 'Matematika', 'Tarix', 'Adabiyot'],
    ieltsMin: 7.5,
    satMin: 1500,
    gpaMin: 3.9,
    tuition: 45000,
    acceptanceRate: 14,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
    worldRank: 3,
    enrollment: '24,000+ talaba',
    employmentRate: 97,
    campusType: 'Kollejli tizim, Tarixiy arxitektura',
    recommendedPortfolio: [
      'Tanlangan fandan chuqur akademik bilim (A-Level / IB mukammal natija)',
      'Oxford kirish imtihonlari (MAT, PAT, HAT, TSA) yuqori ballari',
      'Akademik intervyudagi yuqori mantiqiy fikrlash'
    ],
    essayPrompt: 'Personal Statement (UCAS) - 4000 ta belgidan oshmaydigan shaxsiy va akademik qiziqishlaringiz.',
    languageRequirementText: 'IELTS 7.5+ (barcha qismlar 7.0 dan kam bo\'lmasligi shart)'
  },
  {
    id: 'u5',
    name: 'Stanford University',
    country: 'AQSH',
    city: 'Stanford, CA',
    major: ['Kompyuter Muhandisligi', 'Tadbirkorlik', 'Sun\'iy Intellekt', 'Biologiya'],
    ieltsMin: 7.5,
    satMin: 1520,
    gpaMin: 3.95,
    tuition: 61000,
    acceptanceRate: 4,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?auto=format&fit=crop&q=80&w=600',
    worldRank: 2,
    enrollment: '17,000+ talaba',
    employmentRate: 99,
    campusType: 'Keng, Kaliforniya quyoshi ostida (Suburban)',
    recommendedPortfolio: [
      'Yirik dasturiy mahsulot yaratganlik va uning foydalanuvchilari mavjudligi',
      'Startap ekotizimida faol ishtirok / patent yoki ilmiy kashfiyot',
      'Silikon vodiysidagi kompaniyalarda amaliyot yoki hamkorlik'
    ],
    essayPrompt: 'Stanford Roommate Essay: Kelajakdagi xonadoshingizga siz haqingizda nimalarni bilishi kerakligini tushuntirib xat yozing.',
    languageRequirementText: 'IELTS 7.5+ yoki TOEFL 100+'
  },
  {
    id: 'u6',
    name: 'Technical University of Munich',
    country: 'Germaniya',
    city: 'Munich',
    major: ['Injiniring', 'Sun\'iy Intellekt', 'Fizika', 'Matematika'],
    ieltsMin: 6.5,
    satMin: 1300,
    gpaMin: 3.5,
    tuition: 3000,
    acceptanceRate: 18,
    scholarshipAvailable: true,
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=600',
    worldRank: 37,
    enrollment: '50,000+ talaba',
    employmentRate: 95,
    campusType: 'Zamonaviy texnologik kampus',
    recommendedPortfolio: [
      'Texnik loyihalar va muhandislik sohasidagi amaliy tajriba',
      'Nemis tili (B2+) yoki ingliz tili (IELTS 6.5+) sertifikati',
      'Kuchli matematika va fizika akademik ko\'rsatkichlari'
    ],
    essayPrompt: 'Motivatsiya xati: Nima uchun Germaniya va nima uchun ushbu texnik sohani tanladingiz?',
    languageRequirementText: 'IELTS 6.5+ yoki Nemis tili TestDaF 4'
  }
];

interface CustomScholarship {
  id: string;
  title: string;
  universityName: string;
  country: string;
  amount: string;
  deadline: string;
  themeColor: 'emerald' | 'indigo' | 'sky' | 'amber';
  requirements: string[];
}

const newlyAnnouncedScholarships: CustomScholarship[] = [
  {
    id: 'new_s1',
    title: 'GKS (Global Korea Scholarship) - 2027 Kuzgi Qabul',
    universityName: 'Seoul National University, KAIST & Top Koreya Oliyohgohlari',
    country: 'Janubiy Koreya',
    amount: '100% Kontrakt + Oylik $900 stipendiya + Aviachipta',
    deadline: '2026-10-15',
    themeColor: 'emerald',
    requirements: [
      'GPA kamida 80% yoki 3.2+ (4.0 shkalasida)',
      'Ingliz tili (IELTS 6.5+ yoki TOEFL 80+) yoki TOPIK Level 3+',
      'Bakalavr darajasiga ega bo\'lmagan, 25 yoshdan oshmagan bo\'lish'
    ]
  },
  {
    id: 'new_s2',
    title: 'DAAD Scholarship - Germaniyaning eng nufuzli davlat granti',
    universityName: 'Technical University of Munich, Heidelberg University & top 50',
    country: 'Germaniya',
    amount: 'To\'liq bepul o\'qish + Oylik €934 yordam puli + Sug\'urta',
    deadline: '2026-11-30',
    themeColor: 'indigo',
    requirements: [
      'Kamida 2 yillik professional ish stajiga ega bo\'lish (Ma\'lum sohalarda)',
      'Akademik daraja va o\'qish yo\'nalishi mosligi',
      'Ingliz yoki Nemis tilini mukammal bilish (IELTS 6.5+ yoki TestDaF 4)'
    ]
  },
  {
    id: 'new_s3',
    title: 'Chevening Scholarship - Buyuk Britaniya Hukumat Granti',
    universityName: 'Oxford, Cambridge, Imperial College London & barcha UK OTMlari',
    country: 'Buyuk Britaniya',
    amount: 'To\'liq o\'qish xarajati + Oylik yashash nafaqasi + Bepul viza',
    deadline: '2026-11-05',
    themeColor: 'sky',
    requirements: [
      'Bakalavr diplomi va kamida 2 yillik (2800 soat) ish staji',
      'O\'qish tamom bo\'lgandan keyin kamida 2 yil O\'zbekistonga qaytib kelish majburiyati',
      'Top-3 UK universitetlaridan shartsiz taklifnoma (unconditional offer) olish'
    ]
  },
  {
    id: 'new_s4',
    title: 'Stipendium Hungaricum Scholarship - Vengriya Davlat Granti',
    universityName: 'Eötvös Loránd University, Budapest University of Technology',
    country: 'Vengriya',
    amount: 'Bepul o\'qish + Oylik stipendiya + Bepul yotoqxona',
    deadline: '2027-01-15',
    themeColor: 'amber',
    requirements: [
      'O\'zbekiston Respublikasi fuqarosi bo\'lish (Hukumatlararo kvota doirasida)',
      'IELTS 6.0+ yoki unga mos sertifikat',
      'Tavsiyanomalar, motivatsiya xati va maktab transkripti'
    ]
  }
];

export default function UniversityFinder() {
  // Scholarship Section State
  const [expandedSchId, setExpandedSchId] = useState<string | null>(null);

  // University Search State
  const [majorFilter, setMajorFilter] = useState('Barchasi');
  const [countryFilter, setCountryFilter] = useState('Barchasi');
  const [languageFilter, setLanguageFilter] = useState('Barchasi');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<EnrichedUniversity[]>([]);
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform filtering based on filters
    const results = enrichedUniversities.filter((uni) => {
      // Major check
      const matchesMajor = !majorFilter || majorFilter === 'Barchasi' || 
        uni.major.some(m => m.toLowerCase().includes(majorFilter.toLowerCase()));

      // Country check
      const matchesCountry = !countryFilter || countryFilter === 'Barchasi' || 
        uni.country.toLowerCase() === countryFilter.toLowerCase();

      // Language check (IELTS value mapping)
      let matchesLanguage = true;
      if (languageFilter && languageFilter !== 'Barchasi') {
        if (languageFilter === 'IELTS 7.5+') {
          matchesLanguage = uni.ieltsMin >= 7.5;
        } else if (languageFilter === 'IELTS 6.5+') {
          matchesLanguage = uni.ieltsMin >= 6.5;
        } else if (languageFilter === 'IELTS 5.5+') {
          matchesLanguage = uni.ieltsMin >= 5.5;
        }
      }

      return matchesMajor && matchesCountry && matchesLanguage;
    });

    setSearchResults(results);
    setHasSearched(true);
    if (results.length > 0) {
      setSelectedUniId(results[0].id);
    } else {
      setSelectedUniId(null);
    }
  };

  const selectedUni = enrichedUniversities.find(u => u.id === selectedUniId) || null;

  // Collect all unique majors for search dropdown
  const allMajors = Array.from(new Set(enrichedUniversities.flatMap(u => u.major)));
  // Collect all unique countries for search dropdown
  const allCountries = Array.from(new Set(enrichedUniversities.map(u => u.country)));

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-12 flex-1 overflow-y-auto max-w-7xl mx-auto" id="university_container">
      
      {/* Header */}
      <div id="university_header" className="text-center md:text-left space-y-2 max-w-3xl pb-4 border-b border-gray-100">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">
          Universitetlar & Xalqaro Grantlar
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed font-sans">
          Nufuzli xalqaro oliygohlar va eng so'nggi e'lon qilingan to'liq moliyalashtiriluvchi grantlar.
        </p>
      </div>

      {/* ---------------- SECTION 1: NEWLY ANNOUNCED SCHOLARSHIPS ---------------- */}
      <div className="space-y-6" id="newly_announced_scholarships_section">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 text-[#7c3aed] rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight font-sans">Yangi e'lon qilingan xalqaro grantlar</h3>
            <p className="text-xs text-gray-400 font-sans">Dunyoning eng nufuzli to'liq qoplanadigan stipendiya va grant dasturlari.</p>
          </div>
        </div>

        {/* List of Scholarships as requested: collapsed by default, ONLY shows 'Grant nomi - [title]' & 'Batafsil ko'rish' */}
        <div className="space-y-3.5" id="scholarship_strips_container">
          {newlyAnnouncedScholarships.map((sch) => {
            const isExpanded = expandedSchId === sch.id;
            
            // Define saturated, borderless, 3D color themes matching the user's provided screenshot
            let cardTheme = {
              bg: 'bg-[#7c3aed]', // Saturated purple-indigo (default)
              shadow: 'shadow-[0_6px_0_0_#5b21b6]',
              hoverShadow: 'hover:shadow-[0_10px_0_0_#5b21b6]',
              activeShadow: 'active:shadow-[0_2px_0_0_#5b21b6]',
              text: 'text-white',
              subtext: 'text-purple-100',
              iconContainer: 'bg-white/20 text-white',
              icon: <Award className="w-5 h-5 text-white" />,
              divider: 'border-white/20',
              detailBg: 'bg-white/10 border border-white/10',
              button: 'bg-white text-purple-950 hover:bg-purple-50 shadow-[0_3px_0_0_#ddd6fe] active:shadow-[0_1px_0_0_#ddd6fe]',
              toggleBtn: 'bg-white/20 hover:bg-white/30 text-white border-0',
              bulletIcon: 'text-purple-200'
            };

            if (sch.themeColor === 'emerald') {
              cardTheme = {
                bg: 'bg-[#10b981]', // Saturated vibrant emerald green
                shadow: 'shadow-[0_6px_0_0_#047857]',
                hoverShadow: 'hover:shadow-[0_10px_0_0_#047857]',
                activeShadow: 'active:shadow-[0_2px_0_0_#047857]',
                text: 'text-white',
                subtext: 'text-emerald-100',
                iconContainer: 'bg-white/20 text-white',
                icon: <Award className="w-5 h-5 text-white" />,
                divider: 'border-white/20',
                detailBg: 'bg-white/10 border border-white/10',
                button: 'bg-white text-emerald-950 hover:bg-emerald-50 shadow-[0_3px_0_0_#a7f3d0] active:shadow-[0_1px_0_0_#a7f3d0]',
                toggleBtn: 'bg-white/20 hover:bg-white/30 text-white border-0',
                bulletIcon: 'text-emerald-200'
              };
            } else if (sch.themeColor === 'indigo') {
              cardTheme = {
                bg: 'bg-[#7c3aed]', // Beautiful deep purple-indigo like the top item in screenshot
                shadow: 'shadow-[0_6px_0_0_#5b21b6]',
                hoverShadow: 'hover:shadow-[0_10px_0_0_#5b21b6]',
                activeShadow: 'active:shadow-[0_2px_0_0_#5b21b6]',
                text: 'text-white',
                subtext: 'text-purple-100',
                iconContainer: 'bg-white/20 text-white',
                icon: <GraduationCap className="w-5 h-5 text-white" />,
                divider: 'border-white/20',
                detailBg: 'bg-white/10 border border-white/10',
                button: 'bg-white text-purple-950 hover:bg-purple-50 shadow-[0_3px_0_0_#ddd6fe] active:shadow-[0_1px_0_0_#ddd6fe]',
                toggleBtn: 'bg-white/20 hover:bg-white/30 text-white border-0',
                bulletIcon: 'text-purple-200'
              };
            } else if (sch.themeColor === 'sky') {
              cardTheme = {
                bg: 'bg-[#0091ff]', // Saturated bright sky blue like the third item in screenshot
                shadow: 'shadow-[0_6px_0_0_#0060df]',
                hoverShadow: 'hover:shadow-[0_10px_0_0_#0060df]',
                activeShadow: 'active:shadow-[0_2px_0_0_#0060df]',
                text: 'text-white',
                subtext: 'text-blue-100',
                iconContainer: 'bg-white/20 text-white',
                icon: <Sparkles className="w-5 h-5 text-white" />,
                divider: 'border-white/20',
                detailBg: 'bg-white/10 border border-white/10',
                button: 'bg-white text-blue-950 hover:bg-blue-50 shadow-[0_3px_0_0_#bfdbfe] active:shadow-[0_1px_0_0_#bfdbfe]',
                toggleBtn: 'bg-white/20 hover:bg-white/30 text-white border-0',
                bulletIcon: 'text-blue-200'
              };
            } else if (sch.themeColor === 'amber') {
              cardTheme = {
                bg: 'bg-[#f59e0b]', // Saturated amber orange like the fourth item in screenshot
                shadow: 'shadow-[0_6px_0_0_#d97706]',
                hoverShadow: 'hover:shadow-[0_10px_0_0_#d97706]',
                activeShadow: 'active:shadow-[0_2px_0_0_#d97706]',
                text: 'text-white',
                subtext: 'text-amber-50',
                iconContainer: 'bg-white/20 text-white',
                icon: <Calendar className="w-5 h-5 text-white" />,
                divider: 'border-white/20',
                detailBg: 'bg-white/10 border border-white/10',
                button: 'bg-white text-amber-950 hover:bg-amber-50 shadow-[0_3px_0_0_#fde68a] active:shadow-[0_1px_0_0_#fde68a]',
                toggleBtn: 'bg-white/20 hover:bg-white/30 text-white border-0',
                bulletIcon: 'text-amber-200'
              };
            }

            return (
              <div
                key={sch.id}
                id={`sch_strip_${sch.id}`}
                className={`w-full rounded-2xl overflow-hidden border-0 transition-all duration-200 ${cardTheme.bg} ${cardTheme.shadow} ${cardTheme.hoverShadow} hover:-translate-y-1 active:translate-y-0.5 ${cardTheme.activeShadow}`}
              >
                {/* Collapsed State: Shows Title and Batafsil button */}
                <div 
                  onClick={() => setExpandedSchId(isExpanded ? null : sch.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${cardTheme.iconContainer}`}>
                      {cardTheme.icon}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white font-sans leading-tight tracking-tight">
                        Grant nomi - {sch.title}
                      </h4>
                      <p className={`text-[11px] mt-0.5 font-medium ${cardTheme.subtext}`}>
                        Xalqaro stipendiya dasturi • {sch.country}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`toggle_btn_${sch.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedSchId(isExpanded ? null : sch.id);
                    }}
                    className={`text-xs font-extrabold flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl transition-all self-end sm:self-auto border-0 cursor-pointer ${cardTheme.toggleBtn}`}
                  >
                    {isExpanded ? "Yopish" : "Batafsil ko'rish"}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Expanded State: Reveals details seamlessly with transparent design */}
                {isExpanded && (
                  <div className={`px-6 sm:px-8 pb-6 pt-5 border-t ${cardTheme.divider} space-y-6 text-xs text-white animate-fade-in`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${cardTheme.iconContainer}`}>
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white/70 font-bold tracking-wide uppercase text-[10px] block">Oliygoh / Universitet:</span>
                            <span className="text-xs font-black text-white font-sans leading-snug">{sch.universityName}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${cardTheme.iconContainer}`}>
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white/70 font-bold tracking-wide uppercase text-[10px] block">Davlat:</span>
                            <span className="text-xs font-black text-white font-sans">{sch.country}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${cardTheme.iconContainer}`}>
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white/70 font-bold tracking-wide uppercase text-[10px] block">Grant miqdori va nafaqa:</span>
                            <span className="text-xs font-black font-sans text-white">{sch.amount}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${cardTheme.iconContainer}`}>
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white/70 font-bold tracking-wide uppercase text-[10px] block">Hujjat topshirish muddati:</span>
                            <span className="text-xs font-black text-white font-mono">{sch.deadline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/15 shadow-3xs space-y-3">
                        <h5 className="font-extrabold text-white flex items-center gap-2 text-xs font-sans">
                          <CheckCircle2 className="w-4 h-4 text-white" /> Nomzodga qo'yiladigan talablar:
                        </h5>
                        <ul className="space-y-2 list-none text-white/90 leading-relaxed font-sans text-xs">
                          {sch.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className={`text-xs mt-0.5 ${cardTheme.bulletIcon}`}>•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={`flex justify-end pt-4 border-t ${cardTheme.divider}`}>
                      <button
                        id={`apply_btn_${sch.id}`}
                        onClick={() => toast("Ariza muvaffaqiyatli jo'natildi!", 'success')}
                        className={`text-xs font-black px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer ${cardTheme.button}`}
                      >
                        Hozir topshirish <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- SECTION 2: SEARCH UNIVERSITY WITH FILTERS ---------------- */}
      <div className="space-y-6 pt-6 border-t border-gray-100" id="search_university_section">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight font-sans">
                Oliygohlarni qidirish (Search University)
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Yo'nalish, qaysi davlat va til talablarini tanlab kerakli oliygohni tezda toping.
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal filter search input controls */}
        <form onSubmit={handleSearch} className="bg-white border border-gray-150 p-5 rounded-2xl shadow-3xs space-y-4" id="search_filter_form">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Yo'nalish filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 font-sans">
                <GraduationCap className="w-4 h-4 text-gray-400" /> Yo'nalish (Major):
              </label>
              <CustomSelect value={majorFilter} onChange={setMajorFilter} options={[{ value: 'Barchasi', label: 'Barcha Yo\'nalishlar' }, ...allMajors.map(m => ({ value: m, label: m }))]} />
            </div>

            {/* 2. Davlat filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 font-sans">
                <Globe className="w-4 h-4 text-gray-400" /> Qaysi davlat (Country):
              </label>
              <CustomSelect value={countryFilter} onChange={setCountryFilter} options={[{ value: 'Barchasi', label: 'Barcha Davlatlar' }, ...allCountries.map(c => ({ value: c, label: c }))]} />
            </div>

            {/* 3. Til / Til talabi filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 font-sans">
                <Languages className="w-4 h-4 text-gray-400" /> Til talabi (Language Requirement):
              </label>
              <CustomSelect value={languageFilter} onChange={setLanguageFilter} options={[
                { value: 'Barchasi', label: 'Barcha darajalar' },
                { value: 'IELTS 5.5+', label: 'IELTS 5.5 yoki undan yuqori' },
                { value: 'IELTS 6.5+', label: 'IELTS 6.5 yoki undan yuqori' },
                { value: 'IELTS 7.5+', label: 'IELTS 7.5 yoki undan yuqori' },
              ]} />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              id="search_univer_submit_btn"
              type="submit"
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" /> Oliygohlarni Qidirish
            </button>
          </div>
        </form>

        {/* Conditionally show results only after user has searched */}
        {!hasSearched ? null : (
          /* Search Results Grid - visible ONLY after search is pressed */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="search_results_container">
            
            {/* Left Column: Found universities list */}
            <div className="lg:col-span-5 space-y-3" id="results_list_panel">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-sans">
                Topilgan oliygohlar ({searchResults.length})
              </h4>

              {searchResults.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500 font-sans">
                  Kiritilgan ko'rsatkichlarga mos oliygohlar topilmadi. Boshqa filtrlarni sinab ko'ring.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1" id="university_vertical_scroller">
                  {searchResults.map((uni) => {
                    const isSelected = selectedUniId === uni.id;
                    return (
                      <div
                        key={uni.id}
                        id={`uni_select_card_${uni.id}`}
                        onClick={() => setSelectedUniId(uni.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-gray-950 text-white border-gray-950 shadow-md'
                            : 'bg-white text-gray-900 border-gray-150 hover:border-gray-200 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={uni.image}
                            alt={uni.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-bold truncate leading-tight">{uni.name}</h5>
                            <span className={`text-[10px] block mt-0.5 font-medium ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                              {uni.city}, {uni.country}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'text-green-300 font-semibold' : 'text-green-600 bg-green-50 font-semibold'}`}>
                            {uni.acceptanceRate}% qabul
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Active University details card */}
            <div className="lg:col-span-7" id="details_bento_panel">
              {selectedUni ? (
                <div className="bg-white rounded-2xl border border-gray-150 shadow-2xs overflow-hidden" id="active_uni_details_card">
                  
                  {/* Hero banner */}
                  <div className="relative h-44 w-full">
                    <img
                      src={selectedUni.image}
                      alt={selectedUni.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                      <span className="text-[10px] uppercase font-bold text-violet-300 tracking-wider">
                        {selectedUni.country} • {selectedUni.city}
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold tracking-tight font-sans">
                        {selectedUni.name}
                      </h3>
                    </div>
                  </div>

                  {/* University Details Content */}
                  <div className="p-6 space-y-6">
                    
                    {/* Key Facts */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">
                        Universitet Haqida Faktlar (Key Facts)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        
                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Dunyo Reytingi</span>
                          <span className="text-xs font-extrabold text-gray-900 font-mono mt-0.5 block">
                            #{selectedUni.worldRank} QS World
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Qabul Darajasi</span>
                          <span className="text-xs font-extrabold text-red-600 font-mono mt-0.5 block">
                            {selectedUni.acceptanceRate}%
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Yillik Kontrakt</span>
                          <span className="text-xs font-extrabold text-gray-900 font-mono mt-0.5 block">
                            ${selectedUni.tuition.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Kampus Turi</span>
                          <span className="text-[11px] font-semibold text-gray-800 mt-0.5 block truncate">
                            {selectedUni.campusType.split(',')[0]}
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Talabalar Soni</span>
                          <span className="text-[11px] font-semibold text-gray-800 mt-0.5 block truncate">
                            {selectedUni.enrollment}
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Ishga Kirish Darajasi</span>
                          <span className="text-xs font-extrabold text-green-600 font-mono mt-0.5 block">
                            {selectedUni.employmentRate}%
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Academic Requirements */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">
                        Kirish va Qabul Talablari (Requirements)
                      </h4>
                      
                      <div className="p-4 border border-gray-100 rounded-xl bg-violet-50/30 grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 block font-medium">Min. GPA</span>
                          <span className="text-xs md:text-sm font-extrabold text-violet-950 font-mono">{selectedUni.gpaMin} / 4.0</span>
                        </div>
                        <div className="space-y-0.5 border-x border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-medium">Til Talabi</span>
                          <span className="text-xs md:text-sm font-extrabold text-violet-950 font-mono">{selectedUni.languageRequirementText}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 block font-medium">Min. SAT</span>
                          <span className="text-xs md:text-sm font-extrabold text-violet-950 font-mono">{selectedUni.satMin}+</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 bg-gray-50/50 p-4 rounded-xl border border-gray-100/70 text-xs">
                        <div>
                          <span className="font-bold text-gray-900 block mb-1 font-sans">Majburiy Insho (Essay prompt):</span>
                          <p className="text-gray-600 leading-relaxed italic text-[11px] font-sans">
                            "{selectedUni.essayPrompt}"
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <span className="font-bold text-gray-900 block mb-1.5 font-sans">Tavsiya etiladigan Portfolio:</span>
                          <ul className="space-y-1 text-gray-600 leading-relaxed pl-4 list-disc text-[11px]">
                            {selectedUni.recommendedPortfolio.map((port, idx) => (
                              <li key={idx}>{port}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Majors / Yo'nalishlar */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-sans">
                        O'qitiladigan Top Yo'nalishlar (Top Majors)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedUni.major.map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded-xl shadow-3xs"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                  Ma'lumotlarni ko'rish uchun chap tomondagi ro'yxatdan universitetni tanlang.
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
