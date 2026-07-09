import express from "express";
import cookieParser from "cookie-parser";
import OpenAI from "openai";
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

const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o-mini";

const tokens = [
  process.env.GITHUB_TOKEN,
  process.env.GITHUB_TOKEN_1,
  process.env.GITHUB_TOKEN_2,
  process.env.GITHUB_TOKEN_3,
].filter(Boolean) as string[];

let currentTokenIndex = 0;

function createClient(token: string) {
  return new OpenAI({ baseURL: endpoint, apiKey: token });
}

function getCurrentClient() {
  if (tokens.length === 0) return null;
  return createClient(tokens[currentTokenIndex]);
}

let client = getCurrentClient();

function rotateToken() {
  currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
  client = createClient(tokens[currentTokenIndex]);
  console.warn(`Rotated to GITHUB_TOKEN_${currentTokenIndex > 0 ? currentTokenIndex : ''}`);
}

if (!client) {
  console.warn("Warning: No GITHUB_TOKEN is set in environment variables.");
}

async function aiChatCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[], retries = tokens.length): Promise<string> {
  if (!client) throw new Error("No GITHUB_TOKEN configured on the server.");
  const maxAttempts = retries;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await client.chat.completions.create({ model: modelName, messages });
      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      const isAuth = error?.status === 401;
      if (isAuth && tokens.length > 1) {
        console.warn(`Token ${currentTokenIndex} got 401, rotating...`);
        rotateToken();
        continue;
      }
      throw error;
    }
  }
  throw new Error("All tokens exhausted with 401 errors.");
}

app.post("/api/gemini/analyze", async (req, res) => {
  const { prompt, systemInstruction } = req.body;
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = systemInstruction
      ? [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }]
      : [{ role: "user", content: prompt }];
    const text = await aiChatCompletion(messages);
    res.json({ text });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred while communicating with the AI API." });
  }
});

app.post("/api/gemini/recommendations", async (req, res) => {
  const { context } = req.body;
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: "Siz LifeSprint platformasining ta'lim AI mushavarasi. Qisqa, foydali va motivatsiyovorli tavsiyalar bering. O'zbek tilida." },
      { role: "user", content: `Quyidagi o'quvchi konteksti asosida 3-5 ta qisqa tavsiya bering:\n${context}\n\nJavob formati: "1. [Tavsiya]. 2. [Tavsiya]" shaklida bo'lsin. O'zbek tilida.` }
    ];
    const text = await aiChatCompletion(messages);
    res.json({ recommendations: text });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: error.message || "Tavsiyalarni olishda xatolik yuz berdi." });
  }
});

export default app;
