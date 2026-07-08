import { Router, Response } from 'express';
import { authMiddleware, AuthedRequest } from '../auth.js';
import db from '../db.js';
import { loadState, saveState, handleReward } from '../engine.js';
import {
  createDefaultProfile, extractProfile, checkAchievements,
  generateDailyQuests, checkTitleUnlocks, updateQuestProgress,
  calculateSeasonPass,
} from './engine.js';
import { ACHIEVEMENTS, QUESTS, TITLES } from './definitions.js';
import type { AchievementDef, QuestDef, TitleDef, UserQuest, GameProfile } from './types.js';

const router = Router();

async function loadProfile(userId: number): Promise<GameProfile> {
  const state = await loadState(userId);
  let profile = extractProfile(state);
  profile.quests = generateDailyQuests(profile.quests);
  return profile;
}

async function saveProfile(userId: number, profile: GameProfile) {
  const state = await loadState(userId);
  state.titles = profile.titles;
  state.quests = profile.quests;
  state.achievementsUnlocked = profile.achievementsUnlocked;
  state.totalQuestsCompleted = profile.totalQuestsCompleted;
  state.bestStreak = profile.bestStreak;
  state.pomodorosDone = profile.pomodorosDone;
  state.aiChats = profile.aiChats;
  state.lessonsFinished = profile.lessonsFinished;
  state.quizzesPassed = profile.quizzesPassed;
  state.testsPassed = profile.testsPassed;
  state.habitsDone = profile.habitsDone;
  state.postsCreated = profile.postsCreated;
  state.coursesCompleted = profile.coursesCompleted;
  state.consultationsBooked = profile.consultationsBooked;
  state.groupsJoined = profile.groupsJoined;
  await saveState(userId, state);
}

async function syncProfile(userId: number): Promise<{ profile: GameProfile; state: any; newAchievements: AchievementDef[]; newTitles: TitleDef[] }> {
  const state = await loadState(userId);
  let profile = extractProfile(state);
  profile.quests = generateDailyQuests(profile.quests);

  const { newlyUnlocked, totalRewardXp, totalRewardCoins } = checkAchievements(profile, state);
  const newTitles = checkTitleUnlocks(profile, state);

  if (newlyUnlocked.length > 0) {
    for (const ach of newlyUnlocked) {
      profile.achievementsUnlocked.push(ach.id);
      state.xp += ach.rewardXp;
      state.coins += ach.rewardCoins;
    }
    state.level = Math.max(1, Math.floor(state.xp / 1000) + 1);
  }

  if (newTitles.length > 0) {
    for (const t of newTitles) {
      const idx = profile.titles.findIndex(pt => pt.titleId === t.id);
      if (idx >= 0) {
        profile.titles[idx].unlocked = true;
        profile.titles[idx].unlockedAt = new Date().toISOString();
      }
    }
  }

  const { level: spLevel, seasonXp } = calculateSeasonPass(state.xp);
  profile.seasonPassLevel = spLevel;
  profile.seasonPassXp = seasonXp;

  state.titles = profile.titles;
  state.quests = profile.quests;
  state.achievementsUnlocked = profile.achievementsUnlocked;
  state.totalQuestsCompleted = profile.totalQuestsCompleted;
  state.seasonPassLevel = spLevel;
  state.seasonPassXp = seasonXp;

  await saveState(userId, state);
  return { profile, state, newAchievements: newlyUnlocked, newTitles };
}

// GET /api/game/profile
router.get('/profile', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const result = await syncProfile(req.userId!);
    res.json({
      profile: result.profile,
      achievements: ACHIEVEMENTS,
      quests: QUESTS,
      titles: TITLES,
      newAchievements: result.newAchievements,
      newTitles: result.newTitles,
    });
  } catch (err) {
    res.status(500).json({ error: 'Game profilini yuklashda xatolik.' });
  }
});

// POST /api/game/quest-progress
router.post('/quest-progress', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const { eventType, amount } = req.body;
    if (!eventType || typeof amount !== 'number') {
      return res.status(400).json({ error: 'eventType va amount talab qilinadi.' });
    }

    const state = await loadState(req.userId!);
    let profile = extractProfile(state);
    profile.quests = generateDailyQuests(profile.quests);

    const { updatedQuests, completedIds } = updateQuestProgress(profile, eventType, amount);
    profile.quests = updatedQuests;
    profile.totalQuestsCompleted += completedIds.length;

    for (const cId of completedIds) {
      const def = QUESTS.find(q => q.id === cId);
      if (def) {
        state.xp += def.rewardXp;
        state.coins += def.rewardCoins;
      }
    }

    state.level = Math.max(1, Math.floor(state.xp / 1000) + 1);
    state.quests = profile.quests;
    state.totalQuestsCompleted = profile.totalQuestsCompleted;
    await saveState(req.userId!, state);

    res.json({
      ok: true,
      quests: profile.quests,
      completedQuests: completedIds,
      totalXp: state.xp,
      totalCoins: state.coins,
      level: state.level,
    });
  } catch (err) {
    res.status(500).json({ error: 'Quest progress yangilashda xatolik.' });
  }
});

// POST /api/game/claim-quest
router.post('/claim-quest', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const { questId } = req.body;
    if (!questId) return res.status(400).json({ error: 'questId talab qilinadi.' });

    const state = await loadState(req.userId!);
    let profile = extractProfile(state);
    profile.quests = generateDailyQuests(profile.quests);

    const quest = profile.quests.find(q => q.questId === questId);
    if (!quest) return res.status(404).json({ error: 'Quest topilmadi.' });
    if (!quest.completed) return res.status(400).json({ error: 'Quest hali bajarilmagan.' });
    if (quest.claimed) return res.status(400).json({ error: 'Quest allaqachon olingan.' });

    quest.claimed = true;
    state.quests = profile.quests;
    await saveState(req.userId!, state);

    res.json({ ok: true, quest });
  } catch (err) {
    res.status(500).json({ error: 'Quest olishda xatolik.' });
  }
});

// POST /api/game/earn
router.post('/earn', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const { counterType, amount } = req.body;
    if (!counterType || !amount) {
      return res.status(400).json({ error: 'counterType va amount talab qilinadi.' });
    }

    const state = await loadState(req.userId!);
    const validCounters = [
      'pomodorosDone', 'aiChats', 'lessonsFinished', 'quizzesPassed',
      'testsPassed', 'habitsDone', 'postsCreated', 'coursesCompleted',
      'consultationsBooked', 'groupsJoined',
    ];

    if (validCounters.includes(counterType)) {
      state[counterType] = (state[counterType] || 0) + amount;
    }

    if (counterType === 'xp_earn') {
      state.questDailyXp = (state.questDailyXp || 0) + amount;
      state.questWeeklyXp = (state.questWeeklyXp || 0) + amount;
    }

    const { updatedQuests } = updateQuestProgress(extractProfile(state), counterType, amount);
    state.quests = updatedQuests;

    await saveState(req.userId!, state);

    const result = await syncProfile(req.userId!);
    res.json({
      ok: true,
      profile: result.profile,
      newAchievements: result.newAchievements,
      newTitles: result.newTitles,
    });
  } catch (err) {
    res.status(500).json({ error: 'Game statistikasini yangilashda xatolik.' });
  }
});

// POST /api/game/equip-title
router.post('/equip-title', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const { titleId } = req.body;
    if (!titleId) return res.status(400).json({ error: 'titleId talab qilinadi.' });

    const state = await loadState(req.userId!);
    let profile = extractProfile(state);

    profile.titles = profile.titles.map(t => ({
      ...t,
      equipped: t.titleId === titleId ? true : false,
    }));

    state.titles = profile.titles;
    await saveState(req.userId!, state);

    res.json({ ok: true, titles: profile.titles });
  } catch (err) {
    res.status(500).json({ error: 'Title tanlashda xatolik.' });
  }
});

// GET /api/game/leaderboard
router.get('/leaderboard', authMiddleware, async (req: AuthedRequest, res: Response) => {
  try {
    const rows = await db.all(
      `SELECT u.name, u.email, us.state
       FROM users u
       JOIN user_state us ON us.user_id = u.id
       ORDER BY (us.state->>'xp')::int DESC
       LIMIT 50`
    );

    const leaderboard = rows.map((row: any, i: number) => {
      const s = typeof row.state === 'string' ? JSON.parse(row.state) : row.state;
      return {
        rank: i + 1,
        name: row.name,
        xp: s.xp || 0,
        level: s.level || 1,
        coins: s.coins || 0,
        achievements: (s.achievementsUnlocked || []).length,
      };
    });

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: 'Leaderboard yuklashda xatolik.' });
  }
});

export default router;
