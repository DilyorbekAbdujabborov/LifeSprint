import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight, Check, Compass, Calendar, Clock, RotateCw, Shield } from 'lucide-react';

interface RecommendedUni {
  name: string;
  country: string;
  match: number;
  fee: number;
  details: string;
  scholarship: string;
  whyMatch: string;
}

interface RoadmapPhase {
  title: string;
  duration: string;
  description: string;
  tasks: { text: string; done: boolean }[];
}

const STATIC_UNIVERSITIES = [
  {
    name: 'Stanford University',
    country: 'AQSH',
    minIelts: 7.5,
    minSat: 1500,
    minGpa: 3.85,
    fee: 57000,
    details: 'Stanford dunyoning eng nufuzli tadqiqot maskanlaridan biri bo\'lib, Silikon vodiysining tamal toshi hisoblanadi. Moliyaviy yordam ehtiyojga qarab to\'liq qoplanishi mumkin.',
    scholarship: 'Stanford Horizon Funding & Need-Blind Aid (100% gacha)',
    whyMatch: 'Sizning ajoyib akademik va test ko\'rsatkichlaringiz Stanford kabi eng yuqori darajadagi ta\'lim daho makoniga mos keladi.'
  },
  {
    name: 'University of Oxford',
    country: 'Buyuk Britaniya',
    minIelts: 7.5,
    minSat: 1480,
    minGpa: 3.8,
    fee: 42000,
    details: 'Oxford xalqaro miqyosdagi eng qadimiy va eng obro\'li universitet hisoblanadi. O\'quv tizimi individual maslahat va o\'quv dasturlariga asoslangan.',
    scholarship: 'Clarendon Fund & Oxford Reach Scholarship',
    whyMatch: 'Kuchli til ko\'rsatkichi va yuqori SAT balingiz nufuzli Oxford kollejlariga munosib nomzod ekanligingizni bildiradi.'
  },
  {
    name: 'Seoul National University',
    country: 'Janubiy Koreya',
    minIelts: 6.5,
    minSat: 1350,
    minGpa: 3.5,
    fee: 8000,
    details: 'Seoul National University Janubiy Koreyadagi eng nufuzli oliygoh bo\'lib, muhandislik va biznes yo\'nalishlarida Osiyoda yetakchi hisoblanadi.',
    scholarship: 'GKS (Global Korea Scholarship) - 100% Kontrakt + Oylik Stipendiya',
    whyMatch: 'GPA va IELTS ko\'rsatkichlaringiz GKS to\'liq davlat granti orqali Koreyaning ushbu #1 oliygohida o\'qish imkonini beradi.'
  },
  {
    name: 'University of Amsterdam',
    country: 'Niderlandiya',
    minIelts: 7.0,
    minSat: 1380,
    minGpa: 3.6,
    fee: 14000,
    details: 'Niderlandiyadagi ushbu oliygoh yuqori darajadagi ingliz tilida o\'qitiladigan dasturlari va jahon andozasidagi ilmiy ishlari bilan ajralib turadi.',
    scholarship: 'Amsterdam Excellence Scholarship (€25,000 / yil)',
    whyMatch: 'Yillik byudjetingiz va IELTS balingiz Yevropaning eng dinamik xalqaro talabalar markaziga mos keladi.'
  },
  {
    name: 'Technical University of Munich',
    country: 'Germaniya',
    minIelts: 6.5,
    minSat: 1300,
    minGpa: 3.4,
    fee: 3000,
    details: 'Germaniyadagi ushbu oliygohda o\'qish bepul bo\'lib, talabalar faqat juda kichik semestr badalini to\x27laydilar. IT va texnik sohada dunyo reytingida yuqori o\'rinda turadi.',
    scholarship: 'DAAD Germany Full-Ride Stipendiya & Kontraktsiz Ta\'lim',
    whyMatch: 'Kamroq byudjet va texnik qiziqishlaringiz Yevropaning muhandislik poytaxtidagi eng nufuzli bepul universitetga mukammal to\'g\x27ri keladi.'
  },
  {
    name: 'National University of Singapore',
    country: 'Singapur',
    minIelts: 7.0,
    minSat: 1420,
    minGpa: 3.75,
    fee: 22000,
    details: 'NUS Osiyo qit\'asidagi eng reytingi yuqori, innovatsiyalar va tadbirkorlikka yo\'naltirilgan yetakchi global o\'quv yurtidir.',
    scholarship: 'NUS Science & Technology Undergraduate Scholarship',
    whyMatch: 'Yuqori SAT balingiz va GPA ko\'rsatkichingiz Osiyoning eng kuchli va texnologik jihatdan eng rivojlangan universitetlaridan biriga mos tushadi.'
  }
];

export default function Consulting() {
  // Form input states
  const [ielts, setIelts] = useState('7.5');
  const [sat, setSat] = useState('1480');
  const [gpa, setGpa] = useState('3.9');
  const [budget, setBudget] = useState('15000');
  const [major, setMajor] = useState('Computer Science');

  // Interactive UI states
  const [isSearching, setIsSearching] = useState(false);
  const [universities, setUniversities] = useState<RecommendedUni[]>([]);
  const [selectedUni, setSelectedUni] = useState<RecommendedUni | null>(null);

  // Roadmap states
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapType, setRoadmapType] = useState<'standard' | 'ai'>('standard');
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  // Helper to generate customized standard roadmap
  const getInitialRoadmap = (ieltsVal: string, satVal: string, gpaVal: string, budgetVal: string, majorVal: string): RoadmapPhase[] => {
    const iVal = parseFloat(ieltsVal) || 6.5;
    const sVal = parseInt(satVal) || 1300;
    const gVal = parseFloat(gpaVal) || 3.5;
    const bVal = parseFloat(budgetVal) || 10000;
    const mVal = majorVal || "Computer Science";

    return [
      {
        title: "1-Bosqich: Akademik va Test Ko'rsatkichlarini Optimallashtirish",
        duration: "1 - 3 oy",
        description: "Universitetlarga qabul qilinish imkoniyatingizni oshirish uchun test natijalarini maqsadli darajaga yetkazish.",
        tasks: [
          {
            text: iVal < 7.0 
              ? `IELTS balingizni hozirgi ${iVal} dan kamida 7.0+ ga oshirish: Har kuni Writing va Speaking qismlariga alohida 1 soat ajrating.` 
              : `IELTS ${iVal} balingiz yuqori darajada. Endi top universitetlar talab qiladigan murakkab akademik atamalar va insholar ustida ishlang.`,
            done: false
          },
          {
            text: sVal < 1450 
              ? `SAT balingizni hozirgi ${sVal} dan 1450+ ballga yetkazish: Matematika va Reading bo'limidan har haftada kamida 1 marta mock test topshiring.` 
              : `SAT ${sVal} ballingiz raqobatbardosh. Eng yuqori 1500+ natija uchun asosan Reading qismidagi qiyin savollar tahlilini amalga oshiring.`,
            done: false
          },
          {
            text: gVal < 3.8 
              ? `GPA ko'rsatkichingizni hozirgi ${gVal} dan iloji boricha yuqori ko'tarishga harakat qiling: Maktab bitiruv imtihonlariga jiddiy tayyorlaning.` 
              : `Ajoyib GPA (${gVal})! Ushbu ko'rsatkichni bitiruvgacha tushirmaslikni va maktab ma'muriyati bilan aloqani yaxshilashni maqsad qiling.`,
            done: false
          }
        ]
      },
      {
        title: "2-Bosqich: Yo'nalish Tanlash va Universitetlar Ro'yxati",
        duration: "3 - 5 oy",
        description: `${mVal} yo'nalishi va yillik $${bVal.toLocaleString()} byudjet doirasida eng to'g'ri oliygohlar va grantlarni tanlash.`,
        tasks: [
          {
            text: `Tanlangan '${mVal}' yo'nalishidagi eng mashhur va kuchli xalqaro dasturlarni o'rganish va ularning o'ziga xos talablarini solishtirish.`,
            done: false
          },
          {
            text: bVal < 15000 
              ? `Byudjetingiz ($${bVal.toLocaleString()}) doirasida to'liq grantlar, GKS (Koreya), DAAD (Germaniya) yoki Need-Blind (AQSH) moliyaviy yordamlarini beruvchi oliygohlarni aniqlang.` 
              : `Yillik $${bVal.toLocaleString()} byudjet sizga Yevropa va Osiyodagi nufuzli universitetlarda bemalol o'qish imkonini beradi. Universitetlarning merit-based (akademik yutuq) grantlariga hujjat tayyorlang.`,
            done: false
          },
          {
            text: `Tanlangan mutaxassislik bo'yicha kamida 1-2 ta real onlayn kurslar (Coursera, edX yoki Harvard OpenCourse) o'tib, qo'shimcha sertifikatlar jamlash.`,
            done: false
          }
        ]
      },
      {
        title: "3-Bosqich: Insho va Tavsiyanomalar (SOP & Recommendation Letters)",
        duration: "5 - 8 oy",
        description: "Sizni shunchaki raqam emas, balki qiziqarli shaxs sifatida ko'rsatadigan ajoyib insholar va hujjatlar paketini tayyorlash.",
        tasks: [
          {
            text: "Statement of Purpose (SOP) yoki Personal Statement birinchi qoralamasini yozish va unda sohaga qiziqishingiz sabablarini ochib berish.",
            done: false
          },
          {
            text: `Nega aynan '${mVal}' yo'nalishini tanlaganingiz haqida batafsil ma'lumot beruvchi inshoni tahrirlash (proofreading).`,
            done: false
          },
          {
            text: "Sizni yaxshi biladigan va yutuqlaringizni ta'riflay oladigan maktab ma'muriyati yoki fan ustozlaridan 2-3 ta rasmiy tavsiyanoma so'rash.",
            done: false
          }
        ]
      },
      {
        title: "4-Bosqich: Arizalarni Topshirish va Natijalar",
        duration: "8 - 10 oy",
        description: "Common App yoki bevosita universitet portallari orqali arizalarni muvaffaqiyatli topshirish va natijalarni kutish.",
        tasks: [
          {
            text: "Common App portali profilini to'liq to'ldirish, baholarni va sertifikatlarni yuklash.",
            done: false
          },
          {
            text: "Tanlangan oliygohlarning Early Action (muddatidan oldin) va Regular Decision (oddiy qabul) dedlaynlarini kalendarga belgilab, o'z vaqtida jo'natish.",
            done: false
          },
          {
            text: "AQSH universitetlariga ariza bersangiz, moliyaviy yordam (financial aid) so'rash uchun CSS Profile yoki ISFAA formasini to'ldirib jo'natish.",
            done: false
          }
        ]
      }
    ];
  };

  // Initial calculation of recommendations & roadmap
  useEffect(() => {
    runRecommendationEngine(false);
    setRoadmap(getInitialRoadmap(ielts, sat, gpa, budget, major));
  }, []);

  // Update dynamic standard roadmap when inputs change (to keep it real-time)
  useEffect(() => {
    if (roadmapType === 'standard') {
      setRoadmap(getInitialRoadmap(ielts, sat, gpa, budget, major));
    }
  }, [ielts, sat, gpa, budget, major, roadmapType]);

  const runRecommendationEngine = async (useAi: boolean = true) => {
    setIsSearching(true);

    const ieltsVal = parseFloat(ielts) || 6.5;
    const satVal = parseInt(sat) || 1300;
    const gpaVal = parseFloat(gpa) || 3.5;
    const budgetVal = parseFloat(budget) || 10000;

    // Calculate dynamic fallback recommendations right away
    const scoredUnis: RecommendedUni[] = STATIC_UNIVERSITIES.map(uni => {
      let score = 75; // base match

      // IELTS impact
      const ieltsDiff = ieltsVal - uni.minIelts;
      if (ieltsDiff >= 0) {
        score += Math.min(10, ieltsDiff * 10);
      } else {
        score -= Math.abs(ieltsDiff) * 15;
      }

      // SAT impact
      const satDiff = satVal - uni.minSat;
      if (satDiff >= 0) {
        score += Math.min(8, Math.floor(satDiff / 50) * 2);
      } else {
        score -= Math.floor(Math.abs(satDiff) / 50) * 12;
      }

      // GPA impact
      const gpaDiff = gpaVal - uni.minGpa;
      if (gpaDiff >= 0) {
        score += Math.min(10, gpaDiff * 15);
      } else {
        score -= Math.abs(gpaDiff) * 25;
      }

      // Budget impact
      if (uni.fee <= budgetVal) {
        score += 6;
      } else {
        const excess = uni.fee - budgetVal;
        if (excess > 30000) {
          score -= 15;
        } else if (excess > 15000) {
          score -= 8;
        } else {
          score -= 3;
        }
      }

      const finalMatch = Math.min(99, Math.max(58, score));

      return {
        name: uni.name,
        country: uni.country,
        match: finalMatch,
        fee: uni.fee,
        details: uni.details,
        scholarship: uni.scholarship,
        whyMatch: uni.whyMatch
      };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 4); // return top 4 matching universities

    if (!useAi) {
      setUniversities(scoredUnis);
      setIsSearching(false);
      return;
    }

    try {
      // Prompt designed to return raw, parsable JSON
      const systemInstruction = 'Siz faqat va faqat xalqaro universitet maslahatlari beradigan foydalanuvchi ma\'lumotlariga mos keladigan JSON massivini qaytaradigan robot-tizimsiz. Hech qanday so\'z, tushuntirish yoki kod bloklari kiritmang. Faqat toza JSON massivi.';
      const prompt = `Foydalanuvchi ma'lumotlari:
- IELTS: ${ieltsVal}
- SAT: ${satVal}
- GPA: ${gpaVal}
- Budget (Yillik): $${budgetVal}
- Major: ${major}

Iltimos, ushbu talabaga eng mos keladigan 3 ta yoki 4 ta xalqaro universitetni tanlang va faqat quyidagi formatdagi bitta valid JSON massivini qaytaring:
[
  {
    "name": "University Name",
    "country": "Country Name",
    "match": 92,
    "fee": 15000,
    "details": "Nega bu universitet mos kelishi haqida batafsil ma'lumot (o'zbek tilida).",
    "scholarship": "Mavjud eng mos keluvchi grant yoki to'liq stipendiya turi (o'zbek tilida).",
    "whyMatch": "GPA va IELTS/SAT natijalari mosligi sababi (o'zbek tilida)."
  }
]`;

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });

      const data = await response.json();
      if (data.text) {
        // Parse the JSON blocks safely
        let rawText = data.text.trim();
        if (rawText.startsWith('```json')) {
          rawText = rawText.substring(7);
        } else if (rawText.startsWith('```')) {
          rawText = rawText.substring(3);
        }
        if (rawText.endsWith('```')) {
          rawText = rawText.substring(0, rawText.length - 3);
        }
        rawText = rawText.trim();

        const parsed: RecommendedUni[] = JSON.parse(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUniversities(parsed);
        } else {
          setUniversities(scoredUnis);
        }
      } else {
        setUniversities(scoredUnis);
      }
    } catch (e) {
      console.error("Gemini API call failed, using dynamic local matcher.", e);
      setUniversities(scoredUnis);
    } finally {
      setIsSearching(false);
    }
  };

  // AI-powered Roadmap Generator
  const generateAiRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);

    const ieltsVal = parseFloat(ielts) || 6.5;
    const satVal = parseInt(sat) || 1300;
    const gpaVal = parseFloat(gpa) || 3.5;
    const budgetVal = parseFloat(budget) || 10000;
    const majorVal = major || "Computer Science";

    try {
      const systemInstruction = 'Siz talabalar uchun xalqaro qabul bo\'yicha mukammal va professional yo\'l xaritasi (Roadmap) tuzuvchi AI-konsultantsiz. Javobingiz faqat va faqat toza, valid JSON formatida bo\'lishi shart. Hech qanday kirish yoki yakuniy matn kiritmang.';
      const prompt = `Foydalanuvchi ma'lumotlari:
- IELTS: ${ieltsVal}
- SAT: ${satVal}
- GPA: ${gpaVal}
- Budget (Yillik): $${budgetVal}
- Major (Yo'nalish): ${majorVal}

Iltimos, ushbu talaba profili uchun moslashtirilgan, bosqichma-bosqich qabul yo'l xaritasini (roadmap) o'zbek tilida tuzing. Reja 3 yoki 4 bosqichdan (Phases) iborat bo'lsin. Har bir bosqichning muddatini, maqsadini va aniq bajarilishi kerak bo'lgan vazifalar ro'yxatini (tasks) bering.
Faqat quyidagi valid JSON formatidagi massivni qaytaring:
[
  {
    "title": "Bosqich nomi (masalan: 1-Bosqich: ...)",
    "duration": "Davomiyligi (masalan: 1-2 oy)",
    "description": "Ushbu bosqichning qisqacha mazmuni va maqsadi.",
    "tasks": [
      "Talaba qilishi kerak bo'lgan birinchi aniq vazifa matni",
      "Ikkinchi aniq vazifa matni",
      "Uchinchi aniq vazifa matni"
    ]
  }
]`;

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });

      const data = await response.json();
      if (data.text) {
        let rawText = data.text.trim();
        if (rawText.startsWith('```json')) {
          rawText = rawText.substring(7);
        } else if (rawText.startsWith('```')) {
          rawText = rawText.substring(3);
        }
        if (rawText.endsWith('```')) {
          rawText = rawText.substring(0, rawText.length - 3);
        }
        rawText = rawText.trim();

        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mappedRoadmap: RoadmapPhase[] = parsed.map((phase: any) => ({
            title: phase.title || "Keyingi bosqich",
            duration: phase.duration || "1 oy",
            description: phase.description || "",
            tasks: (phase.tasks || []).map((taskStr: string) => ({
              text: taskStr,
              done: false
            }))
          }));
          setRoadmap(mappedRoadmap);
          setRoadmapType('ai');
        } else {
          throw new Error("Noto'g'ri formatdagi ma'lumot qabul qilindi.");
        }
      } else {
        throw new Error("AI javob qaytara olmadi.");
      }
    } catch (e: any) {
      console.error("Roadmap generation failed:", e);
      setRoadmapError("AI orqali yo'l xaritasini tuzishda xatolik yuz berdi. Standard yo'l xaritasi faollashtirildi.");
      setRoadmap(getInitialRoadmap(ielts, sat, gpa, budget, major));
      setRoadmapType('standard');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleFindUniversities = (e: React.FormEvent) => {
    e.preventDefault();
    runRecommendationEngine(true);
    // Refresh roadmap to correspond to form values
    if (roadmapType === 'standard') {
      setRoadmap(getInitialRoadmap(ielts, sat, gpa, budget, major));
    }
  };

  // Toggle dynamic checklist item
  const toggleTask = (phaseIdx: number, taskIdx: number) => {
    setRoadmap(prev => prev.map((phase, pIdx) => {
      if (pIdx !== phaseIdx) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((task, tIdx) => {
          if (tIdx !== taskIdx) return task;
          return { ...task, done: !task.done };
        })
      };
    }));
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto space-y-10 sm:space-y-16" id="consulting_root">
      
      {/* Premium Minimal Header */}
      <div className="space-y-2 border-b border-neutral-100 pb-8 animate-fade-in" id="consulting_header">
        <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-neutral-950 font-sans">
          University Consulting
        </h1>
        <p className="text-sm md:text-base text-neutral-400 font-light max-w-xl">
          Akademik ko&apos;rsatkichlaringizni kiriting va sizga eng mos keladigan oliygohlar, grantlar va tayyorgarlik yo&apos;l xaritasini aniqlang.
        </p>
      </div>

      {/* Main Grid: Left compact form, Right AI results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start" id="consulting_main_grid">
        
        {/* Left Column: Compact Profil Formasi */}
        <div className="lg:col-span-4" id="consulting_form_column">
          <form onSubmit={handleFindUniversities} className="space-y-6" id="profil_form">
            
            {/* Input Wrapper */}
            <div className="space-y-5 bg-white p-6 border border-neutral-200/60 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)]" id="form_inputs_card">
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider" htmlFor="input_ielts">IELTS</label>
                  <span className="text-[10px] text-neutral-400 font-light">Min: 5.0 / Max: 9.0</span>
                </div>
                <input
                  id="input_ielts"
                  type="text"
                  value={ielts}
                  onChange={(e) => setIelts(e.target.value)}
                  placeholder="Masalan: 7.5"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider" htmlFor="input_sat">SAT</label>
                  <span className="text-[10px] text-neutral-400 font-light">Min: 400 / Max: 1600</span>
                </div>
                <input
                  id="input_sat"
                  type="text"
                  value={sat}
                  onChange={(e) => setSat(e.target.value)}
                  placeholder="Masalan: 1480"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider" htmlFor="input_gpa">GPA</label>
                  <span className="text-[10px] text-neutral-400 font-light">Min: 1.0 / Max: 4.0</span>
                </div>
                <input
                  id="input_gpa"
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="Masalan: 3.9"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider" htmlFor="input_budget">Budget (Yillik $)</label>
                <input
                  id="input_budget"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Masalan: 15000"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider" htmlFor="input_major">Major (Mutaxassislik)</label>
                <input
                  id="input_major"
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Masalan: Computer Science"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition duration-150"
                  required
                />
              </div>

            </div>

            {/* Main CTA Button: Find Universities */}
            <button
              id="cta_find_universities"
              type="submit"
              disabled={isSearching}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium text-sm py-3 px-4 rounded-xl transition duration-150 shadow-sm shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Qidirilmoqda...
                </>
              ) : (
                'Find Universities'
              )}
            </button>

          </form>
        </div>

        {/* Right Column: AI Recommended Universities */}
        <div className="lg:col-span-8 space-y-6" id="consulting_results_column">
          
          {/* Loading Skeleton */}
          {isSearching ? (
            <div className="space-y-4" id="results_skeleton">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-6 border border-neutral-100 rounded-2xl space-y-4 animate-pulse">
                  <div className="h-5 bg-neutral-100 rounded w-1/3" />
                  <div className="h-4 bg-neutral-100 rounded w-1/4" />
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="h-4 bg-neutral-100 rounded w-1/2" />
                    <div className="h-4 bg-neutral-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5" id="results_container">
              {universities.length > 0 ? (
                universities.map((uni, idx) => (
                  <div
                    key={idx}
                    id={`uni_card_${idx}`}
                    className="bg-white p-6 md:p-8 border border-neutral-100 hover:border-neutral-200/80 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)] transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Left: General Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium tracking-wider text-neutral-400 uppercase">{uni.country}</span>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {uni.match}% Match
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-normal text-neutral-900 tracking-tight">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Tuition Fee: {uni.fee === 0 ? 'Bepul / Kontraktsiz' : `$${uni.fee.toLocaleString()} / yil`}
                      </p>
                    </div>

                    {/* Right: Action Button */}
                    <div>
                      <button
                        id={`btn_view_details_${idx}`}
                        onClick={() => setSelectedUni(uni)}
                        className="w-full md:w-auto px-5 py-2 text-xs font-medium border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition duration-150 text-neutral-700 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-neutral-100 rounded-2xl" id="no_results">
                  <p className="text-sm text-neutral-400 font-light">Tavsiya etilgan universitetlar ro&apos;yxatini ko&apos;rish uchun ma&apos;lumotlaringizni kiriting.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Elegant Divider */}
      <div className="border-t border-neutral-100 my-12" />

      {/* ROADMAP SECTION (Roadmap tuzish joyi) */}
      <div className="space-y-8" id="roadmap_section">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6" id="roadmap_header">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2 className="text-2xl font-normal text-neutral-950 tracking-tight">
                Shaxsiy Qabul Yo&apos;l Xaritasi (Roadmap)
              </h2>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 font-light max-w-xl">
              Akademik parametrlaringiz va maqsadli mutaxassisligingizga moslashtirilgan qadam-baqadam yo&apos;l xaritasi.
            </p>
          </div>

          {/* Action Button: AI-powered or dynamic reset */}
          <div className="flex items-center gap-3">
            {roadmapType === 'ai' && (
              <button
                id="reset_roadmap_btn"
                onClick={() => {
                  setRoadmapType('standard');
                  setRoadmap(getInitialRoadmap(ielts, sat, gpa, budget, major));
                }}
                className="px-4 py-2 text-xs font-normal border border-neutral-200 rounded-xl hover:border-neutral-300 text-neutral-500 cursor-pointer flex items-center gap-1.5 transition"
              >
                Standard Reja
              </button>
            )}

            <button
              id="generate_ai_roadmap_btn"
              disabled={isGeneratingRoadmap}
              onClick={generateAiRoadmap}
              className="px-4 py-2.5 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              {isGeneratingRoadmap ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  Yo&apos;l xaritasi tuzilmoqda...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                  AI orqali yo&apos;l xaritasini tuzish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback / Error banner */}
        {roadmapError && (
          <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl text-xs text-amber-800 font-light" id="roadmap_error_banner">
            {roadmapError}
          </div>
        )}

        {/* Timeline Map Display (Linear-styled Minimalist Timeline) */}
        <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:left-[11px] md:before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-100" id="roadmap_timeline">
          {roadmap.map((phase, pIdx) => (
            <div key={pIdx} className="relative group animate-fade-in" id={`roadmap_phase_${pIdx}`}>
              
              {/* Timeline dot */}
              <div className="absolute -left-[23px] md:-left-[35px] top-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] md:text-xs font-medium text-neutral-400 group-hover:border-indigo-500 group-hover:text-indigo-600 transition duration-150 shadow-sm">
                {pIdx + 1}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Phase Info (Left side of local content) */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {phase.duration}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-normal text-neutral-900 tracking-tight">
                    {phase.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
                    {phase.description}
                  </p>
                </div>

                {/* Tasks Checklist (Right side of local content) */}
                <div className="lg:col-span-8 bg-neutral-50/30 border border-neutral-200/50 rounded-2xl p-6 md:p-8 space-y-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.01)]">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Bosqich vazifalari</span>
                  
                  <div className="space-y-3.5">
                    {phase.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(pIdx, tIdx)}
                        className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                          task.done 
                            ? 'bg-neutral-50/50 border-neutral-200/40 text-neutral-400 line-through' 
                            : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 text-neutral-700 shadow-sm shadow-neutral-100/50'
                        }`}
                        id={`task_${pIdx}_${tIdx}`}
                      >
                        {/* Custom sleek Checkbox */}
                        <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                          task.done 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'bg-white border-neutral-300 group-hover:border-neutral-400'
                        }`}>
                          {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Task text */}
                        <span className="text-xs md:text-sm font-light leading-normal">
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Modal: View Details Overlay (Apple style, minimalist) */}
      {selectedUni && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/20 backdrop-blur-xs transition duration-200"
          id="details_modal_overlay"
          onClick={() => setSelectedUni(null)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden transform transition-all duration-300 flex flex-col"
            id="details_modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-neutral-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">{selectedUni.country}</span>
                <h2 className="text-xl md:text-2xl font-normal text-neutral-900 tracking-tight mt-1">{selectedUni.name}</h2>
              </div>
              <button
                id="close_modal_btn"
                onClick={() => setSelectedUni(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              
              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/30">
                  <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-wider block">Match %</span>
                  <span className="text-xl font-medium text-indigo-900 font-sans mt-1 block">{selectedUni.match}% Moslik</span>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">Tuition Fee</span>
                  <span className="text-xl font-medium text-neutral-800 font-sans mt-1 block">
                    {selectedUni.fee === 0 ? 'Bepul' : `$${selectedUni.fee.toLocaleString()} / yil`}
                  </span>
                </div>
              </div>

              {/* Detail Sections */}
              <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
                
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Nega to&apos;g&apos;ri keladi?
                  </h4>
                  <p className="text-neutral-500 font-light">{selectedUni.whyMatch}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-500" /> Universitet haqida
                  </h4>
                  <p className="text-neutral-500 font-light">{selectedUni.details}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" /> Tavsiya etilgan Grantlar
                  </h4>
                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 text-neutral-700 font-medium text-xs">
                    {selectedUni.scholarship}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 bg-neutral-50/50 border-t border-neutral-100 flex justify-end">
              <button
                id="close_modal_footer_btn"
                onClick={() => setSelectedUni(null)}
                className="px-5 py-2 text-xs font-medium bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition duration-150 cursor-pointer"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
