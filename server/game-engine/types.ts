export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'social' | 'skill' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'xp_total' | 'xp_level' | 'streak_days' | 'quizzes_passed' | 'tests_passed'
        | 'habits_done' | 'posts_created' | 'courses_completed' | 'pomodoros_done'
        | 'ai_chats' | 'consultations' | 'groups_joined';
    threshold: number;
  };
  rewardXp: number;
  rewardCoins: number;
}

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  condition: {
    type: 'xp_earn' | 'habit_done' | 'quiz_pass' | 'pomodoro' | 'post_create'
        | 'lesson_finish' | 'ai_chat' | 'streak_maintain';
    threshold: number;
  };
  rewardXp: number;
  rewardCoins: number;
  expiresInHours: number;
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
  tier: 1 | 2 | 3 | 4 | 5;
  icon: string;
  condition: {
    type: 'xp_level' | 'achievements_unlocked' | 'quests_completed' | 'streak_record';
    threshold: number;
  };
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
  pomodorosDone: number;
  aiChats: number;
  lessonsFinished: number;
  quizzesPassed: number;
  testsPassed: number;
  habitsDone: number;
  postsCreated: number;
  coursesCompleted: number;
  consultationsBooked: number;
  groupsJoined: number;
  seasonPassLevel: number;
  seasonPassXp: number;
}
