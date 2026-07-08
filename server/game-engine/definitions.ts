import type { AchievementDef, QuestDef, TitleDef } from './types.js';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_steps', name: 'Birinchi Qadamlar', description: 'Jami 500 XP to\'plang',
    icon: 'Footprints', category: 'progress', rarity: 'common',
    condition: { type: 'xp_total', threshold: 500 },
    rewardXp: 100, rewardCoins: 15,
  },
  {
    id: 'rising_star', name: 'Yuksalayotgan Yulduz', description: '5-darajaga yeting',
    icon: 'Star', category: 'progress', rarity: 'uncommon',
    condition: { type: 'xp_level', threshold: 5 },
    rewardXp: 250, rewardCoins: 30,
  },
  {
    id: 'xp_hunter', name: 'XP Ovchisi', description: 'Jami 5000 XP to\'plang',
    icon: 'Zap', category: 'progress', rarity: 'rare',
    condition: { type: 'xp_total', threshold: 5000 },
    rewardXp: 500, rewardCoins: 75,
  },
  {
    id: 'xp_legend', name: 'XP Legendasi', description: 'Jami 25000 XP to\'plang',
    icon: 'Award', category: 'progress', rarity: 'epic',
    condition: { type: 'xp_total', threshold: 25000 },
    rewardXp: 1500, rewardCoins: 200,
  },
  {
    id: 'streak_7', name: 'Hafta Intizomi', description: '7 kunlik streak-ga erishing',
    icon: 'Flame', category: 'progress', rarity: 'uncommon',
    condition: { type: 'streak_days', threshold: 7 },
    rewardXp: 200, rewardCoins: 25,
  },
  {
    id: 'streak_30', name: 'Oy Intizomi', description: '30 kunlik streak-ga erishing',
    icon: 'Flame', category: 'progress', rarity: 'epic',
    condition: { type: 'streak_days', threshold: 30 },
    rewardXp: 1000, rewardCoins: 150,
  },
  {
    id: 'quiz_master', name: 'Quiz Ustasi', description: '10 ta quizni muvaffaqiyatli topshiring',
    icon: 'FileQuestion', category: 'skill', rarity: 'rare',
    condition: { type: 'quizzes_passed', threshold: 10 },
    rewardXp: 400, rewardCoins: 50,
  },
  {
    id: 'test_champion', name: 'Test Chempioni', description: '5 ta testni muvaffaqiyatli topshiring',
    icon: 'ClipboardCheck', category: 'skill', rarity: 'rare',
    condition: { type: 'tests_passed', threshold: 5 },
    rewardXp: 500, rewardCoins: 60,
  },
  {
    id: 'habit_hero', name: 'Odat Qahramoni', description: '100 ta odatni belgilang',
    icon: 'CheckCircle', category: 'progress', rarity: 'uncommon',
    condition: { type: 'habits_done', threshold: 100 },
    rewardXp: 300, rewardCoins: 40,
  },
  {
    id: 'social_butterfly', name: 'Jamiyat Ruhi', description: '10 ta post yarating',
    icon: 'MessageSquare', category: 'social', rarity: 'uncommon',
    condition: { type: 'posts_created', threshold: 10 },
    rewardXp: 200, rewardCoins: 30,
  },
  {
    id: 'course_graduate', name: 'Kurs Bitiruvchisi', description: '3 ta kursni tugating',
    icon: 'GraduationCap', category: 'skill', rarity: 'rare',
    condition: { type: 'courses_completed', threshold: 3 },
    rewardXp: 600, rewardCoins: 100,
  },
  {
    id: 'focus_pro', name: 'Diqqat Ustasi', description: '50 ta Pomodoro sessiyasini yakunlang',
    icon: 'Timer', category: 'skill', rarity: 'epic',
    condition: { type: 'pomodoros_done', threshold: 50 },
    rewardXp: 800, rewardCoins: 120,
  },
  {
    id: 'ai_companion', name: 'AI Hamroh', description: 'AI bilan 30 marta suhbatlashing',
    icon: 'Cpu', category: 'special', rarity: 'uncommon',
    condition: { type: 'ai_chats', threshold: 30 },
    rewardXp: 250, rewardCoins: 35,
  },
  {
    id: 'consultant', name: 'Maslahat Izlovchi', description: '5 ta konsultatsiya bron qiling',
    icon: 'UserCheck', category: 'social', rarity: 'rare',
    condition: { type: 'consultations', threshold: 5 },
    rewardXp: 350, rewardCoins: 50,
  },
  {
    id: 'team_player', name: 'Jamoa O\'yinchisi', description: '5 ta guruhga qo\'shiling',
    icon: 'Users', category: 'social', rarity: 'uncommon',
    condition: { type: 'groups_joined', threshold: 5 },
    rewardXp: 200, rewardCoins: 25,
  },
];

export const QUESTS: QuestDef[] = [
  {
    id: 'daily_xp', title: 'Kunlik XP', description: 'Bugun 200 XP to\'plang',
    type: 'daily', condition: { type: 'xp_earn', threshold: 200 },
    rewardXp: 50, rewardCoins: 10, expiresInHours: 24,
  },
  {
    id: 'daily_habit', title: 'Kunlik Odat', description: '3 ta odatni belgilang',
    type: 'daily', condition: { type: 'habit_done', threshold: 3 },
    rewardXp: 30, rewardCoins: 5, expiresInHours: 24,
  },
  {
    id: 'daily_pomodoro', title: 'Fokus Vaqti', description: '1 ta Pomodoro yakunlang',
    type: 'daily', condition: { type: 'pomodoro', threshold: 1 },
    rewardXp: 40, rewardCoins: 8, expiresInHours: 24,
  },
  {
    id: 'daily_quiz', title: 'Kunlik Mashq', description: '1 ta quizni ishlang',
    type: 'daily', condition: { type: 'quiz_pass', threshold: 1 },
    rewardXp: 35, rewardCoins: 5, expiresInHours: 24,
  },
  {
    id: 'weekly_xp', title: 'Haftalik XP', description: 'Bu hafta 2000 XP to\'plang',
    type: 'weekly', condition: { type: 'xp_earn', threshold: 2000 },
    rewardXp: 300, rewardCoins: 50, expiresInHours: 168,
  },
  {
    id: 'weekly_habits', title: 'Haftalik Intizom', description: '20 ta odatni belgilang',
    type: 'weekly', condition: { type: 'habit_done', threshold: 20 },
    rewardXp: 200, rewardCoins: 30, expiresInHours: 168,
  },
  {
    id: 'weekly_lessons', title: 'Haftalik Darslar', description: '5 ta darsni yakunlang',
    type: 'weekly', condition: { type: 'lesson_finish', threshold: 5 },
    rewardXp: 250, rewardCoins: 40, expiresInHours: 168,
  },
  {
    id: 'weekly_streak', title: 'Haftalik Streak', description: '7 kun ketma-ket odat belgilang',
    type: 'weekly', condition: { type: 'streak_maintain', threshold: 7 },
    rewardXp: 400, rewardCoins: 60, expiresInHours: 168,
  },
];

export const TITLES: TitleDef[] = [
  { id: 't_newbie', name: 'Yangi Boshlovchi', description: '1-darajaga yeting', tier: 1, icon: 'Seedling', condition: { type: 'xp_level', threshold: 1 } },
  { id: 't_learner', name: 'O\'rganuvchi', description: '3-darajaga yeting', tier: 1, icon: 'BookOpen', condition: { type: 'xp_level', threshold: 3 } },
  { id: 't_dedicated', name: 'Tirishqoq', description: '5-darajaga yeting', tier: 2, icon: 'Flame', condition: { type: 'xp_level', threshold: 5 } },
  { id: 't_scholar', name: 'Bilimdon', description: '10-darajaga yeting', tier: 2, icon: 'GraduationCap', condition: { type: 'xp_level', threshold: 10 } },
  { id: 't_expert', name: 'Mutaxassis', description: '15-darajaga yeting', tier: 3, icon: 'Award', condition: { type: 'xp_level', threshold: 15 } },
  { id: 't_master', name: 'Usta', description: '20-darajaga yeting', tier: 3, icon: 'Trophy', condition: { type: 'xp_level', threshold: 20 } },
  { id: 't_legend', name: 'Afsona', description: '25-darajaga yeting', tier: 4, icon: 'Crown', condition: { type: 'xp_level', threshold: 25 } },
  { id: 't_achiever', name: 'Yutuqchi', description: '5 ta yutuqni oching', tier: 2, icon: 'Target', condition: { type: 'achievements_unlocked', threshold: 5 } },
  { id: 't_quest_master', name: 'Vazifa Ustasi', description: '20 ta vazifani bajaring', tier: 3, icon: 'ClipboardList', condition: { type: 'quests_completed', threshold: 20 } },
  { id: 't_iron_will', name: 'Temir Iroda', description: '30 kunlik streak rekordi', tier: 4, icon: 'Shield', condition: { type: 'streak_record', threshold: 30 } },
  { id: 't_grandmaster', name: 'Grossmeyster', description: '30-darajaga yeting', tier: 5, icon: 'Star', condition: { type: 'xp_level', threshold: 30 } },
  { id: 't_immortal', name: 'Boqiy', description: '50-darajaga yeting', tier: 5, icon: 'Infinity', condition: { type: 'xp_level', threshold: 50 } },
];
