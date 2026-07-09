import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db, { UserRow } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || "lifesprint-dev-secret-change-me";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export interface AuthedRequest extends Request {
  userId?: number;
}

function signAccess(userId: number): string {
  return jwt.sign({ uid: userId, type: "access" }, JWT_SECRET, { expiresIn: ACCESS_TTL });
}

function signRefresh(userId: number): string {
  return jwt.sign({ uid: userId, type: "refresh" }, JWT_SECRET, { expiresIn: REFRESH_TTL });
}

function publicUser(row: UserRow) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : (req as any).cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { uid: number; type?: string };
    if (payload.type && payload.type !== "access") {
      return res.status(401).json({ error: "Noto'g'ri token turi." });
    }
    req.userId = payload.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan." });
  }
}

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Ism, email va parol talab qilinadi." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Parol kamida 6 belgidan iborat bo'lishi kerak." });
  }

  const existing = await db.get("SELECT id FROM users WHERE email = $1", [String(email).toLowerCase()]);
  if (existing) {
    return res.status(409).json({ error: "Bu email allaqachon ro'yxatdan o'tgan." });
  }

  const hash = bcrypt.hashSync(String(password), 10);
  const rows = await db.all(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, String(email).toLowerCase(), hash, role === "teacher" || role === "parent" || role === "admin" ? role : "student"]
  );

  const userId = rows[0].id;
  const row = await db.get("SELECT * FROM users WHERE id = $1", [userId]) as UserRow;
  const accessToken = signAccess(userId);
  const refreshToken = signRefresh(userId);
  res.status(201).json({ accessToken, refreshToken, user: publicUser(row) });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email va parol talab qilinadi." });
  }
  const row = await db.get("SELECT * FROM users WHERE email = $1", [String(email).toLowerCase()]) as UserRow | undefined;
  if (!row || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
  }
  const accessToken = signAccess(row.id);
  const refreshToken = signRefresh(row.id);
  res.json({ accessToken, refreshToken, user: publicUser(row) });
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token talab qilinadi." });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { uid: number; type: string };
    if (payload.type !== "refresh") {
      return res.status(401).json({ error: "Noto'g'ri token turi." });
    }
    const row = await db.get("SELECT * FROM users WHERE id = $1", [payload.uid]) as UserRow | undefined;
    if (!row) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
    const newAccess = signAccess(payload.uid);
    const newRefresh = signRefresh(payload.uid);
    res.json({ accessToken: newAccess, refreshToken: newRefresh, user: publicUser(row) });
  } catch {
    return res.status(401).json({ error: "Refresh token yaroqsiz yoki muddati o'tgan." });
  }
});

router.get("/me", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const row = await db.get("SELECT * FROM users WHERE id = $1", [req.userId]) as UserRow | undefined;
  if (!row) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
  res.json({ user: publicUser(row) });
});

export default router;
