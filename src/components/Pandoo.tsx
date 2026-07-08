import React, { useState, useMemo } from 'react';
import * as api from '../api';
import {
  Brain,
  Sparkles,
  CheckCircle,
  XCircle,
  ChevronRight,
  RefreshCw,
  Trophy,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Star,
  ArrowLeft,
  Target,
  Zap,
} from 'lucide-react';

interface WrongQuestion {
  question: string;
  options: string[];
  correct: number;
  userAnswer: number;
  explanation: string;
}

interface PandooProps {
  isOpen?: boolean;
  onClose?: () => void;
  testTitle?: string;
  wrongQuestions?: WrongQuestion[];
  correctCount?: number;
  totalQuestions?: number;
  setXp?: React.Dispatch<React.SetStateAction<number>>;
  setCoins?: React.Dispatch<React.SetStateAction<number>>;
  setLevel?: React.Dispatch<React.SetStateAction<number>>;
  standalone?: boolean;
}

type Stage = 'topic_pick' | 'teach' | 'test' | 'result';

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  topic: string;
}

const TOPIC_POOLS: Record<string, QuizQuestion[]> = {
  grammar: [
    { q: 'I ______ my homework before my mother came home.', options: ['finish', 'finished', 'had finished', 'have finished'], correct: 2, topic: 'Past Perfect' },
    { q: 'We ______ TV when the phone rang.', options: ['watch', 'were watching', 'watched', 'have watched'], correct: 1, topic: 'Past Continuous' },
    { q: 'She ______ English for 3 years now.', options: ['learns', 'learned', 'has been learning', 'is learning'], correct: 2, topic: 'Present Perfect Continuous' },
    { q: 'If it rains, we ______ inside.', options: ['stay', 'will stay', 'would stay', 'stayed'], correct: 1, topic: 'First Conditional' },
    { q: 'They ______ each other since childhood.', options: ['know', 'knew', 'have known', 'are knowing'], correct: 2, topic: 'Present Perfect' },
    { q: 'By the time we arrived, the movie ______.', options: ['started', 'has started', 'had started', 'starts'], correct: 2, topic: 'Past Perfect' },
    { q: 'I ______ to the gym every day last month.', options: ['go', 'went', 'have gone', 'was going'], correct: 1, topic: 'Past Simple' },
    { q: 'She ______ her room when I called her.', options: ['cleans', 'was cleaning', 'has cleaned', 'cleaned'], correct: 1, topic: 'Past Continuous' },
  ],
  conditional: [
    { q: 'If I ______ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correct: 2, topic: 'Second Conditional' },
    { q: 'If she ______ harder, she would pass the exam.', options: ['study', 'studies', 'studied', 'studying'], correct: 2, topic: 'Second Conditional' },
    { q: 'If you heat ice, it ______.', options: ['melt', 'melts', 'would melt', 'melted'], correct: 1, topic: 'Zero Conditional' },
    { q: 'I would have called you if I ______ your number.', options: ['had', 'have', 'had had', 'would have'], correct: 2, topic: 'Third Conditional' },
    { q: 'If we leave now, we ______ the bus.', options: ['catch', 'caught', 'will catch', 'would catch'], correct: 2, topic: 'First Conditional' },
    { q: 'If it ______ tomorrow, we will stay home.', options: ['rains', 'rained', 'will rain', 'would rain'], correct: 0, topic: 'First Conditional' },
    { q: 'If I ______ you, I would accept the offer.', options: ['am', 'was', 'were', 'be'], correct: 2, topic: 'Second Conditional' },
    { q: 'She would have succeeded if she ______ more.', options: ['tries', 'tried', 'had tried', 'would try'], correct: 2, topic: 'Third Conditional' },
  ],
  vocabulary: [
    { q: 'The word "generous" means:', options: ['selfish', 'kind and giving', 'lazy', 'angry'], correct: 1, topic: 'Vocabulary' },
    { q: 'What is the opposite of "ancient"?', options: ['old', 'modern', 'broken', 'heavy'], correct: 1, topic: 'Antonyms' },
    { q: '"Brilliant" is closest in meaning to:', options: ['dark', 'clever', 'slow', 'weak'], correct: 1, topic: 'Synonyms' },
    { q: 'A person who studies stars is called an:', options: ['artist', 'astronomer', 'athlete', 'architect'], correct: 1, topic: 'Vocabulary' },
    { q: '"Meticulous" means:', options: ['careless', 'very careful', 'lazy', 'fast'], correct: 1, topic: 'Vocabulary' },
    { q: '"Benevolent" means:', options: ['kind', 'cruel', 'weak', 'angry'], correct: 0, topic: 'Vocabulary' },
    { q: '"Ephemeral" means:', options: ['permanent', 'short-lived', 'strong', 'heavy'], correct: 1, topic: 'Vocabulary' },
    { q: '"Ubiquitous" means:', options: ['rare', 'everywhere', 'nowhere', 'hidden'], correct: 1, topic: 'Vocabulary' },
  ],
  math_sequence: [
    { q: 'Find the next: 1, 4, 9, 16, 25, ?', options: ['30', '35', '36', '49'], correct: 2, topic: 'Number Sequences' },
    { q: 'Find the next: 3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], correct: 1, topic: 'Number Sequences' },
    { q: 'Find the next: 1, 1, 2, 3, 5, 8, ?', options: ['10', '11', '12', '13'], correct: 3, topic: 'Fibonacci' },
    { q: 'Find the next: 100, 90, 81, 73, 66, ?', options: ['58', '60', '55', '62'], correct: 0, topic: 'Number Sequences' },
    { q: 'Find the next: 2, 5, 10, 17, 26, ?', options: ['35', '37', '39', '41'], correct: 1, topic: 'Number Sequences' },
    { q: 'Find the next: 1, 8, 27, 64, 125, ?', options: ['180', '200', '216', '250'], correct: 2, topic: 'Cubic Numbers' },
    { q: 'Find the next: 0, 3, 8, 15, 24, ?', options: ['32', '33', '35', '36'], correct: 2, topic: 'Number Sequences' },
    { q: 'Find the next: 2, 6, 18, 54, ?', options: ['108', '162', '216', '270'], correct: 1, topic: 'Geometric Progression' },
  ],
  math_age: [
    { q: 'Ali 12 yoshda, otasi 36 yoshda. Necha yildan keyin otasi Alidan 2 marta katta boladi?', options: ['6', '8', '10', '12'], correct: 1, topic: 'Age Problems' },
    { q: 'Bir opa-uka yoshlari yigindisi 15. Opa ukadan 3 yosh katta. Ukasi necha yoshda?', options: ['6', '7', '8', '9'], correct: 0, topic: 'Age Problems' },
    { q: 'Laylo 8 yoshda, onasi 32 yoshda. Necha yildan keyin onasi Laylodan 3 marta katta boladi?', options: ['2', '3', '4', '5'], correct: 2, topic: 'Age Problems' },
    { q: 'Bir ota 40 yoshda, ogli 10 yoshda. Necha yildan keyin otasi oglidan 2 marta katta boladi?', options: ['10', '15', '20', '25'], correct: 2, topic: 'Age Problems' },
    { q: 'Bir oilada ona 35 yoshda, qizi 7 yoshda. Necha yildan keyin onasi qizidan 3 marta katta boladi?', options: ['5', '7', '9', '11'], correct: 1, topic: 'Age Problems' },
  ],
  logic: [
    { q: '1 soat ichida 1 ta mashina 100 km yol yuradi. 30 minutda necha km?', options: ['30', '50', '60', '100'], correct: 1, topic: 'Logic' },
    { q: '3 ta qalam 600 som bolsa, 5 ta qalam necha som?', options: ['800', '900', '1000', '1200'], correct: 2, topic: 'Proportion' },
    { q: 'Bir sonni 2 ga bolib, 3 qoshilsa, 10 hosil boladi. Shu son?', options: ['12', '14', '16', '18'], correct: 1, topic: 'Reverse Logic' },
    { q: 'A > B va B > C bolsa, qaysi biri togri?', options: ['A < C', 'A = C', 'A > C', 'B > A'], correct: 2, topic: 'Logical Comparison' },
    { q: 'Agar yomgir yogayotgan bolsa, zamin h boladi. Agar zamin h bolmasa...', options: ['yomgir yoggan', 'yomgir yogmagan', 'qor yoggan', 'quyoshli'], correct: 1, topic: 'Logical Deduction' },
    { q: 'Agar 2 ta ishchi 2 soatda 2 ta detal yasasa, 10 ta ishchi 10 soatda necha detal yasaydi?', options: ['10', '20', '50', '100'], correct: 2, topic: 'Work Rate' },
  ],
  spelling: [
    { q: 'Qaysi yozilish togri?', options: ['Tavsiya', 'Tavsiiya', 'Tavseya', 'Tavsia'], correct: 0, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Tashabbuz', 'Tashabbus', 'Tashabus', 'Tashabbis'], correct: 1, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Muamo', 'Muammo', 'Muhammo', 'Mavammo'], correct: 1, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Ehtimol', 'Ehtimoll', 'Ehtemol', 'Ehtymol'], correct: 0, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Taxlil', 'Tahlil', 'Taxlill', 'Tahlill'], correct: 1, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Mashaqat', 'Mashaqqat', 'Mashakat', 'Mashaqad'], correct: 1, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Ahamiyat', 'Axamiyat', 'Ahamiyat', 'Ahammiyat'], correct: 2, topic: 'Imlo' },
    { q: 'Qaysi yozilish togri?', options: ['Tayinlov', 'Tayinlaov', 'Tayinlash', 'Tayinlov'], correct: 2, topic: 'Imlo' },
  ],
  antonyms: [
    { q: '"Yaxshi" sozining antonimi:', options: ['yomon', 'tez', 'katta', 'oz'], correct: 0, topic: 'Antonimlar' },
    { q: '"Issiq" sozining antonimi:', options: ['iliq', 'sovuq', 'qaynoq', 'nam'], correct: 1, topic: 'Antonimlar' },
    { q: '"Tez" sozining antonimi:', options: ['kutdi', 'sekin', 'yugurdi', 'keldi'], correct: 1, topic: 'Antonimlar' },
    { q: '"Keng" sozining antonimi:', options: ['uzun', 'tor', 'katta', 'chuqur'], correct: 1, topic: 'Antonimlar' },
    { q: '"Yorug" sozining antonimi:', options: ['yoruq', 'qorong\'i', 'tiniq', 'ravshan'], correct: 1, topic: 'Antonimlar' },
    { q: '"Yangi" sozining antonimi:', options: ['eski', 'katta', 'chiroyli', 'tez'], correct: 0, topic: 'Antonimlar' },
    { q: '"Kuchli" sozining antonimi:', options: ['katta', 'kuchsiz', 'tez', 'baland'], correct: 1, topic: 'Antonimlar' },
    { q: '"Boy" sozining antonimi:', options: ['kambag\'al', 'katta', 'oz', 'tez'], correct: 0, topic: 'Antonimlar' },
  ],
  cases: [
    { q: "'Kitob' sozining qaratqich kelishigi:", options: ['kitob', 'kitobning', 'kitobni', 'kitobga'], correct: 1, topic: 'Kelishiklar' },
    { q: "'Maktab' sozining jo\'nalish kelishigi:", options: ['maktab', 'maktabning', 'maktabni', 'maktabga'], correct: 3, topic: 'Kelishiklar' },
    { q: "'Shahar' sozining chiqish kelishigi:", options: ['shaharga', 'shahardan', 'shaharni', 'shaharning'], correct: 1, topic: 'Kelishiklar' },
    { q: "'Daftar' sozining tushum kelishigi:", options: ['daftar', 'daftarning', 'daftarni', 'daftarda'], correct: 2, topic: 'Kelishiklar' },
    { q: "'Uy' sozining orin-payt kelishigi:", options: ['uyning', 'uyga', 'uy', 'uyda'], correct: 3, topic: 'Kelishiklar' },
    { q: "'Ona' sozining bosh kelishigi:", options: ['ona', 'onaning', 'onani', 'onaga'], correct: 0, topic: 'Kelishiklar' },
    { q: "'Do\'st' sozining qaratqich kelishigi:", options: ['do\'st', 'do\'stning', 'do\'stni', 'do\'stga'], correct: 1, topic: 'Kelishiklar' },
    { q: "'Kitob' sozining orin-payt kelishigi:", options: ['kitobda', 'kitobning', 'kitobni', 'kitobga'], correct: 0, topic: 'Kelishiklar' },
  ],
};

const TOPIC_LABELS: Record<string, string> = {
  grammar: 'Grammar / Zamonlar',
  conditional: 'Conditional Sentences',
  vocabulary: 'So\'z boyligi',
  math_sequence: 'Sonlar Ketma-ketligi',
  math_age: 'Yoshga Doir Masalalar',
  logic: 'Mantiqiy Fikrlash',
  spelling: 'Imlo Qoidalari',
  antonyms: 'Antonimlar',
  cases: 'Kelishiklar',
};

const TOPIC_ICONS: Record<string, string> = {
  grammar: '📝',
  conditional: '🔀',
  vocabulary: '📖',
  math_sequence: '🔢',
  math_age: '👶',
  logic: '🧠',
  spelling: '✏️',
  antonyms: '↔️',
  cases: '🏛️',
};

const TOPIC_TEACHINGS: Record<string, { main: string; example: string; mnemonic: string }> = {
  grammar: {
    main: 'Zamonlar — ish-harakatning qachon sodir bolganini bildiradi. Past Perfect (had + V3) bir ish-harakatdan oldin bajarilgan boshqa ish-harakatni ifodalaydi. Present Perfect Continuous (have/has been + V-ing) otgan zamonda boshlanib, hozirgacha davom etayotgan harakatni bildiradi.',
    example: '"She HAD FINISHED her homework BEFORE her friends arrived." — uy vazifasi do\'stlari kelishdan OLDIN tugatilgan.\n\n" I have been learning English for 3 years." — 3 yil oldin boshlaganman va hali ham o\'rganyapman.',
    mnemonic: 'OLDIN sodir bolgan harakat = had + 3-shakl (Past Perfect). "Had" + "V3" = "oldin"',
  },
  conditional: {
    main: 'Conditional (shart) gaplar 4 turga bolinadi: Zero (umumiy haqiqat), First (real kelajak), Second (noreal hozirgi), Third (noreal otgan). Second Conditional: If + Past Simple, would + V1 — hozirgi zamonda mumkin bolmagan vaziyatlar uchun.',
    example: 'Zero: If you heat ice, it MELTS.\nFirst: If it RAINS, we WILL STAY home.\nSecond: If I WERE you, I WOULD STUDY more.\nThird: If I HAD KNOWN, I WOULD HAVE COME.',
    mnemonic: '2-tur: "If + were, would + V1" — orzu va taxminlar. "Were" faqat "I" bilan ham ishlatiladi!',
  },
  vocabulary: {
    main: 'So\'z boyligini oshirish — kontekstda organish eng samarali usul. Har kuni 5 ta yangi so\'z organib, ularni gap ichida ishlatish kerak. Sinonim va antonimlarni birga organish eslab qolishni osonlashtiradi.',
    example: '"Meticulous" = juda ehtiyotkor, mayda-chuydasigacha etiborli.\n" Benevolent" = mehribon, muruvvatli.\n" Ubiquitous" = hamma joyda uchraydigan.',
    mnemonic: 'Yangi so\'zni 3 marta: 1) yozib ol, 2) gap tuz, 3) aytib ko\'r. Takrorlash — bilim onasi!',
  },
  math_sequence: {
    main: 'Ketma-ketlik masalalarida qo\'shni sonlar orasidagi FARQNI toping. Farqlar bir xil qonuniyat bilan ozgaradi. Agar farqlar ozgaruvchi bolsa, farqlarning farqini hisoblang.',
    example: '2, 6, 12, 20, 30 — farqlar: +4, +6, +8, +10. Qonuniyat: farq har safar 2 ga oshadi. Keyingi farq +12. 30+12=42.\n\n1, 8, 27, 64, 125 — bu kub sonlar: 1³, 2³, 3³, 4³, 5³. Keyingisi 6³=216.',
    mnemonic: 'Ketma-ketlikda FARQLARGA qara. Farqlar ozgaruvchi bolsa, farqlarning FARQINI top.',
  },
  math_age: {
    main: 'Yosh masalalarida asosiy formula: (ota_yoshi + x) = k × (ogil_yoshi + x), bu yerda x — necha yildan keyin, k — necha marta katta. Tenglamani yechish uchun x ni toping.',
    example: 'Ota 40, ogil 10. Necha yildan keyin otasi oglidan 2 marta katta?\n40 + x = 2(10 + x)\n40 + x = 20 + 2x\n40 - 20 = 2x - x\n20 = x\nJavob: 20 yildan keyin.',
    mnemonic: 'Tenglama tuz: "katta_yosh + x = marta × (kichik_yosh + x)". x ni topish — qolgani oddiy arifmetika.',
  },
  logic: {
    main: 'Mantiqiy masalalarda proporsiya va parallel bajarish tushunchalari muhim. Ish unumdorligi masalalarida: ishchi × vaqt = ish hajmi. Agar ishchilar soni ortsa, vaqt kamayadi.',
    example: '2 ta ishchi 2 soatda 2 ta detal = har bir ishchi 2 soatda 1 ta detal.\n10 ta ishchi 10 soatda = 10 × (10/2) = 50 ta detal.\n(Chunki har bir ishchi 2 soatda 1 ta detal yasasa, 10 soatda 5 ta detal yasaydi. 10 × 5 = 50)',
    mnemonic: 'Ish masalalari: "Ishchi × vaqt / ish = const". Kubik formulasi: umumiy ish = ishchilar × vaqt × tezlik.',
  },
  spelling: {
    main: 'O\'zbek tilida ayrim so\'zlar qo\'sh undosh bilan yoziladi. Eng kop uchraydigan xatolar: muammo (ikki "m" va ikki "m"), mashaqqat (ikki "q"), tashabbus (ikki "s"), ahamiyat (bir "h" va ikki "m" emas!).',
    example: 'Togri yozilish: muammo, mashaqqat, tashabbus, ahamiyat, ehtimol, tahlil, taxlil EMAS.\nEsda tut: Ikki undosh eshitilsa, kopincha ikkala harf ham yoziladi.',
    mnemonic: 'Muammo = "mu" + "ammo" (ikkala qismida ham qo\'sh undosh). Shunchaki yodlab olish kerak!',
  },
  antonyms: {
    main: 'Antonimlar — bir-biriga ZID bolgan so\'zlar: issiq ↔ sovuq, baland ↔ past, tez ↔ sekin, keng ↔ tor. Antonimlar matnni ifodali qiladi va sinonimlar bilan birga organilsa, so\'z boyligi tez oshadi.',
    example: 'Yaxshi ↔ Yomon\nIssiq ↔ Sovuq\nKeng ↔ Tor\nYorug\' ↔ Qorong\'i\nKuchli ↔ Kuchsiz\nBoy ↔ Kambag\'al\nTez ↔ Sekin',
    mnemonic: 'Antonim = "anti" (qarshi) + "onim" (nom). Qarshi nom — ZID ma\'noli so\'z.',
  },
  cases: {
    main: 'O\'zbek tilida 6 ta kelishik bor. Ular so\'z oxiriga qo\'shimcha qo\'shish orqali yasaladi va gapdagi vazifasini belgilaydi. Kelishiklar — gapdagi so\'zlar orasidagi munosabatni bildiradi.',
    example: 'Bosh (kim? nima?): kitob\nQaratqich (kimning? nimaning?): kitobning\nTushum (kimni? nimani?): kitobni\nJo\'nalish (kimga? nimaga?): kitobga\nO\'rin-payt (kimda? nimada?): kitobda\nChiqish (kimdan? nimadan?): kitobdan',
    mnemonic: '6 kelishik: Bosh (aloqa), Qaratqich (egalik), Tushum (obekt), Jo\'nalish (harakat), O\'rin-payt (joy), Chiqish (boshlanish). QBTJO\'C!',
  },
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function detectTopic(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('had finished') || lower.includes('past perfect') || lower.includes('before') && (lower.includes('arrived') || lower.includes('came'))) return 'grammar';
  if (lower.includes('if i') || lower.includes('if you') || lower.includes('conditional') || lower.includes('would')) return 'conditional';
  if (lower.includes('synonym') || lower.includes('meticulous') || lower.includes('generous') || lower.includes('brilliant') || lower.includes('reluctant') || lower.includes('meaning') || lower.includes('opposite') || lower.includes('antonym')) return 'vocabulary';
  if (lower.includes('ketma-ketlik') || lower.includes('next number') || lower.includes('sequence') || lower.includes('find the next') || (/\d/.test(lower) && lower.includes(','))) return 'math_sequence';
  if (lower.includes('ota') || lower.includes('oyi') || lower.includes('yosh') || lower.includes('ona') || lower.includes('necha yil')) return 'math_age';
  if (lower.includes('mushuk') || lower.includes('soat') || lower.includes('minut') || lower.includes('mantiq') || lower.includes('mashina') || lower.includes('qalam')) return 'logic';
  if (lower.includes('imlo') || lower.includes('yozilish') || lower.includes('togri') && lower.includes('harfi')) return 'spelling';
  if (lower.includes('antonim') || lower.includes('zid') || lower.includes("ma'noli") || lower.includes('yaxshi') && lower.includes('yomon')) return 'antonyms';
  if (lower.includes('kelishik') || lower.includes('qaratqich') || lower.includes('tushum') || lower.includes('jo\'nalish') || lower.includes('chiqish') || lower.includes('o\'rin-payt')) return 'cases';
  return 'grammar';
}

const TOPIC_LIST = Object.keys(TOPIC_POOLS);

export default function Pandoo({
  isOpen,
  onClose,
  testTitle,
  wrongQuestions: externalWrong,
  correctCount: externalCorrect,
  totalQuestions: externalTotal,
  setXp,
  setCoins,
  setLevel,
  standalone,
}: PandooProps) {
  const [stage, setStage] = useState<Stage>('topic_pick');
  const [topic, setTopic] = useState<string>('');
  const [currentTeachingPage, setCurrentTeachingPage] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; pct: number; passed: boolean; earnedXp: number } | null>(null);
  const [wrongExplanations, setWrongExplanations] = useState<{ question: string; options: string[]; correct: number; userAnswer: number; explanation: string }[]>([]);

  const topics = useMemo(() => {
    if (externalWrong && externalWrong.length > 0) {
      const t = new Set<string>();
      externalWrong.forEach((q) => t.add(detectTopic(q.question)));
      return Array.from(t);
    }
    return [];
  }, [externalWrong]);

  const teachingPages = useMemo(() => {
    if (stage === 'teach' && topic) {
      const t = TOPIC_TEACHINGS[topic];
      if (!t) return [];
      return [
        { title: 'Asosiy Tushuncha', content: t.main },
        { title: 'Misollar', content: t.example },
        { title: 'Eslab Qol!', content: t.mnemonic },
      ];
    }
    return [];
  }, [stage, topic]);

  const quizQuestions = useMemo(() => {
    if (!topic) return [];
    const pool = TOPIC_POOLS[topic];
    if (!pool) return [];
    return shuffleArray(pool).slice(0, 6);
  }, [topic]);

  const startTeaching = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setCurrentTeachingPage(0);
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
    setWrongExplanations([]);
    setStage('teach');
  };

  const nextTeachingPage = () => {
    if (currentTeachingPage < teachingPages.length - 1) {
      setCurrentTeachingPage(currentTeachingPage + 1);
    } else {
      setStage('test');
    }
  };

  const prevTeachingPage = () => {
    if (currentTeachingPage > 0) {
      setCurrentTeachingPage(currentTeachingPage - 1);
    }
  };

  const handleAnswer = (idx: number, ans: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [idx]: ans }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const ua: Record<number, number> = {};
    const questions = quizQuestions.map((q, i) => {
      ua[i] = userAnswers[i] ?? -1;
      return { correct: q.correct };
    });

    const res = await api.reward('complete_pandoo', { questions, userAnswers: ua }).catch(() => null);

    const pct = quizQuestions.length > 0
      ? (Object.entries(ua).filter(([idx, ans]) => quizQuestions[Number(idx)]?.correct === ans).length / quizQuestions.length) * 100
      : 0;

    const correct = Object.keys(ua).filter((k) => quizQuestions[Number(k)]?.correct === ua[Number(k)]).length;
    const total = quizQuestions.length;

    setResult({
      correct,
      total,
      pct,
      passed: pct >= 70,
      earnedXp: res?.deltaXp ?? (pct >= 70 ? 300 : 100),
    });

    if (res) {
      if (setXp) setXp(res.totalXp);
      if (setCoins) setCoins(res.totalCoins);
      if (setLevel) setLevel(res.level);
    }

    const wrongs = quizQuestions
      .map((q, idx) => ({
        question: q.q,
        options: q.options,
        correct: q.correct,
        userAnswer: ua[idx] ?? -1,
        explanation: q.topic,
      }))
      .filter((_, idx) => ua[idx] !== quizQuestions[idx].correct);

    setWrongExplanations(wrongs);
  };

  const handleRestart = () => {
    setStage('topic_pick');
    setTopic('');
    setCurrentTeachingPage(0);
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
    setWrongExplanations([]);
  };

  const handleFinish = () => {
    handleRestart();
    if (onClose) onClose();
  };

  const initialTopic = standalone
    ? null
    : (topics.length > 0 ? topics[0] : null);

  if (!standalone && !isOpen) return null;

  const containerClass = standalone
    ? 'flex-1 overflow-y-auto'
    : 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50';

  const innerClass = standalone
    ? 'max-w-4xl mx-auto p-4 sm:p-8'
    : 'w-full max-w-3xl bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl shadow-2xl border border-emerald-800/40 overflow-hidden animate-fade-in max-h-[90vh] flex flex-col';

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Pandoo AI Mentor
              </h3>
              <p className="text-[11px] text-emerald-300 font-semibold">
                {topic ? TOPIC_LABELS[topic] || topic : 'Shaxsiy virtual o\'qituvchi'}
              </p>
            </div>
          </div>
          {!standalone && stage !== 'topic_pick' && (
            <button onClick={handleFinish} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer text-sm">✕</button>
          )}
        </div>

        <div className={`${standalone ? '' : 'px-6 py-4 overflow-y-auto'} space-y-4`}>
          {/* TOPIC PICK — standalone mode */}
          {stage === 'topic_pick' && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-xl font-black text-white">Salom, men Pandoo!</h4>
                <p className="text-sm text-emerald-200/80 max-w-md mx-auto">
                  Men sening shaxsiy AI mentoring. Mavzu tanla, men senga tushuntiraman, keyin test beraman va yana tushuntiraman!
                </p>
              </div>

              {externalWrong && externalWrong.length > 0 && (
                <div className="bg-emerald-900/40 border border-emerald-700/30 rounded-2xl p-4 space-y-2">
                  <p className="text-sm text-emerald-100 font-bold flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    "{testTitle}" testi natijalari
                  </p>
                  <p className="text-xs text-emerald-200/70">
                    {externalCorrect}/{externalTotal} togri ({Math.round((externalCorrect || 0) / (externalTotal || 1) * 100)}%). <span className="text-amber-300">Yaxshilashga joy bor!</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topics.map((t) => (
                      <span key={t} className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">{TOPIC_LABELS[t] || t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOPIC_LIST.map((k) => (
                  <button
                    key={k}
                    onClick={() => startTeaching(k)}
                    className="p-3.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/40 hover:border-emerald-600/50 rounded-2xl text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xl">{TOPIC_ICONS[k]}</span>
                    <p className="text-xs font-bold text-white mt-1.5 leading-tight group-hover:text-emerald-300 transition-colors">{TOPIC_LABELS[k]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TEACH stage */}
          {stage === 'teach' && teachingPages.length > 0 && (
            <div className="space-y-5 py-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <BookOpen className="w-5 h-5" />
                <h4 className="text-sm font-black text-white uppercase tracking-wide">Tushuntirish</h4>
              </div>

              <div className="min-h-[300px] flex flex-col">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      {teachingPages[currentTeachingPage]?.title}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto">
                      {currentTeachingPage + 1} / {teachingPages.length}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-emerald-50 leading-relaxed whitespace-pre-line font-medium">
                    {teachingPages[currentTeachingPage]?.content}
                  </p>
                </div>

                {currentTeachingPage === 2 && (
                  <div className="mt-4 bg-amber-500/10 border border-amber-600/30 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-amber-200 font-medium leading-relaxed">
                      {topic && TOPIC_TEACHINGS[topic]?.mnemonic}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {currentTeachingPage > 0 && (
                  <button onClick={prevTeachingPage} className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Ortga
                  </button>
                )}
                <button
                  onClick={nextTeachingPage}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {currentTeachingPage < teachingPages.length - 1 ? 'Davom etish' : 'Testga otish'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TEST stage */}
          {stage === 'test' && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Target className="w-5 h-5" />
                <h4 className="text-sm font-black text-white uppercase tracking-wide">Test</h4>
                <span className="text-xs text-slate-400 ml-auto">{quizQuestions.length} ta savol</span>
              </div>

              <div className="space-y-3">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className={`rounded-2xl p-4 sm:p-5 border transition-all ${submitted ? (userAnswers[idx] === q.correct ? 'bg-emerald-900/20 border-emerald-600/30' : 'bg-rose-900/20 border-rose-600/30') : 'bg-slate-800/40 border-slate-700/40'}`}>
                    <p className="text-xs sm:text-sm font-bold text-white mb-3 leading-relaxed">
                      {idx + 1}. {q.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const selected = userAnswers[idx] === oi;
                        const isCorrect = submitted && q.correct === oi;
                        const isWrong = submitted && selected && q.correct !== oi;
                        return (
                          <button
                            key={oi}
                            onClick={() => handleAnswer(idx, oi)}
                            disabled={submitted}
                            className={`text-left p-3 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2.5 ${
                              submitted
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                                  : isWrong
                                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                                    : 'bg-slate-800/30 border-slate-700/30 text-slate-400'
                                : selected
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                                  : 'bg-slate-800/30 border-slate-700/30 text-slate-300 hover:border-slate-500/50'
                            }`}
                          >
                            {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {submitted && isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length < quizQuestions.length}
                  className={`w-full py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
                    Object.keys(userAnswers).length >= quizQuestions.length
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 cursor-pointer'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" /> Natijani tekshirish
                </button>
              ) : null}
            </div>
          )}

          {/* RESULT stage */}
          {stage === 'test' && submitted && result && (
            <div className="space-y-4 py-2 border-t border-slate-700/50 pt-4">
              <div className={`p-4 sm:p-6 rounded-2xl text-center ${result.passed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                {result.passed ? (
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                ) : (
                  <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                )}
                <h4 className="text-lg font-black text-white">
                  {result.passed ? 'Tabriklayman! Mavzuni o\'zlashtirding!' : 'Hech qanday muammo emas!'}
                </h4>
                <p className="text-sm text-slate-300 mt-1 font-medium">
                  {result.correct} / {result.total} togri ({Math.round(result.pct)}%)
                </p>
                {result.earnedXp > 0 && (
                  <p className="text-xs text-amber-400 font-black mt-2">+{result.earnedXp} XP</p>
                )}
              </div>

              {/* Wrong answer explanations */}
              {wrongExplanations.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-rose-400 uppercase tracking-wide flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Xatolar tahlili
                  </h5>
                  {wrongExplanations.map((w, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-bold text-white leading-relaxed">{w.question}</p>
                      <div className="flex items-start gap-2 text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-slate-400">Sen: <span className="text-rose-300 font-bold">{w.options[w.userAnswer] || '?'}</span></span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-400">Togri: <span className="text-emerald-300 font-bold">{w.options[w.correct]}</span></span>
                      </div>

                      <div className="bg-emerald-900/20 border border-emerald-700/20 rounded-xl p-3 flex items-start gap-2 mt-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                          {topic && TOPIC_TEACHINGS[topic]
                            ? TOPIC_TEACHINGS[topic].example.split('\n')[0]
                            : `Bu savol "${w.explanation}" mavzusiga tegishli. Qayta organib korganing maqbul.`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={handleRestart} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Qayta urinish
                </button>
                <button onClick={handleFinish} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-sm font-black transition-all cursor-pointer">
                  {standalone ? 'Boshqa mavzu' : 'Yopish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
