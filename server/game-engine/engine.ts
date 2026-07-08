import type { AchievementDef, QuestDef, TitleDef, UserQuest, UserTitle, GameProfile } from './types.js';
import { ACHIEVEMENTS, QUESTS, TITLES } from './definitions.js';
import type { UserState } from '../engine.js';

export function createDefaultProfile(): GameProfile {
  return {
    titles: TITLES.map(t => ({ titleId: t.id, unlocked: false, equipped: false })),
    quests: [],
    achievementsUnlocked: [],
    totalQuestsCompleted: 0,
    bestStreak: 0,
    pomodorosDone: 0,
    aiChats: 0,
    lessonsFinished: 0,
    quizzesPassed: 0,
    testsPassed: 0,
    habitsDone: 0,
    postsCreated: 0,
    coursesCompleted: 0,
    consultationsBooked: 0,
    groupsJoined: 0,
    seasonPassLevel: 1,
    seasonPassXp: 0,
  };
}

export function extractProfile(state: UserState): GameProfile {
  return {
    titles: state.titles || createDefaultProfile().titles,
    quests: state.quests || [],
    achievementsUnlocked: state.achievementsUnlocked || [],
    totalQuestsCompleted: state.totalQuestsCompleted || 0,
    bestStreak: Math.max(state.bestStreak || 0, state.streak || 0),
    pomodorosDone: state.pomodorosDone || 0,
    aiChats: state.aiChats || 0,
    lessonsFinished: state.lessonsFinished || 0,
    quizzesPassed: state.quizzesPassed || 0,
    testsPassed: state.testsPassed || 0,
    habitsDone: state.habitsDone || 0,
    postsCreated: state.postsCreated || 0,
    coursesCompleted: state.coursesCompleted || 0,
    consultationsBooked: state.consultationsBooked || 0,
    groupsJoined: state.groupsJoined || 0,
    seasonPassLevel: state.seasonPassLevel || 1,
    seasonPassXp: state.seasonPassXp || 0,
  };
}

export function checkAchievements(
  profile: GameProfile, state: UserState
): { newlyUnlocked: AchievementDef[]; totalRewardXp: number; totalRewardCoins: number } {
  const newlyUnlocked: AchievementDef[] = [];
  let totalRewardXp = 0;
  let totalRewardCoins = 0;

  for (const ach of ACHIEVEMENTS) {
    if (profile.achievementsUnlocked.includes(ach.id)) continue;

    let met = false;
    switch (ach.condition.type) {
      case 'xp_total':
        met = state.xp >= ach.condition.threshold;
        break;
      case 'xp_level':
        met = state.level >= ach.condition.threshold;
        break;
      case 'streak_days':
        met = (profile.bestStreak) >= ach.condition.threshold;
        break;
      case 'quizzes_passed':
        met = profile.quizzesPassed >= ach.condition.threshold;
        break;
      case 'tests_passed':
        met = profile.testsPassed >= ach.condition.threshold;
        break;
      case 'habits_done':
        met = profile.habitsDone >= ach.condition.threshold;
        break;
      case 'posts_created':
        met = profile.postsCreated >= ach.condition.threshold;
        break;
      case 'courses_completed':
        met = profile.coursesCompleted >= ach.condition.threshold;
        break;
      case 'pomodoros_done':
        met = profile.pomodorosDone >= ach.condition.threshold;
        break;
      case 'ai_chats':
        met = profile.aiChats >= ach.condition.threshold;
        break;
      case 'consultations':
        met = profile.consultationsBooked >= ach.condition.threshold;
        break;
      case 'groups_joined':
        met = profile.groupsJoined >= ach.condition.threshold;
        break;
    }

    if (met) {
      newlyUnlocked.push(ach);
      totalRewardXp += ach.rewardXp;
      totalRewardCoins += ach.rewardCoins;
    }
  }

  return { newlyUnlocked, totalRewardXp, totalRewardCoins };
}

export function generateDailyQuests(existing: UserQuest[]): UserQuest[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekLater = new Date(now);
  weekLater.setDate(weekLater.getDate() + 7);

  const dailyQuests = QUESTS.filter(q => q.type === 'daily');
  const weeklyQuests = QUESTS.filter(q => q.type === 'weekly');

  const existingIds = new Set(existing.filter(q => !q.claimed).map(q => q.questId));

  const result: UserQuest[] = existing.filter(q => {
    const exp = new Date(q.expiresAt);
    return exp > now && !q.claimed;
  });

  for (const dq of dailyQuests) {
    if (!existingIds.has(dq.id) || !result.find(q => q.questId === dq.id)) {
      result.push({
        questId: dq.id,
        progress: 0,
        threshold: dq.condition.threshold,
        completed: false,
        claimed: false,
        expiresAt: tomorrow.toISOString(),
        type: 'daily',
      });
    }
  }

  for (const wq of weeklyQuests) {
    if (!existingIds.has(wq.id) || !result.find(q => q.questId === wq.id)) {
      result.push({
        questId: wq.id,
        progress: 0,
        threshold: wq.condition.threshold,
        completed: false,
        claimed: false,
        expiresAt: weekLater.toISOString(),
        type: 'weekly',
      });
    }
  }

  return result;
}

export function checkTitleUnlocks(
  profile: GameProfile, state: UserState
): TitleDef[] {
  const newlyUnlocked: TitleDef[] = [];

  for (const title of TITLES) {
    const userTitle = profile.titles.find(t => t.titleId === title.id);
    if (userTitle?.unlocked) continue;

    let met = false;
    switch (title.condition.type) {
      case 'xp_level':
        met = state.level >= title.condition.threshold;
        break;
      case 'achievements_unlocked':
        met = profile.achievementsUnlocked.length >= title.condition.threshold;
        break;
      case 'quests_completed':
        met = profile.totalQuestsCompleted >= title.condition.threshold;
        break;
      case 'streak_record':
        met = profile.bestStreak >= title.condition.threshold;
        break;
    }

    if (met) newlyUnlocked.push(title);
  }

  return newlyUnlocked;
}

export function updateQuestProgress(
  profile: GameProfile,
  eventType: QuestDef['condition']['type'],
  amount: number
): { updatedQuests: UserQuest[]; completedIds: string[] } {
  const completedIds: string[] = [];
  const updatedQuests = profile.quests.map(q => {
    const def = QUESTS.find(d => d.id === q.questId);
    if (!def || q.completed || q.claimed) return q;
    if (def.condition.type !== eventType) return q;

    const newProgress = Math.min(q.threshold, q.progress + amount);
    const completed = newProgress >= q.threshold;
    if (completed && !q.completed) completedIds.push(q.questId);
    return { ...q, progress: newProgress, completed };
  });

  return { updatedQuests, completedIds };
}

export function calculateSeasonPass(xp: number): { level: number; seasonXp: number } {
  const xpPerLevel = 2000;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const seasonXp = xp % xpPerLevel;
  return { level, seasonXp };
}
