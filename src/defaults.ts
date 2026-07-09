import type { Task, Habit, Exam, Course, Group, ConsultationSession, LmsCertificate, PortfolioData, Post, LeaderboardEntry, EventItem, Badge } from './types';

export const DEFAULT_TASKS: Task[] = [
  { id: "t1", title: "SAT Matematikadan 20 ta savol yechish", category: "O'qish", completed: false, xpReward: 50, coinReward: 10 },
  { id: "t2", title: "Ingliz tilida 1 soat insho yozish (IELTS Essay)", category: "O'qish", completed: false, xpReward: 60, coinReward: 15 },
  { id: "t3", title: "30 daqiqa yugurish yoki kardio mashqlar", category: "Sog'liq", completed: true, xpReward: 40, coinReward: 8 },
  { id: "t4", title: "Deep Work: Portfolioga yangi loyiha qo'shish", category: "Intizom", completed: false, xpReward: 80, coinReward: 20 },
  { id: "t5", title: "10 sahifa badiiy yoki ilmiy kitob o'qish", category: "Ijodiy", completed: false, xpReward: 30, coinReward: 5 },
];

export const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "Suv ichish", category: "water", icon: "Droplet", currentValue: 0, targetValue: 2500, unit: "ml", streak: 0, history: {} },
  { id: "h2", name: "Kitob o'qish", category: "reading", icon: "Book", currentValue: 0, targetValue: 30, unit: "sahifa", streak: 0, history: {} },
  { id: "h3", name: "Mashg'ulot (Sport)", category: "workout", icon: "Dumbbell", currentValue: 0, targetValue: 45, unit: "daqiqa", streak: 0, history: {} },
  { id: "h4", name: "Meditatsiya", category: "meditation", icon: "Wind", currentValue: 0, targetValue: 10, unit: "daqiqa", streak: 0, history: {} },
  { id: "h5", name: "Dasturlash (Kodlash)", category: "coding", icon: "Code", currentValue: 0, targetValue: 120, unit: "daqiqa", streak: 0, history: {} },
  { id: "h6", name: "Sog'lom uyqu", category: "sleep", icon: "Moon", currentValue: 0, targetValue: 8, unit: "soat", streak: 0, history: {} },
];

export const DEFAULT_EXAMS: Exam[] = [
  { id: "e1", name: "IELTS Rasmiy Imtihoni", date: "2026-08-15", type: "IELTS", targetScore: "8.0", currentScore: "" },
  { id: "e2", name: "SAT Testi (Digital)", date: "2026-10-05", type: "SAT", targetScore: "1550", currentScore: "" },
  { id: "e3", name: "Milliy Sertifikat: Matematika", date: "2026-09-20", type: "Milliy", subject: "Matematika", targetScore: "A+" },
];

export const DEFAULT_COURSES: Course[] = [
  { id: "c1", title: "Frontend Dasturlash (React & Next.js)", description: "Zamonaviy veb-ilovalarni yaratishni amaliyotda o'rganing.", teacherName: "Boburjon G'ulomov", priceCoins: 120, priceMoney: 500000, enrolled: false, duration: "3 oy (24 dars)", lessonsCount: 24, rating: 4.9, ratingCount: 142, category: "Dasturlash", color: "indigo" },
  { id: "c2", title: "Ingliz Tili: IELTS Prep (A1 dan B2)", description: "IELTS imtihoniga mukammal tayyorgarlik kursi.", teacherName: "Shahnoza Tursunaliyeva", priceCoins: 80, priceMoney: 350000, enrolled: true, duration: "2 oy (16 dars)", lessonsCount: 16, rating: 4.8, ratingCount: 96, category: "Xorijiy tillar", color: "emerald" },
  { id: "c3", title: "Python va Sun'iy Intellekt Asoslari", description: "Python dasturlash tili asoslari, ma'lumotlar tahlili.", teacherName: "Sardorbek Kobilov", priceCoins: 100, priceMoney: 450000, enrolled: false, duration: "3 oy (20 dars)", lessonsCount: 20, rating: 4.7, ratingCount: 88, category: "Dasturlash", color: "amber" },
  { id: "c4", title: "UI/UX Dizayn & Figma Professional", description: "Figma asbobida professional interfeyslar chizishni o'rganing.", teacherName: "Munira Salixova", priceCoins: 90, priceMoney: 400000, enrolled: false, duration: "2 oy (12 dars)", lessonsCount: 12, rating: 4.9, ratingCount: 75, category: "Dizayn", color: "rose" },
];

export const DEFAULT_GROUPS: Group[] = [
  {
    id: "g2", name: "IELTS Prep Alpha Group", teacherName: "Shahnoza Tursunaliyeva",
    courseTitle: "Ingliz Tili: IELTS Prep (A1 dan B2)", courseId: "c2",
    studentsCount: 1, students: ["Biloliddin Akramov"], pendingStudents: ["Biloliddin Akramov"], courseDays: [], courseTime: "",
    rating: 4.8, progress: 0,
    lessons: [
      { id: "l2-1", title: "IELTS imtihon formati va Listening strategiyalari", duration: "1 soat 15 daqiqa", date: "2026-07-01", completed: false },
      { id: "l2-2", title: "Skimming & Scanning in Reading Section", duration: "1 soat 30 daqiqa", date: "2026-07-04", completed: false },
      { id: "l2-3", title: "Writing Task 1: Line Graph va Bar Charts tahlili", duration: "1 soat 10 daqiqa", date: "2026-07-06", completed: false },
      { id: "l2-4", title: "Speaking Part 2: Cue Card bo'yicha gapirish metodikasi", duration: "58 daqiqa", date: "2026-07-09", completed: false },
    ],
    homeworks: [
      { id: "hw2-1", title: "Listening Mock Section 1 & 2", deadline: "2026-07-03", status: "pending" as const },
      { id: "hw2-2", title: "Line Graph Analysis Essay yozish", deadline: "2026-07-08", status: "pending" as const },
      { id: "hw2-3", title: "Vocabulary List (Topic: Environment) yozib yuklash", deadline: "2026-07-12", status: "pending" as const },
    ],
    quizzes: [
      { id: "qz2-1", title: "IELTS Vocabulary Quiz (Level: B2)", questionsCount: 10, completed: false, category: "Guruh" },
      { id: "qz2-2", title: "Grammar: Mixed Tenses", questionsCount: 15, completed: false, category: "Ochiq" },
    ],
    tests: [
      { id: "t2-1", title: "Choraklik IELTS Reading & Listening To'liq Test", duration: "2 soat 40 daqiqa", completed: false, category: "Amaliy" },
      { id: "t2-2", title: "Speaking Mock Test (Teacher bilan live)", duration: "15 daqiqa", completed: false, category: "Yakuniy" },
    ],
    announcements: [],
    files: [
      { id: "f2-1", name: "IELTS_Writing_Task1_Template.docx", size: "245 KB", type: "DOCX" },
      { id: "f2-2", name: "Cambridge_IELTS_18_Academic.pdf", size: "18.4 MB", type: "PDF" },
      { id: "f2-3", name: "Speaking_Topic_Vocabulary_B2.pdf", size: "840 KB", type: "PDF" },
    ],
  },
  {
    id: "g1", name: "React & Next.js Developers Team", teacherName: "Boburjon G'ulomov",
    courseTitle: "Frontend Dasturlash (React & Next.js)", courseId: "c1",
    studentsCount: 0, students: [], pendingStudents: [], courseDays: [], courseTime: "",
    rating: 4.9, progress: 0,
    lessons: [
      { id: "l1-1", title: "JavaScript ES6+ yangi imkoniyatlari va asinxronlik", duration: "1 soat 10 daqiqa", date: "2026-07-02", completed: false },
      { id: "l1-2", title: "React Hooks (useState, useEffect, useRef)", duration: "1 soat 45 daqiqa", date: "2026-07-05", completed: false },
      { id: "l1-3", title: "Tailwind CSS va Responsive Web Design", duration: "1 soat 20 daqiqa", date: "2026-07-08", completed: false },
    ],
    homeworks: [
      { id: "hw1-1", title: "ES6+ metodlariga oid 15 ta amaliy masala", deadline: "2026-07-04", status: "pending" as const },
      { id: "hw1-2", title: "React loyihasi: Ob-havo vidjetini yaratish", deadline: "2026-07-09", status: "pending" as const },
    ],
    quizzes: [
      { id: "qz1-1", title: "React State Lifecycle Quiz", questionsCount: 5, completed: false, category: "Guruh" },
      { id: "qz1-2", title: "CSS Flexbox vs Grid Quiz", questionsCount: 10, completed: false, category: "Ochiq" },
    ],
    tests: [
      { id: "t1-1", title: "JavaScript Core Concepts Test", duration: "1 soat", completed: false, category: "Amaliy" },
    ],
    announcements: [],
    files: [
      { id: "f1-1", name: "React_Lifecycle_CheatSheet.png", size: "512 KB", type: "PNG" },
      { id: "f1-2", name: "Tailwind_Custom_Configuration_Guide.pdf", size: "1.1 MB", type: "PDF" },
    ],
  },
  {
    id: "g3", name: "Python AI & Machine Learning Guild", teacherName: "Sardorbek Kobilov",
    courseTitle: "Python va Sun'iy Intellekt Asoslari", courseId: "c3",
    studentsCount: 0, students: [], pendingStudents: [], courseDays: [], courseTime: "",
    rating: 4.7, progress: 0,
    lessons: [
      { id: "l3-1", title: "Python tili sintaksisi va Ma'lumot turlari", duration: "1 soat", date: "2026-07-03", completed: false },
      { id: "l3-2", title: "OOP (Obyektga yo'naltirilgan dasturlash) Python da", duration: "1 soat 30 daqiqa", date: "2026-07-07", completed: false },
    ],
    homeworks: [
      { id: "hw3-1", title: "Matematik funktsiyalarni klass orqali tuzish", deadline: "2026-07-06", status: "pending" as const },
      { id: "hw3-2", title: "Web Scraping: Beautiful Soup yordamida ma'lumot olish", deadline: "2026-07-11", status: "pending" as const },
    ],
    quizzes: [
      { id: "qz3-1", title: "Python List Comprehension & Lambdas", questionsCount: 10, completed: false, category: "Ochiq" },
    ],
    tests: [
      { id: "t3-1", title: "Python OOP & Algorithms Big Test", duration: "1.5 soat", completed: false, category: "Yakuniy" },
    ],
    announcements: [],
    files: [
      { id: "f3-1", name: "NumPy_Commands_Reference.pdf", size: "1.5 MB", type: "PDF" },
    ],
  },
];

export const DEFAULT_CONSULTATIONS: ConsultationSession[] = [
  { id: "con1", mentorName: "Zilola Karimova", role: "AQSH Universitetlariga hujjat topshirish bo'yicha Ekspert (Columbia Grad)", time: "Huquqiy va iqtisodiy grantlar bo'yicha maslahat — Bugun, 16:30", type: "Video dars", status: "confirmed" },
  { id: "con2", mentorName: "Nodirbek Alisherov", role: "Akademik Maslahatchi & IELTS Murabbiyi", time: "Insholarni tahlil qilish va Speaking darajasini tekshirish — Ertaga, 11:00", type: "Uchrashuv", status: "pending" },
];

export const DEFAULT_CERTIFICATES: LmsCertificate[] = [];

export const DEFAULT_POSTS: Post[] = [
  { id: "p1", title: "SAT Reading qismidan balni 600 dan 720 ga qanday oshirdim?", content: "Do'stlar, SAT Reading qiyin kechayotgan bo'lsa, eng muhim narsa - har kuni xatolar tahlilini qilish.", author: "Jaloliddin Rustamov", tag: "SAT", likes: 45, replies: 12, createdAt: "Kecha" },
  { id: "p2", title: "GKS Grantiga topshirishda common xatolar", content: "Personal Statement yozishda ko'p talabalar faqat o'z qiyinchiliklarini yozadi.", author: "Munira Salixova", tag: "Grantlar", likes: 88, replies: 24, createdAt: "2 kun oldin" },
];

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: "Sardorbek Kobilov", school: "Toshkent Prezident Maktabi", grade: "11-sinf", xp: 3240, streak: 25 },
  { name: "Bekhruzbek Marufjonov", school: "Toshkent Prezident Maktabi", grade: "11-sinf", xp: 2950, streak: 15 },
  { name: "Sevinch Abduvaliyeva", school: "Samarkand Prezident Maktabi", grade: "10-sinf", xp: 2810, streak: 12 },
  { name: "Asadbek Rahmatov", school: "Namangan PM", grade: "11-sinf", xp: 2600, streak: 8 },
];

export const DEFAULT_EVENTS: EventItem[] = [
  { id: "e1", title: "GKS 2027: Janubiy Koreyada to'liq grant asosida bakalavr o'qish sirlari", description: "Ushbu vebinarda GKS granti g'olibi bo'lgan talabamiz o'zining shaxsiy tajribalari haqida gapirib beradi.", speaker: "Dilshoda Mahmudova", date: "15-Iyul, 2026", time: "18:00" },
  { id: "e2", title: "Ivy League va MIT: 100% lik moliyaviy yordamni qanday yutish mumkin?", description: "AQSHning eng nufuzli universitetlariga bepul kirish va o'qish xarajatlarini to'liq qoplash bo'yicha mufassal yo'riqnoma.", speaker: "Zilola Karimova", date: "20-Iyul, 2026", time: "20:00" },
];

export const DEFAULT_PORTFOLIO: PortfolioData = {
  fullName: "", bio: "",
  education: { school: "", grade: "", gpa: "" },
  satScore: "", ieltsScore: "",
  nationalCertificates: [], olympiads: [], awards: [], projects: [],
  volunteering: [], skills: [], languages: [],
};

export const DEFAULT_BADGES: Badge[] = [
  { id: "b1", name: "Intizom Temuriysi", description: "Barcha kunlik odatlarni 7 kun davomida to'liq bajarish", icon: "Shield", unlocked: false },
  { id: "b2", name: "SAT Chempioni", description: "SAT savollar bankidan kamida 100 ta savolga to'g'ri javob berish", icon: "Award", unlocked: false },
  { id: "b3", name: "Hamjamiyat Yetakchisi", description: "Forumda 5 tadan ortiq post yozish va 20 ta layk yig'ish", icon: "Users", unlocked: false },
  { id: "b4", name: "Kitob Shaydosi", description: "Kitob o'qish odatini 100% bajarib, 30 kundan ko'proq streak yig'ish", icon: "BookOpen", unlocked: false },
  { id: "b5", name: "AI Do'sti", description: "AI Yordamchi bilan 10 marta suhbatlashish va tahlil olish", icon: "Cpu", unlocked: false },
];
