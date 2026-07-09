import { useState, useEffect } from 'react';
import {
  Swords, Shield, Skull, Heart, Zap, Star, Trophy, ArrowLeft, Sparkles, Flame,
} from 'lucide-react';
import { useStore } from '../store';
import * as api from '../api';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

const BOSSES = [
  {
    id: 'dragon',
    name: 'Ajdaho',
    emoji: '🐉',
    color: 'from-red-600 to-orange-500',
    hp: 100,
    description: 'Matematik ajdaho — sonlar va formulalar bilan jang!',
    category: 'Matematika',
  },
  {
    id: 'phoenix',
    name: 'Feniks',
    emoji: '🦅',
    color: 'from-amber-500 to-yellow-400',
    hp: 90,
    description: 'Til bilimi feniksi — grammatika va so\'z boyligi!',
    category: 'Ingliz tili',
  },
  {
    id: 'golem',
    name: 'Golem',
    emoji: '🪨',
    color: 'from-slate-600 to-stone-500',
    hp: 120,
    description: 'Fizika golemi — tabiat qonunlari bilan kurash!',
    category: 'Fizika',
  },
  {
    id: 'beast',
    name: 'Hayvon',
    emoji: '🧬',
    color: 'from-emerald-600 to-teal-500',
    hp: 80,
    description: 'Biologiya maxluqi — tirik organizmlar haqida bilim!',
    category: 'Biologiya',
  },
  {
    id: 'wizard',
    name: 'Sehrgar',
    emoji: '🧙',
    color: 'from-violet-600 to-purple-500',
    hp: 110,
    description: 'Mantiq sehrgari — topishmoqlar va mantiqiy savollar!',
    category: 'Mantiq',
  },
];

const QUESTIONS: Record<string, Question[]> = {
  Matematika: [
    { q: "5 × 12 = ?", options: ["50", "55", "60", "65"], correct: 2 },
    { q: "144 ning kvadrat ildizi?", options: ["10", "11", "12", "13"], correct: 2 },
    { q: "25% = ?/100", options: ["15", "20", "25", "30"], correct: 2 },
    { q: "Uchburchak ichki burchaklari yig'indisi?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
    { q: "2^5 = ?", options: ["16", "24", "32", "64"], correct: 2 },
    { q: "x + 7 = 15 bo'lsa, x = ?", options: ["6", "7", "8", "9"], correct: 2 },
    { q: "0.75 kasrni foizda ifodalang", options: ["7.5%", "75%", "0.75%", "750%"], correct: 1 },
    { q: "7! (7 faktorial) nechaga teng?", options: ["720", "5040", "2520", "40320"], correct: 1 },
    { q: "Aylana diametri radiusidan necha marta katta?", options: ["1", "1.5", "2", "3.14"], correct: 2 },
    { q: "3, 6, 9, 12 ... 10-hadi?", options: ["27", "30", "33", "36"], correct: 1 },
    { q: "To'g'ri burchak necha gradus?", options: ["45°", "60°", "90°", "180°"], correct: 2 },
    { q: "N sonining 10% i 5 ga teng. N = ?", options: ["25", "50", "75", "100"], correct: 1 },
  ],
  "Ingliz tili": [
    { q: "Past tense of 'go'?", options: ["goed", "went", "gone", "going"], correct: 1 },
    { q: "She ___ to school every day.", options: ["go", "goes", "going", "went"], correct: 1 },
    { q: "Synonym of 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], correct: 2 },
    { q: "I ___ a student.", options: ["am", "is", "are", "be"], correct: 0 },
    { q: "Antonym of 'big'?", options: ["Large", "Huge", "Small", "Wide"], correct: 2 },
    { q: "Correct plural of 'child'?", options: ["Childs", "Children", "Childes", "Child"], correct: 1 },
    { q: "He is good ___ math.", options: ["in", "on", "at", "with"], correct: 2 },
    { q: "What does 'beautiful' mean?", options: ["Xunuk", "Chiroyli", "Baland", "Tez"], correct: 1 },
    { q: "I have ___ apple.", options: ["a", "an", "the", "some"], correct: 1 },
    { q: "She ___ to music now.", options: ["listen", "listens", "is listening", "listened"], correct: 2 },
    { q: "Opposite of 'hot'?", options: ["Warm", "Cold", "Cool", "Freezing"], correct: 1 },
    { q: "We ___ going to the park.", options: ["is", "am", "are", "be"], correct: 2 },
  ],
  Fizika: [
    { q: "Yorug'lik tezligi taxminan?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1 },
    { q: "Nyutonning 1-qonuni?", options: ["Aks ta'sir", "Inersiya", "Gravitatsiya", "Energiya"], correct: 1 },
    { q: "Kuch birligi?", options: ["Joul", "Vatt", "Nyuton", "Paskal"], correct: 2 },
    { q: "Erkin tushish tezlanishi?", options: ["5 m/s²", "7.8 m/s²", "9.8 m/s²", "12 m/s²"], correct: 2 },
    { q: "Elektr toki birligi?", options: ["Volt", "Amper", "Om", "Vatt"], correct: 1 },
    { q: "Ovoz qayerda tez tarqaladi?", options: ["Vakuum", "Gaz", "Suyuqlik", "Qattiq jism"], correct: 3 },
    { q: "Energiya saqlanish qonuni?", options: ["Yo'qoladi", "Paydo bo'ladi", "Saqlanadi", "O'zgaradi"], correct: 2 },
    { q: "Magnit maydon manbai?", options: ["Zaryad", "Tok", "Kuch", "Energiya"], correct: 1 },
    { q: "Qarshilik birligi?", options: ["Volt", "Amper", "Om", "Vatt"], correct: 2 },
    { q: "Quvvat birligi?", options: ["Joul", "Nyuton", "Vatt", "Paskal"], correct: 2 },
    { q: "Tovush tezligi havoda (m/s)?", options: ["~150", "~343", "~500", "~1000"], correct: 1 },
    { q: "Elektron zaryadi?", options: ["Musbat", "Manfiy", "Neytral", "O'zgaruvchan"], correct: 1 },
  ],
  Biologiya: [
    { q: "Inson yuragi necha kamerali?", options: ["2", "3", "4", "5"], correct: 2 },
    { q: "Fotosintezda qanday gaz ajraladi?", options: ["Azot", "Kislorod", "CO₂", "Vodorod"], correct: 1 },
    { q: "DNK shakli?", options: ["Burchak", "Spiral", "Aylana", "To'g'ri"], correct: 1 },
    { q: "Inson miyasi ~?", options: ["~500g", "~1000g", "~1400g", "~2000g"], correct: 2 },
    { q: "Qon aylanish markazi?", options: ["O'pka", "Jigar", "Yurak", "Miya"], correct: 2 },
    { q: "Energiya ishlab chiqaruvchi organoid?", options: ["Yadro", "Mitoxondriya", "Ribosoma", "Golji"], correct: 1 },
    { q: "Qon guruhlari soni?", options: ["2", "3", "4", "5"], correct: 2 },
    { q: "Vitamin C yetishmasligi?", options: ["Anemiya", "Singa", "Raхit", "Pellagra"], correct: 1 },
    { q: "Nafas olish markazi?", options: ["O'pka", "Yurak", "Miya", "Burun"], correct: 2 },
    { q: "Oqsil monomerlari?", options: ["Nukleotidlar", "Aminokislotalar", "Monosaxaridlar", "Glitserin"], correct: 1 },
    { q: "Eng katta organ?", options: ["Jigar", "Yurak", "Teri", "O'pka"], correct: 2 },
    { q: "Neyronlar qayerda joylashgan?", options: ["Mushak", "Suyak", "Miya", "Qon"], correct: 2 },
  ],
  Mantiq: [
    { q: "1, 1, 2, 3, 5, 8, ?", options: ["10", "11", "12", "13"], correct: 3 },
    { q: "3 ta qalam 9$, 1 ta qalam?", options: ["1", "2", "3", "4"], correct: 2 },
    { q: "Barcha mushuklar hayvon. Murka mushuk. ?", options: ["Hayvon emas", "Hayvon", "It", "Baliq"], correct: 1 },
    { q: "2, 4, 8, 16, 32, ?", options: ["48", "56", "64", "72"], correct: 2 },
    { q: "Bugun payshanba, 3 kundan keyin?", options: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba"], correct: 0 },
    { q: "Barcha odamlar o'limli. Men odamman.", options: ["O'lmasman", "O'limliman", "Hayvonman", "Yulduzman"], correct: 1 },
    { q: "Eng kichik raqam?", options: ["0.5", "0.25", "0.125", "0.625"], correct: 2 },
    { q: "Bir soatda necha daqiqa?", options: ["30", "45", "60", "100"], correct: 2 },
    { q: "3, 6, 9, 12, ... qonuniyat?", options: ["+2", "+3", "+4", "+5"], correct: 1 },
    { q: "A: 2,4,6 B: 1,3,5. A vs B?", options: ["A > B", "A < B", "A = B", "Aniqlab bo'lmaydi"], correct: 0 },
    { q: "10 ta olma, 2 tasini yedik. Qoldi?", options: ["6", "7", "8", "9"], correct: 2 },
    { q: "Qaysi biri tub son?", options: ["15", "21", "23", "27"], correct: 2 },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'select' | 'playing' | 'result';

const BOSS_ATTACKS = [
  { name: 'Olovli nafas', emoji: '🔥', damage: 20 },
  { name: 'Dum zarbasi', emoji: '💥', damage: 25 },
  { name: 'Tirnoqli panja', emoji: '⚔️', damage: 15 },
  { name: 'Qora sehr', emoji: '🌑', damage: 30 },
  { name: 'Siklon', emoji: '🌀', damage: 20 },
];

const PLAYER_ATTACKS = [
  { name: 'Bilim zarbasi', emoji: '📚', damage: 12 },
  { name: 'Mantiqiy hujum', emoji: '🧠', damage: 15 },
  { name: 'Tezkor javob', emoji: '⚡', damage: 10 },
  { name: 'Aniq hisob', emoji: '🎯', damage: 18 },
];

export default function AiBossBattle() {
  const [phase, setPhase] = useState<Phase>('select');
  const [boss, setBoss] = useState<typeof BOSSES[number] | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [bossAttackAnim, setBossAttackAnim] = useState(false);
  const [playerAttackAnim, setPlayerAttackAnim] = useState(false);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [xpReward, setXpReward] = useState(0);
  const [coinReward, setCoinReward] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const startBattle = (selectedBoss: typeof BOSSES[number]) => {
    const pool = shuffle(QUESTIONS[selectedBoss.category]).slice(0, 8);
    setBoss(selectedBoss);
    setQuestions(pool);
    setQIndex(0);
    setBossHp(selectedBoss.hp);
    setBossMaxHp(selectedBoss.hp);
    setPlayerHp(3);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCombo(0);
    setScore(0);
    setXpReward(0);
    setCoinReward(0);
    setShowReward(false);
    setPhase('playing');
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const q = questions[qIndex];
    const correct = idx === q.correct;
    setIsCorrect(correct);

    if (correct) {
      const attack = PLAYER_ATTACKS[Math.floor(Math.random() * PLAYER_ATTACKS.length)];
      const damage = attack.damage + (combo > 0 ? combo * 2 : 0);
      setBossHp(prev => Math.max(0, prev - damage));
      setCombo(c => c + 1);
      setScore(s => s + (10 + combo * 2));
      setPlayerAttackAnim(true);
      setTimeout(() => setPlayerAttackAnim(false), 600);
    } else {
      const attack = BOSS_ATTACKS[Math.floor(Math.random() * BOSS_ATTACKS.length)];
      setPlayerHp(prev => Math.max(0, prev - 1));
      setCombo(0);
      setBossAttackAnim(true);
      setTimeout(() => setBossAttackAnim(false), 600);
    }
  };

  useEffect(() => {
    if (selectedAnswer !== null && (playerHp <= 0 || bossHp <= 0)) {
      const timer = setTimeout(() => finishBattle(), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, playerHp, bossHp]);

  const nextQuestion = () => {
    if (playerHp <= 0 || bossHp <= 0) return;
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      finishBattle();
    }
  };

  const finishBattle = () => {
    const won = bossHp <= 0;
    const baseXp = 80;
    const baseCoins = 15;
    const multiplier = won ? 2 : 0.5;
    const finalXp = Math.round(baseXp * questions.length * multiplier);
    const finalCoins = Math.round(baseCoins * questions.length * multiplier);
    setXpReward(finalXp);
    setCoinReward(finalCoins);
    setShowReward(true);

    if (won) {
      api.rewardAndUpdate(
        useStore.getState().setXp,
        useStore.getState().setCoins,
        useStore.getState().setLevel,
        'complete_mock_section',
        { bonusXp: finalXp, bonusCoins: finalCoins }
      );
    }

    setTimeout(() => setPhase('result'), won ? 1500 : 1500);
  };

  if (phase === 'select') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">AI Boss Battle</h3>
            <p className="text-xs text-slate-400">Bossni tanlang va jangni boshlang!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BOSSES.map(b => (
            <button
              key={b.id}
              onClick={() => startBattle(b)}
              className="group relative p-5 rounded-2xl bg-gradient-to-br bg-white/5 border border-slate-700/50 hover:border-slate-500/50 transition-all hover:scale-[1.02] text-left cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${b.color}`} />
              <div className="relative">
                <div className="text-4xl mb-3">{b.emoji}</div>
                <h4 className="text-base font-black text-white mb-1">{b.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{b.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Heart className="w-3 h-3 text-red-400" />
                    {b.hp} HP
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 font-bold text-[10px]">
                    {b.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'playing' && boss) {
    const q = questions[qIndex];
    const bossHpPct = (bossHp / bossMaxHp) * 100;
    const playerHpArray = [1, 2, 3];

    return (
      <div className="space-y-4">
        {/* Boss HP Bar */}
        <div className="p-4 rounded-2xl bg-white/5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{boss.emoji}</span>
              <div>
                <span className="text-sm font-black text-white">{boss.name}</span>
                <div className="text-[10px] text-slate-500">BOSS</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400">{bossHp}</span>
              <span className="text-xs text-slate-500">/ {bossMaxHp}</span>
            </div>
          </div>
          <div className="relative h-4 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${boss.color}`}
              style={{ width: `${bossHpPct}%` }}
            />
            {playerAttackAnim && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-white drop-shadow-lg animate-ping">💥</span>
              </div>
            )}
          </div>
        </div>

        {/* Player HP + Combo */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {playerHpArray.map(i => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${i <= playerHp ? 'text-red-400 fill-red-400' : 'text-slate-700'}`}
              />
            ))}
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Flame className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-black text-amber-400">x{combo}</span>
            </div>
          )}
          <div className="text-xs font-mono font-bold text-emerald-400">+{score} XP</div>
        </div>

        {/* Boss Attack Animation */}
        {bossAttackAnim && (
          <div className="text-center py-2 animate-bounce">
            <span className="text-2xl">💥</span>
            <span className="text-xs text-red-400 font-bold ml-2">Boss sizga zarba berdi!</span>
          </div>
        )}

        {/* Question */}
        <div className="p-5 rounded-2xl bg-white/5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Savol {qIndex + 1} / {questions.length}
            </span>
          </div>
          <h3 className="text-base font-black text-white leading-relaxed">{q.q}</h3>

          <div className="grid grid-cols-1 gap-2 mt-4">
            {q.options.map((opt, idx) => {
              let btnClass = 'bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700/50';

              if (selectedAnswer !== null) {
                if (idx === q.correct) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                } else if (idx === selectedAnswer && idx !== q.correct) {
                  btnClass = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                } else {
                  btnClass = 'bg-slate-800/30 border-slate-700/30 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-black/20 text-center leading-6 text-[11px] font-black mr-2 text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && playerHp > 0 && bossHp > 0 && qIndex < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              Keyingi savol →
            </button>
          )}

          {(playerHp <= 0 || bossHp <= 0) && (
            <div className="mt-4 text-center">
              <div className={`text-lg font-black ${bossHp <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {bossHp <= 0 ? '🏆 Boss mag\'lub bo\'ldi!' : `${boss.name} sizni mag\'lub etdi!`}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const won = bossHp <= 0;

  return (
    <div className="space-y-5 text-center">
      <div className={`p-8 rounded-3xl border ${
        won ? 'bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-emerald-600/30' : 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-600/30'
      }`}>
        <div className="text-6xl mb-4">{won ? '🏆' : '💀'}</div>
        <h2 className={`text-2xl font-black mb-2 ${won ? 'text-emerald-400' : 'text-red-400'}`}>
          {won ? `${boss?.name} mag'lub bo'ldi!` : `${boss?.name} sizni yengdi!`}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {won ? 'Tabriklaymiz! Siz bossni yutdingiz!' : 'Keyingi safar omad! Qaytadan urinib ko\'ring!'}
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400">{score}</div>
            <div className="text-xs text-slate-500">Ball</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-amber-400">{combo}</div>
            <div className="text-xs text-slate-500">Maks. Combo</div>
          </div>
        </div>

        {showReward && (
          <div className="p-4 rounded-2xl bg-white/5 border border-slate-700/50 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1">
                  <Zap className="w-3 h-3 text-amber-500" /> XP
                </div>
                <div className="text-xl font-black text-amber-500">+{xpReward}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1">
                  <Star className="w-3 h-3 text-amber-500" /> Coin
                </div>
                <div className="text-xl font-black text-amber-500">+{coinReward}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setPhase('select')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all cursor-pointer border border-slate-600/50"
          >
            <ArrowLeft className="w-3 h-3 inline mr-1" /> Bosslar
          </button>
          {boss && (
            <button
              onClick={() => startBattle(boss)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              <Skull className="w-3 h-3 inline mr-1" /> Qayta urinish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
