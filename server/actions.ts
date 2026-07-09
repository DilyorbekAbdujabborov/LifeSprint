import { Router, Response } from "express";
import db from './db.js';
import { authMiddleware, AuthedRequest } from './auth.js';
import { handleReward } from './engine.js';

const router = Router();

async function loadRaw(userId: number): Promise<any> {
  const row = await db.get("SELECT state FROM user_state WHERE user_id = $1", [userId]) as any;
  return row ? typeof row.state === "string" ? JSON.parse(row.state) : row.state : {};
}

async function saveRaw(userId: number, state: any) {
  const json = JSON.stringify(state);
  await db.run(
    `INSERT INTO user_state (user_id, state, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET state = $2, updated_at = NOW()`,
    [userId, json]
  );
}

router.post("/reward", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { action, payload } = req.body;
  if (!action) {
    return res.status(400).json({ error: "action talab qilinadi." });
  }
  await handleReward(req, res, action, payload || {});
});

router.post("/publish-course", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { course } = req.body;
  if (!course || !course.title) {
    return res.status(400).json({ error: "Kurs ma'lumotlari to'liq emas." });
  }
  const state = await loadRaw(req.userId!);
  const courses = state.courses || [];
  courses.unshift(course);
  state.courses = courses;
  // Enroll the publisher automatically
  const ids = state.enrolledCourseIds || [];
  if (course.id && !ids.includes(course.id)) {
    ids.push(course.id);
  }
  state.enrolledCourseIds = ids;
  await saveRaw(req.userId!, state);
  res.json({ course, courses });
});

router.post("/create-group", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { group } = req.body;
  if (!group || !group.name) {
    return res.status(400).json({ error: "Guruh ma'lumotlari to'liq emas." });
  }
  const state = await loadRaw(req.userId!);
  const groups = state.groups || [];
  groups.unshift(group);
  state.groups = groups;
  await saveRaw(req.userId!, state);
  res.json({ group, groups });
});

router.post("/send-message", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { groupId, message } = req.body;
  if (!groupId || !message) {
    return res.status(400).json({ error: "Xabar ma'lumotlari to'liq emas." });
  }
  const state = await loadRaw(req.userId!);
  const chats = state.groupChats || {};
  const groupChat = chats[groupId] || [];
  groupChat.push(message);
  chats[groupId] = groupChat;
  state.groupChats = chats;
  await saveRaw(req.userId!, state);
  res.json({ ok: true, messages: groupChat });
});

router.post("/issue-certificate", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { certificate } = req.body;
  if (!certificate || !certificate.studentName) {
    return res.status(400).json({ error: "Sertifikat ma'lumotlari to'liq emas." });
  }
  const state = await loadRaw(req.userId!);
  const certs = state.certificates || [];
  certs.unshift(certificate);
  state.certificates = certs;
  await saveRaw(req.userId!, state);
  res.json({ certificate, certificates: certs });
});

router.post("/enroll-course", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ error: "Kurs ID talab qilinadi." });
  }
  const state = await loadRaw(req.userId!);
  const ids = state.enrolledCourseIds || [];
  if (!ids.includes(courseId)) {
    ids.push(courseId);
  }
  state.enrolledCourseIds = ids;
  // Also set enrolled flag on catalog courses for backward compat
  const courses = state.courses || [];
  const course = courses.find((c: any) => c.id === courseId);
  if (course) course.enrolled = true;
  state.courses = courses;
  await saveRaw(req.userId!, state);
  res.json({ ok: true });
});

router.get("/enrolled-courses", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const state = await loadRaw(req.userId!);
  const enrolledCourseIds: string[] = state.enrolledCourseIds || [];
  const courses = (state.courses || []).filter((c: any) =>
    c.enrolled || enrolledCourseIds.includes(c.id)
  );
  res.json({ courses, enrolledCourseIds });
});

router.get("/student-groups", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const [state, userRow] = await Promise.all([
    loadRaw(req.userId!),
    db.get("SELECT name FROM users WHERE id = $1", [req.userId!]),
  ]);
  const userName = (userRow as any)?.name || '';
  const allGroups: any[] = state.groups || [];
  const groups = allGroups.filter((g: any) => g.students?.includes(userName));
  res.json({ groups, userName });
});

router.get("/student-tests", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const [state, userRow] = await Promise.all([
    loadRaw(req.userId!),
    db.get("SELECT name FROM users WHERE id = $1", [req.userId!]),
  ]);
  const userName = (userRow as any)?.name || '';
  const allGroups: any[] = state.groups || [];
  const groups = allGroups.filter((g: any) => g.students?.includes(userName));
  const tests = groups.flatMap((g: any) => (g.tests || []).map((t: any) => ({ ...t, groupName: g.name, groupId: g.id })));
  res.json({ tests, groups });
});

router.get("/student-homeworks", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const [state, userRow] = await Promise.all([
    loadRaw(req.userId!),
    db.get("SELECT name FROM users WHERE id = $1", [req.userId!]),
  ]);
  const userName = (userRow as any)?.name || '';
  const allGroups: any[] = state.groups || [];
  const groups = allGroups.filter((g: any) => g.students?.includes(userName));
  const homeworks = groups.flatMap((g: any) => (g.homeworks || []).map((h: any) => ({ ...h, groupName: g.name, groupId: g.id })));
  res.json({ homeworks, groups });
});

export default router;
