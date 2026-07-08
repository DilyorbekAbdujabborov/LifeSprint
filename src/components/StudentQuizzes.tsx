import { useState } from 'react';
import { Trophy } from 'lucide-react';
import * as api from '../api';
import type { Group, LmsQuiz } from '../types';

const quizData = [
  ["1. What is the antonym of 'Discipline' in academic contexts?", 'Chaos / Laziness', 'Self-control', 'Order', 'Commitment'],
  ['2. Choose the correct spelling:', 'Acquiescence', 'Acquiesence', 'Acuiescence', 'Aquescence'],
  ['3. Which element is primary for React state management?', 'useState', 'HTML DOM', 'CSS variables', 'Webpack config'],
  ['4. Solve: 5x + 10 = 35. Find x:', 'x = 5', 'x = 4', 'x = 6', 'x = 7'],
  ['5. Which CSS layout is native to tailwind grid-cols?', 'CSS Grid', 'Flexbox only', 'Floats', 'Tables'],
];

interface StudentQuizzesProps {
  studentGroups: Group[];
  setXp: (v: number) => void;
  setCoins: (v: number) => void;
  setLevel: (v: number) => void;
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  activeGroupId: string | null;
}

export default function StudentQuizzes({
  studentGroups, setXp, setCoins, setLevel, setGroups, activeGroupId,
}: StudentQuizzesProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<LmsQuiz | null>(null);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleStartQuiz = (qz: LmsQuiz) => {
    setSelectedQuiz(qz);
    setActiveQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerQuizQuestion = (isCorrect: boolean) => {
    if (isCorrect) setQuizScore((p) => p + 1);
    if (activeQuizIndex < 4) {
      setActiveQuizIndex((p) => p + 1);
    } else {
      setQuizCompleted(true);
      api.rewardAndUpdate(setXp, setCoins, setLevel, 'complete_group_quiz');
      if (activeGroupId && selectedQuiz) {
        setGroups((prev) => prev.map((g) =>
          g.id === activeGroupId
            ? { ...g, quizzes: g.quizzes.map((q) =>
                q.id === selectedQuiz.id
                  ? { ...q, completed: true, score: quizScore + (isCorrect ? 1 : 0) }
                  : q
              ) }
            : g
        ));
      }
    }
  };

  return (
    <div className="space-y-6 text-left">
      {!selectedQuiz ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">Barcha faol quizlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-purple-600 border-b pb-2">Ochiq Quizlar</h3>
              <div className="space-y-2">
                {[
                  { id: 'qz1', title: 'English Vocabulary (Intermediate)', questionsCount: 5, completed: false, category: 'Ochiq' },
                  { id: 'qz2', title: 'Mathematics: Basic Equations', questionsCount: 5, completed: false, category: 'Ochiq' },
                ].map((qz) => (
                  <div key={qz.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{qz.title}</span>
                    <button
                      onClick={() => handleStartQuiz(qz as any)}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      type="button"
                    >
                      Boshlash
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-indigo-600 border-b pb-2">Guruh Quizlari</h3>
              <div className="space-y-2">
                {studentGroups.flatMap((g) => g.quizzes).length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-bold text-center py-4">Guruh quizlari yo'q.</p>
                ) : (
                  studentGroups.flatMap((g) => g.quizzes).map((qz) => (
                    <div key={qz.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                      <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{qz.title}</span>
                      {qz.completed ? (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">{qz.score}/{qz.questionsCount}</span>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(qz)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          type="button"
                        >
                          Boshlash
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-purple-600 uppercase">Quiz Player</h3>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="text-gray-400 hover:text-red-500 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1"
              type="button"
              aria-label="Quizni yopish"
            >
              Yopish
            </button>
          </div>
          {!quizCompleted ? (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>Savol {activeQuizIndex + 1} / 5</span>
                <span>To'g'ri: {quizScore}</span>
              </div>
              <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100/30">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{quizData[activeQuizIndex][0]}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {quizData[activeQuizIndex].slice(1).map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQuizQuestion(idx === 0)}
                    className="p-3 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900/30 dark:hover:bg-purple-950/20 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-left transition-all text-gray-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 space-y-4">
              <Trophy className="w-10 h-10 mx-auto text-purple-500" aria-hidden="true" />
              <h4 className="font-bold text-gray-900 dark:text-white">Quiz yakunlandi!</h4>
              <p className="text-xs text-gray-400">Natija: <strong className="text-purple-600 font-mono text-sm">{quizScore} / 5</strong></p>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                type="button"
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
