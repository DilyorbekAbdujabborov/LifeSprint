import { Response } from "express";
import db from './db.js';
import { AuthedRequest } from './auth.js';

export interface UserState {
  xp: number;
  level: number;
  coins: number;
  [key: string]: any;
}

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  coins: 0,
};

export async function loadState(userId: number): Promise<UserState> {
  const row = await db.get("SELECT state FROM user_state WHERE user_id = $1", [userId]) as any;
  if (!row) return { ...DEFAULT_STATE };
  try {
    return { ...DEFAULT_STATE, ...typeof row.state === "string" ? JSON.parse(row.state) : row.state };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export async function saveState(userId: number, state: any) {
  const json = JSON.stringify(state);
  await db.run(
    `INSERT INTO user_state (user_id, state, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET state = $2, updated_at = NOW()`,
    [userId, json]
  );
}

function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

function apply(state: UserState, deltaXp: number, deltaCoins: number) {
  const newXp = Math.max(0, state.xp + deltaXp);
  const newCoins = Math.max(0, state.coins + deltaCoins);
  state.xp = newXp;
  state.coins = newCoins;
  state.level = calculateLevel(newXp);
}

export interface RewardResult {
  deltaXp: number;
  deltaCoins: number;
  totalXp: number;
  totalCoins: number;
  level: number;
}

function ok(state: UserState, deltaXp: number, deltaCoins: number): RewardResult {
  apply(state, deltaXp, deltaCoins);
  return {
    deltaXp,
    deltaCoins,
    totalXp: state.xp,
    totalCoins: state.coins,
    level: state.level,
  };
}

export async function handleReward(
  req: AuthedRequest,
  res: Response,
  action: string,
  payload: any
) {
  const userId = req.userId!;
  const state = await loadState(userId);

  let result: RewardResult;

  switch (action) {
    case 'create_consultation':
      state.consultationsBooked = (state.consultationsBooked || 0) + 1;
      result = ok(state, 10, 0);
      break;

    case 'complete_group_quiz':
      state.quizzesPassed = (state.quizzesPassed || 0) + 1;
      result = ok(state, 50, 10);
      break;

    case 'complete_group_test':
      state.testsPassed = (state.testsPassed || 0) + 1;
      result = ok(state, 100, 25);
      break;

    case 'finish_lesson':
      state.lessonsFinished = (state.lessonsFinished || 0) + 1;
      result = ok(state, 30, 5);
      break;

    case 'submit_homework':
      result = ok(state, 40, 0);
      break;

    case 'join_group':
      state.groupsJoined = (state.groupsJoined || 0) + 1;
      result = ok(state, 50, 0);
      break;

    case 'submit_homework_v2':
      result = ok(state, 45, 0);
      break;

    case 'start_video_lessons':
      result = ok(state, 20, 0);
      break;

    case 'complete_mock_full':
      result = ok(state, 2000, 100);
      break;

    case 'complete_mock_section':
      result = ok(state, 500, 25);
      break;

    case 'complete_test': {
      const { questions, userAnswers, xpReward, coinReward } = payload;
      let correct = 0;
      const total = questions ? questions.length : 0;
      if (questions && userAnswers) {
        questions.forEach((q: any, idx: number) => {
          if (userAnswers[idx] === q.correct) correct++;
        });
      }
      const pct = total > 0 ? (correct / total) * 100 : 0;
      const baseXp = xpReward || 600;
      const baseCoins = coinReward || 30;
      if (pct < 50) {
        result = ok(state, Math.round(baseXp * 0.3), Math.round(baseCoins * 0.3));
      } else {
        state.testsPassed = (state.testsPassed || 0) + 1;
        result = ok(state, baseXp, baseCoins);
      }
      break;
    }

    case 'complete_pandoo': {
      const { questions, userAnswers } = payload;
      let correct = 0;
      const total = questions ? questions.length : 0;
      if (questions && userAnswers) {
        questions.forEach((q: any, idx: number) => {
          if (userAnswers[idx] === q.correct) correct++;
        });
      }
      const pct = total > 0 ? (correct / total) * 100 : 0;
      if (pct >= 70) {
        state.testsPassed = (state.testsPassed || 0) + 1;
        result = ok(state, 300, 20);
      } else {
        result = ok(state, 100, 5);
      }
      break;
    }

    case 'pomodoro_complete':
      state.pomodorosDone = (state.pomodorosDone || 0) + 1;
      result = ok(state, 150, 0);
      break;

    case 'habit_toggle_on':
      state.habitsDone = (state.habitsDone || 0) + 1;
      result = ok(state, 15, 0);
      break;

    case 'habit_toggle_off':
      state.habitsDone = Math.max(0, (state.habitsDone || 0) - 1);
      result = ok(state, -15, 0);
      break;

    case 'create_habit':
      result = ok(state, 30, 0);
      break;

    case 'create_post':
      state.postsCreated = (state.postsCreated || 0) + 1;
      result = ok(state, 50, 0);
      break;

    case 'send_gift':
      result = ok(state, 5, 0);
      break;

    case 'purchase_course': {
      const { priceCoins } = payload;
      if (state.coins < priceCoins) {
        return res.status(400).json({ error: 'Tanga yetarli emas.', ok: false });
      }
      result = ok(state, 150, -priceCoins);
      break;
    }

    case 'grant_enrollment':
      state.coursesCompleted = (state.coursesCompleted || 0) + 1;
      result = ok(state, 100, 0);
      break;

    case 'ai_chat':
      state.aiChats = (state.aiChats || 0) + 1;
      result = ok(state, 10, 0);
      break;

    case 'generate_plan':
      result = ok(state, 100, 0);
      break;

    default:
      return res.status(400).json({ error: `Noma'lum action: ${action}` });
  }

  await saveState(userId, state);
  return res.json({ ok: true, ...result });
}
