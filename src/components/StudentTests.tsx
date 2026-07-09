import { useState } from 'react';
import { FileText } from 'lucide-react';
import * as api from '../api';
import type { Group, LmsTest } from '../types';
import Pandoo from './Pandoo';

const testData = [
  ['1. What is the key performance benefit of Next.js SSR?', 'Pre-renders HTML server-side', 'Increases client bundle size', 'Requires no database', 'Bypasses Node runtime'],
  ["2. Define 'Skimming' in reading:", 'Reading quickly for the main gist', 'Reading slowly for detail', 'Translating each sentence', 'Writing keywords'],
  ['3. How to prevent infinite re-renders in useEffect?', 'Adding stable dependency arrays', 'Removing state hooks', 'Running only on local server', 'Nesting inside loops'],
  ['4. Derivative of f(x) = 3x² + 5x at x = 1:', '11', '6', '5', '8'],
  ['5. Secure OAuth redirect protocol:', 'HTTPS', 'HTTP', 'WS', 'FTP'],
];

interface StudentTestsProps {
  studentGroups: Group[];
  setXp: (v: number) => void;
  setCoins: (v: number) => void;
  setLevel: (v: number) => void;
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  activeGroupId: string | null;
}

export default function StudentTests({
  studentGroups, setXp, setCoins, setLevel, setGroups, activeGroupId,
}: StudentTestsProps) {
  const [selectedTest, setSelectedTest] = useState<LmsTest | null>(null);
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testWrongAnswers, setTestWrongAnswers] = useState<{ question: string; options: string[]; correct: number; userAnswer: number; explanation: string }[]>([]);
  const [showPandoo, setShowPandoo] = useState(false);

  const handleStartTest = (test: LmsTest) => {
    setSelectedTest(test);
    setActiveTestIndex(0);
    setTestScore(0);
    setTestCompleted(false);
    setTestWrongAnswers([]);
    setShowPandoo(false);
  };

  const handleAnswerTestQuestion = (isCorrect: boolean) => {
    if (isCorrect) setTestScore((p) => p + 1);
    else {
      setTestWrongAnswers((prev) => [
        ...prev,
        {
          question: testData[activeTestIndex][0],
          options: testData[activeTestIndex].slice(1),
          correct: 0,
          userAnswer: -1,
          explanation: "Pandoo tahlil qilmoqda...",
        },
      ]);
    }
    if (activeTestIndex < 4) {
      setActiveTestIndex((p) => p + 1);
    } else {
      const finalScore = testScore + (isCorrect ? 1 : 0);
      setTestCompleted(true);
      api.rewardAndUpdate(setXp, setCoins, setLevel, 'complete_group_test');
      if (activeGroupId && selectedTest) {
        setGroups((prev) => prev.map((g) =>
          g.id === activeGroupId
            ? { ...g, tests: g.tests.map((t) =>
                t.id === selectedTest.id
                  ? { ...t, completed: true, score: finalScore }
                  : t
              ) }
            : g
        ));
      }
      if (finalScore / 5 < 0.5) setShowPandoo(true);
    }
  };

  const testCategories = [
    { category: 'Yakuniy', label: 'Yakuniy imtihonlar', headClass: 'text-rose-500', cardClass: 'bg-rose-50/25 dark:bg-rose-950/10', btnClass: 'bg-rose-600' },
    { category: 'Amaliy', label: 'Amaliy Testlar', headClass: 'text-blue-500', cardClass: 'bg-blue-50/25 dark:bg-blue-950/10', btnClass: 'bg-blue-600' },
    { category: 'Sertifikat', label: 'Sertifikat testlari', headClass: 'text-purple-500', cardClass: 'bg-purple-50/25 dark:bg-purple-950/10', btnClass: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-6 text-left">
      {!selectedTest ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">Yakuniy, Amaliy va Sertifikat Testlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testCategories.map(({ category, label, headClass, cardClass, btnClass }) => (
              <div key={category} className="p-5 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
                <h3 className={`font-bold text-xs uppercase tracking-widest border-b pb-2 ${headClass}`}>{label}</h3>
                <div className="space-y-2">
                  {studentGroups.flatMap((g) => g.tests.filter((t) => t.category === category)).map((test) => (
                    <div key={test.id} className={`p-3 rounded-xl space-y-2 ${cardClass}`}>
                      <h4 className="text-xs font-bold">{test.title}</h4>
                      <button
                        onClick={() => handleStartTest(test)}
                        className={`w-full py-1 text-white rounded-lg text-[9px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 ${btnClass}`}
                        type="button"
                      >
                        Boshlash
                      </button>
                    </div>
                  ))}
                  {studentGroups.flatMap((g) => g.tests.filter((t) => t.category === category)).length === 0 && (
                    <p className="text-[10px] text-gray-400 font-bold">Testlar yo'q.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-rose-600 uppercase">Test Player</h3>
            <button
              onClick={() => setSelectedTest(null)}
              className="text-gray-400 hover:text-red-500 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1"
              type="button"
              aria-label="Testni yopish"
            >
              Yopish
            </button>
          </div>
          {!testCompleted ? (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>Savol {activeTestIndex + 1} / 5</span>
                <span>Natija: {testScore}</span>
              </div>
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100/30">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{testData[activeTestIndex][0]}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {testData[activeTestIndex].slice(1).map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerTestQuestion(idx === 0)}
                    className="p-3 bg-slate-50 hover:bg-rose-50 dark:bg-slate-900/30 dark:hover:bg-rose-950/20 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-left transition-all text-gray-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 space-y-4">
              <FileText className="w-10 h-10 mx-auto text-rose-500" aria-hidden="true" />
              <h4 className="font-bold text-gray-900 dark:text-white">Imtihon yakunlandi!</h4>
              <p className="text-xs text-gray-400">Natija: <strong className="text-rose-600 font-mono text-sm">{testScore} / 5</strong></p>
              <button
                onClick={() => setSelectedTest(null)}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                type="button"
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}

      {showPandoo && (
        <Pandoo
          isOpen={showPandoo}
          onClose={() => setShowPandoo(false)}
          testTitle={selectedTest?.title || "Guruh Testi"}
          wrongQuestions={testWrongAnswers}
          correctCount={testScore}
          totalQuestions={5}
          setXp={setXp}
          setCoins={setCoins}
          setLevel={setLevel}
        />
      )}
    </div>
  );
}
