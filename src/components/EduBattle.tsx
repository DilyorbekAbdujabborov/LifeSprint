import { useState } from 'react';
import { Swords, Zap, Trophy, Clock, Star } from 'lucide-react';
import { useStore } from '../store';
import * as api from '../api';

interface EduBattleProps {
  xp: number;
  level: number;
  isDarkMode: boolean;
}

interface Question {
  q: string;
  options: string[];
  correct: number;
}

const BATTLE_QUESTIONS: Record<string, Question[]> = {
  Matematika: [
    { q: "5 × 12 = ?", options: ["50", "55", "60", "65"], correct: 2 },
    { q: "144 ning kvadrat ildizi?", options: ["10", "11", "12", "13"], correct: 2 },
    { q: "25% = ?/100", options: ["15", "20", "25", "30"], correct: 2 },
    { q: "Bir uchburchakning ichki burchaklari yig'indisi?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
    { q: "2^5 = ?", options: ["16", "24", "32", "64"], correct: 2 },
    { q: "Agar x + 7 = 15 bo'lsa, x = ?", options: ["6", "7", "8", "9"], correct: 2 },
    { q: "0.75 kasrni foizda ifodalang", options: ["7.5%", "75%", "0.75%", "750%"], correct: 1 },
    { q: "7! (7 faktorial) nechaga teng?", options: ["720", "5040", "2520", "40320"], correct: 1 },
    { q: "Aylananing diametri radiusidan necha marta katta?", options: ["1", "1.5", "2", "3.14"], correct: 2 },
    { q: "3, 6, 9, 12, ... ketma-ketlikning 10-hadi?", options: ["27", "30", "33", "36"], correct: 1 },
  ],
  "Ingliz tili": [
    { q: "What is the past tense of 'go'?", options: ["goed", "went", "gone", "going"], correct: 1 },
    { q: "Choose the correct: 'She ___ to school every day.'", options: ["go", "goes", "going", "went"], correct: 1 },
    { q: "Synonym of 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], correct: 2 },
    { q: "I ___ a student.", options: ["am", "is", "are", "be"], correct: 0 },
    { q: "Antonym of 'big'?", options: ["Large", "Huge", "Small", "Wide"], correct: 2 },
    { q: "Which is a correct plural?", options: ["Childs", "Children", "Childes", "Child"], correct: 1 },
    { q: "He is good ___ math.", options: ["in", "on", "at", "with"], correct: 2 },
    { q: "What does 'beautiful' mean?", options: ["Xunuk", "Chiroyli", "Baland", "Tez"], correct: 1 },
    { q: "I have ___ apple.", options: ["a", "an", "the", "some"], correct: 1 },
    { q: "She ___ to music now.", options: ["listen", "listens", "is listening", "listened"], correct: 2 },
  ],
  "Fizika": [
    { q: "Yorug'lik tezligi taxminan?", options: ["3×10^6 m/s", "3×10^8 m/s", "3×10^10 m/s", "3×10^4 m/s"], correct: 1 },
    { q: "Nyutonning 1-qonuni nima deb ataladi?", options: ["Aks ta'sir", "Inersiya", "Gravitatsiya", "Energiya"], correct: 1 },
    { q: "Kuch birligi?", options: ["Joul", "Vatt", "Nyuton", "Paskal"], correct: 2 },
    { q: "Erkin tushish tezlanishi qiymati?", options: ["5 m/s²", "7.8 m/s²", "9.8 m/s²", "12 m/s²"], correct: 2 },
    { q: "Elektr tokining birligi?", options: ["Volt", "Amper", "Om", "Vatt"], correct: 1 },
    { q: "Ovoz qanday muhitda tez tarqaladi?", options: ["Vakuum", "Gaz", "Suyuqlik", "Qattiq jism"], correct: 3 },
    { q: "Tebranishlar sonining vaqtga nisbati?", options: ["Amplituda", "Davr", "Chastota", "To'lqin"], correct: 2 },
    { q: "Energiyaning saqlanish qonuniga ko'ra?", options: ["Energiya yo'qoladi", "Energiya paydo bo'ladi", "Energiya saqlanadi", "Energiya o'zgaradi"], correct: 2 },
    { q: "Magnit maydonining manbai?", options: ["Zaryad", "Tok", "Kuch", "Energiya"], correct: 1 },
    { q: "Qarshilik birligi?", options: ["Volt", "Amper", "Om", "Vatt"], correct: 2 },
  ],
  "Biologiya": [
    { q: "Inson yuragi necha kamerali?", options: ["2", "3", "4", "5"], correct: 2 },
    { q: "Fotosintez jarayonida qanday gaz ajraladi?", options: ["Azot", "Kislorod", "Karbonat angidrid", "Vodorod"], correct: 1 },
    { q: "DNK qanday shaklga ega?", options: ["Burchak", "Spiral", "Aylana", "To'g'ri"], correct: 1 },
    { q: "Inson miyasi necha gramm?", options: ["~500g", "~1000g", "~1400g", "~2000g"], correct: 2 },
    { q: "Qon aylanish sistemasining markaziy organi?", options: ["O'pka", "Jigar", "Yurak", "Miya"], correct: 2 },
    { q: "Hujayraning energiya ishlab chiqaruvchi organoidi?", options: ["Yadro", "Mitoxondriya", "Ribosoma", "Golji"], correct: 1 },
    { q: "Odamda necha xil qon guruhi bor?", options: ["2", "3", "4", "5"], correct: 2 },
    { q: "Vitamin C yetishmasligi qanday kasallik keltirib chiqaradi?", options: ["Anemiya", "Singa", "Raхit", "Pellagra"], correct: 1 },
    { q: "Nafas olish markazi qayerda joylashgan?", options: ["O'pka", "Yurak", "Miya", "Burun"], correct: 2 },
    { q: "Oqsil qanday monomerlardan tuzilgan?", options: ["Nukleotidlar", "Aminokislotalar", "Monosaxaridlar", "Glitserin"], correct: 1 },
  ],
  "Mantiq": [
    { q: "1, 1, 2, 3, 5, 8, ? keyingi son?", options: ["10", "11", "12", "13"], correct: 3 },
    { q: "Agar 3 ta qalam 9$ bo'lsa, 1 ta qalam necha $?", options: ["1", "2", "3", "4"], correct: 2 },
    { q: "Barcha mushuklar hayvon. Murka mushuk. ?", options: ["Murka hayvon emas", "Murka hayvon", "Murka it", "Murka baliq"], correct: 1 },
    { q: "Qaysi so'z noto'g'ri yozilgan?", options: ["Kitob", "Daftar", "Qalam", "Bog'"], correct: 3 },
    { q: "2, 4, 8, 16, 32, ?", options: ["48", "56", "64", "72"], correct: 2 },
    { q: "Agar bugun payshanba bo'lsa, 3 kundan keyin nima?", options: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba"], correct: 0 },
    { q: "Barcha odamlar o'limli. Men odamman. ?", options: ["Men o'lmasman", "Men o'limliman", "Men hayvonman", "Men yulduzman"], correct: 1 },
    { q: "Qaysi raqam eng kichik?", options: ["0.5", "0.25", "0.125", "0.625"], correct: 2 },
    { q: "Bir soatda necha daqiqa?", options: ["30", "45", "60", "100"], correct: 2 },
    { q: "A 2 4 6 8 B 1 3 5 7 qatorlar taqqoslang", options: ["A > B", "A < B", "A = B", "Aniqlab bo'lmaydi"], correct: 0 },
  ],
};

const CATEGORIES = Object.keys(BATTLE_QUESTIONS);

const BOT_NAMES = ["Alisher Bot", "Zafar Bot", "Malika Bot", "Jamshid Bot", "Lola Bot"];
const BOT_AVATARS = ["🤖", "🧠", "⚡", "🎯", "🚀"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'select' | 'playing' | 'result';

export default function EduBattle({ xp, level, isDarkMode }: EduBattleProps) {
  const [phase, setPhase] = useState<Phase>('select');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [botAnswer, setBotAnswer] = useState<number | null>(null);
  const [botRevealed, setBotRevealed] = useState(false);
  const [roundResult, setRoundResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [botName] = useState(() => BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]);
  const [botAvatar] = useState(() => BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)]);
  const [xpReward, setXpReward] = useState(0);
  const [coinReward, setCoinReward] = useState(0);
  const [finished, setFinished] = useState(false);

  const startBattle = (cat: string) => {
    const pool = shuffle(BATTLE_QUESTIONS[cat]).slice(0, 6);
    setCategory(cat);
    setQuestions(pool);
    setQIndex(0);
    setPlayerScore(0);
    setBotScore(0);
    setSelectedAnswer(null);
    setBotAnswer(null);
    setBotRevealed(false);
    setRoundResult(null);
    setFinished(false);
    setXpReward(0);
    setCoinReward(0);
    setPhase('playing');
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const q = questions[qIndex];
    const correct = q.correct;
    const playerCorrect = idx === correct;
    const botCorrect = Math.random() < 0.65;

    if (playerCorrect) setPlayerScore(s => s + 1);
    if (botCorrect) setBotScore(s => s + 1);

    setTimeout(() => {
      setBotAnswer(botCorrect ? correct : (correct + 1 + Math.floor(Math.random() * 3)) % 4);
      setBotRevealed(true);

      if (playerCorrect && !botCorrect) setRoundResult('win');
      else if (!playerCorrect && botCorrect) setRoundResult('lose');
      else setRoundResult('draw');
    }, 600);
  };

  const nextQuestion = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
      setSelectedAnswer(null);
      setBotAnswer(null);
      setBotRevealed(false);
      setRoundResult(null);
    } else {
      finishBattle();
    }
  };

  const finishBattle = () => {
    setFinished(true);
    const baseXp = 50;
    const baseCoins = 10;
    let multiplier = 1;
    if (playerScore > botScore) multiplier = 2;
    else if (playerScore === botScore) multiplier = 1.5;
    const finalXp = Math.round(baseXp * questions.length * multiplier);
    const finalCoins = Math.round(baseCoins * questions.length * multiplier);
    setXpReward(finalXp);
    setCoinReward(finalCoins);

    api.rewardAndUpdate(
      useStore.getState().setXp,
      useStore.getState().setCoins,
      useStore.getState().setLevel,
      'complete_mock_section',
      { bonusXp: finalXp, bonusCoins: finalCoins }
    );
  };

  if (phase === 'select') {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edu Battle</h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Botga qarshi bilim bellashuvi! 6 ta savol</p>
          </div>
        </div>

        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Yo'nalishni tanlang va jangni boshlang:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => startBattle(cat)}
              className="p-5 rounded-2xl bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-700/50 hover:shadow-lg hover:scale-[1.02] transition-all text-center space-y-2 cursor-pointer"
            >
              <div className="text-2xl">{cat === 'Matematika' ? '🔢' : cat === "Ingliz tili" ? '🇬🇧' : cat === 'Fizika' ? '⚛️' : cat === 'Biologiya' ? '🧬' : '🧩'}</div>
              <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cat}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>6 savol</div>
            </button>
          ))}
        </div>

        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-700/50' : 'bg-white border-gray-100'} space-y-2`}>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400">
            <Trophy className="w-4 h-4 text-amber-500" /> Qanday o'ynaladi?
          </div>
          <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <li>• 6 ta savoldan iborat jang</li>
            <li>• Har bir to'g'ri javob uchun ball</li>
            <li>• Botga qarshi kim ko'p to'g'ri topsa, u yutadi</li>
            <li>• G'alaba uchun 2x, durang uchun 1.5x XP/coin mukofot</li>
          </ul>
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    const q = questions[qIndex];
    const isLast = qIndex === questions.length - 1;

    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
        {/* Scoreboard */}
        <div className={`flex justify-between items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-700/50' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Siz</div>
              <div className={`text-2xl font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{playerScore}</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{qIndex + 1}/{questions.length}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < qIndex ? 'bg-emerald-500' : i === qIndex ? 'bg-amber-500 animate-pulse' : isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{botName}</div>
              <div className={`text-2xl font-black ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{botScore}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl">
              {botAvatar}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-700/50' : 'bg-white border-gray-100'} shadow-sm`}>
          <div className={`text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Savol {qIndex + 1}</div>
          <h3 className={`text-base font-black leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{q.q}</h3>

          <div className="grid grid-cols-1 gap-2 mt-4">
            {q.options.map((opt, idx) => {
              let btnClass = isDarkMode
                ? 'bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700/50'
                : 'bg-gray-50 border-gray-100 text-gray-800 hover:bg-gray-100';

              if (selectedAnswer !== null) {
                if (idx === q.correct) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                } else if (idx === selectedAnswer && idx !== q.correct) {
                  btnClass = 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 font-bold';
                } else {
                  btnClass = isDarkMode
                    ? 'bg-slate-800/30 border-slate-700/30 text-slate-500'
                    : 'bg-gray-50 border-gray-100 text-gray-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${btnClass} ${selectedAnswer === null ? '' : ''}`}
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-center leading-6 text-[11px] font-black mr-2">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Bot answer reveal */}
          {botRevealed && (
            <div className={`mt-4 p-3 rounded-xl border text-xs ${
              roundResult === 'win' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
              roundResult === 'lose' ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' :
              'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}>
              <div className="font-bold">
                {roundResult === 'win' ? `🎉 ${botName} dan oldin to'g'ri topdingiz!` :
                 roundResult === 'lose' ? `${botName} sizdan oldin topdi!` :
                 '🤝 Durang!'}
              </div>
              {botAnswer !== null && (
                <div className="text-[11px] opacity-80 mt-1">
                  {botName} javobi: {String.fromCharCode(65 + botAnswer)}. {botAnswer === q.correct ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri'}
                </div>
              )}
            </div>
          )}

          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              {isLast && botRevealed ? '🏆 Natijani ko\'rish' : 'Keyingi savol →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const won = playerScore > botScore;
  const drew = playerScore === botScore;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className={`p-8 rounded-3xl border text-center space-y-4 ${
        won ? (isDarkMode ? 'bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-emerald-600/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200') :
        drew ? (isDarkMode ? 'bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-600/30' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200') :
        (isDarkMode ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-600/30' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200')
      }`}>
        <div className="text-5xl">{won ? '🏆' : drew ? '🤝' : '😅'}</div>
        <h2 className={`text-2xl font-black ${won ? 'text-emerald-600 dark:text-emerald-400' : drew ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600 dark:text-amber-400'}`}>
          {won ? 'Tabriklaymiz! Siz yutdingiz!' : drew ? 'Durang!' : 'Yutqazdingiz! Keyingi safar omad!'}
        </h2>

        <div className={`flex justify-center gap-8 py-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className="text-center">
            <div className={`text-3xl font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{playerScore}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-slate-400">Siz</div>
          </div>
          <div className="text-3xl font-black text-gray-300 self-center">:</div>
          <div className="text-center">
            <div className={`text-3xl font-black ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{botScore}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-slate-400">{botName}</div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-700/50' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-slate-400">
                <Zap className="w-3 h-3 text-amber-500" /> XP
              </div>
              <div className="text-xl font-black text-amber-500">+{xpReward}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-slate-400">
                <Star className="w-3 h-3 text-amber-500" /> Coin
              </div>
              <div className="text-xl font-black text-amber-500">+{coinReward}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPhase('select')}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
        >
          <Swords className="w-4 h-4 inline" /> Yana jang qilish
        </button>
      </div>
    </div>
  );
}
