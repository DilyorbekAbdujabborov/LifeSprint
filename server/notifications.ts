import { Router, Response } from "express";
import db from './db.js';
import { authMiddleware, AuthedRequest } from './auth.js';

const router = Router();

router.get("/", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const rows = await db.all(
    "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
    [req.userId]
  );
  const countRow = await db.get(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = 0",
    [req.userId]
  ) as { count: number };
  res.json({ notifications: rows, unreadCount: countRow.count });
});

router.post("/read/:id", authMiddleware, async (req: AuthedRequest, res: Response) => {
  await db.run(
    "UPDATE notifications SET read = 1 WHERE id = $1 AND user_id = $2",
    [Number(req.params.id), req.userId]
  );
  res.json({ ok: true });
});

router.post("/read-all", authMiddleware, async (req: AuthedRequest, res: Response) => {
  await db.run(
    "UPDATE notifications SET read = 1 WHERE user_id = $1 AND read = 0",
    [req.userId]
  );
  res.json({ ok: true });
});

router.post("/seed", authMiddleware, async (req: AuthedRequest, res: Response) => {
  const demos = [
    { title: "Yangi daraja!", message: "Tabriklaymiz! Siz 20-darajaga yetdingiz.", type: "achievement" },
    { title: "Kunlik Streak", message: "11 kunlik streak faollashtirildi. Omad!", type: "system" },
    { title: "Yangi xabar", message: "Shahnoza Tursunaliyeva IELTS guruhiga yangi dars qo'shdi.", type: "info" },
    { title: "Topshiriq muddati", message: '"Line Graph Analysis" topshirig\'i ertaga tugaydi.', type: "warning" },
    { title: "XP mukofoti", message: "Kechagi vazifani bajarishingiz uchun +50 XP olindingiz.", type: "achievement" },
  ];
  for (const n of demos) {
    await db.run(
      "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
      [req.userId, n.title, n.message, n.type]
    );
  }
  res.json({ ok: true });
});

export default router;
