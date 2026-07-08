import express from "express";
import cookieParser from "cookie-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import authRouter from './auth.js';
import stateRouter from './state.js';
import notificationsRouter from './notifications.js';
import actionsRouter from './actions.js';
import gameRouter from './game-engine/routes.js';
import mockRouter from './mock-data/routes.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/state", stateRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/actions", actionsRouter);
app.use("/api/game", gameRouter);
app.use("/api/mock", mockRouter);

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not set in environment variables.");
}

app.post("/api/gemini/analyze", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured on the server." });
  }

  const { prompt, systemInstruction } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred while communicating with Gemini API." });
  }
});

export default app;
