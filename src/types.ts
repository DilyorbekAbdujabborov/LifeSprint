export interface Task {
  id: string;
  title: string;
  category: 'O\'qish' | 'Intizom' | 'Ijodiy' | 'Sog\'liq';
  completed: boolean;
  xpReward: number;
  coinReward: number;
}

export interface Habit {
  id: string;
  name: string;
  category: 'water' | 'reading' | 'workout' | 'meditation' | 'coding' | 'sleep';
  icon: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  streak: number;
  history: { [date: string]: number }; // sanaga mos qiymatlar
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  type: 'SAT' | 'IELTS' | 'Milliy';
  subject?: string;
  targetScore: string;
  currentScore?: string;
}

export interface Question {
  id: string;
  category: 'SAT' | 'IELTS' | 'Milliy';
  section: string; // Math, Reading, etc.
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  major: string[];
  ieltsMin: number;
  satMin: number;
  gpaMin: number;
  tuition: number; // yillik $ da
  acceptanceRate: number; // foizda
  scholarshipAvailable: boolean;
  image: string;
}

export interface Scholarship {
  id: string;
  title: string;
  universityId?: string;
  universityName: string;
  amount: string; // Masalan, "100% Kontrakt", "$20,000"
  deadline: string;
  requirements: string[];
}

export interface Consultant {
  id: string;
  name: string;
  role: string;
  experience: string;
  universityGraduated: string;
  rating: number;
  pricePerSession: number; // so'mda yoki $ da
  avatar: string;
  availableTimes: string[];
}

export interface PortfolioData {
  fullName: string;
  bio: string;
  education: {
    school: string;
    grade: string;
    gpa: string;
  };
  satScore: string;
  ieltsScore: string;
  nationalCertificates: { subject: string; score: string }[];
  olympiads: string[];
  awards: string[];
  projects: { title: string; description: string; link?: string }[];
  volunteering: string[];
  skills: string[];
  languages: { name: string; level: string }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  title: string;
  content: string;
  likes: number;
  repliesCount: number;
  category: 'Savol-Javob' | 'Maslahatlar' | 'Muvaffaqiyatlar' | 'Guruhlar';
  createdAt: string;
  comments: { author: string; content: string; createdAt: string }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface SeasonPassItem {
  id: string;
  level: number;
  rewardType: 'coins' | 'badge' | 'avatar_frame' | 'mystery_box';
  rewardName: string;
  isPremium: boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tag: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  name: string;
  school: string;
  grade: string;
  xp: number;
  streak: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  priceCoins: number;
  enrolled: boolean;
  duration: string;
  lessonsCount: number;
  rating: number;
  ratingCount: number;
  category: string;
  color: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  duration?: string;
  date?: string;
  completed?: boolean;
}

export interface Homework {
  id: string;
  title: string;
  deadline: string;
  status: 'completed' | 'pending' | 'missed';
  score?: number;
  submittedFile?: string;
}

export interface LmsQuiz {
  id: string;
  title: string;
  questionsCount: number;
  completed: boolean;
  score?: number;
  category?: 'Ochiq' | 'Guruh';
}

export interface LmsTest {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  score?: number;
  category: 'Yakuniy' | 'Amaliy' | 'Sertifikat';
}

export interface Announcement {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface GroupFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Group {
  id: string;
  name: string;
  teacherName: string;
  courseTitle: string;
  courseId: string;
  studentsCount: number;
  students: string[];
  pendingStudents: string[];
  courseDays: string[];
  courseTime: string;
  rating: number;
  progress: number;
  lessons: Lesson[];
  homeworks: Homework[];
  quizzes: LmsQuiz[];
  tests: LmsTest[];
  announcements: Announcement[];
  liveClass?: {
    title: string;
    time: string;
    link: string;
    isActive: boolean;
  };
  files: GroupFile[];
}

export interface ConsultationSession {
  id: string;
  mentorName: string;
  role: string;
  time: string;
  type: 'Video dars' | 'Savol-javob' | 'Uchrashuv';
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface LmsCertificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  credentialId: string;
  downloadUrl: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
}

export interface GameAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'social' | 'skill' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rewardXp: number;
  rewardCoins: number;
}

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  condition: { type: string; threshold: number };
  rewardXp: number;
  rewardCoins: number;
}

export interface UserQuest {
  questId: string;
  progress: number;
  threshold: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: string;
  type: 'daily' | 'weekly' | 'special';
}

export interface TitleDef {
  id: string;
  name: string;
  description: string;
  tier: number;
  icon: string;
  condition: { type: string; threshold: number };
}

export interface UserTitle {
  titleId: string;
  unlocked: boolean;
  unlockedAt?: string;
  equipped: boolean;
}

export interface GameProfile {
  titles: UserTitle[];
  quests: UserQuest[];
  achievementsUnlocked: string[];
  totalQuestsCompleted: number;
  bestStreak: number;
  seasonPassLevel: number;
  seasonPassXp: number;
}


