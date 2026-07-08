import React, { useState, useEffect } from 'react';
import * as api from '../api';
import {
	FileQuestion,
	Award,
	Sparkles,
	TrendingUp,
	Brain,
	GraduationCap,
	ChevronRight,
	RefreshCw,
	Clock,
	CheckCircle,
	XCircle,
	ArrowLeft,
	Coins,
} from 'lucide-react';
import Pandoo from './Pandoo';

interface TestCenterProps {
	xp?: number;
	setXp?: React.Dispatch<React.SetStateAction<number>>;
	coins?: number;
	setCoins?: React.Dispatch<React.SetStateAction<number>>;
	setLevel?: React.Dispatch<React.SetStateAction<number>>;
}

interface Question {
	q: string;
	options: string[];
	correct: number;
	explanation: string;
}

interface MockQuestion {
	q: string;
	options: string[];
	correct: number;
	explanation: string;
}

interface AdminTest {
	id: string;
	title: string;
	description: string;
	difficulty: 'Oson' | "O'rta" | 'Qiyin';
	duration: string;
	questionsCount: number;
	xpReward: number;
	coinReward: number;
	category: string;
	questions: Question[];
}

export default function TestCenter({
	xp = 11231,
	setXp,
	coins = 120,
	setCoins,
	setLevel,
}: TestCenterProps) {
	const [activeTest, setActiveTest] = useState<AdminTest | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
	const [quizFinished, setQuizFinished] = useState(false);
	const [claimed, setClaimed] = useState(false);
	const [showPandoo, setShowPandoo] = useState(false);
	const [adminTests, setAdminTests] = useState<AdminTest[]>([]);
	const [testsLoading, setTestsLoading] = useState(true);

	useEffect(() => {
		fetch('/api/mock/tests')
			.then(res => res.json())
			.then(data => {
				setAdminTests(data.adminTests || []);
				setTestsLoading(false);
			})
			.catch(() => setTestsLoading(false));
	}, []);

	const handleSelectOption = (optionIndex: number) => {
		setUserAnswers({
			...userAnswers,
			[currentStep]: optionIndex,
		});
	};

	const handleNextStep = () => {
		if (!activeTest) return;
		if (currentStep + 1 < activeTest.questions.length) {
			setCurrentStep(currentStep + 1);
		} else {
			setQuizFinished(true);
		}
	};

	const handleFinishQuiz = () => {
		if (!activeTest) return;

		const correct = calculateCorrectCount();
		const pct = (correct / activeTest.questions.length) * 100;

		api.rewardAndUpdate(
			setXp || ((v: number) => {}),
			setCoins || null,
			setLevel || null,
			'complete_test',
			{ questions: activeTest.questions, userAnswers, xpReward: activeTest.xpReward, coinReward: activeTest.coinReward }
		);

		if (pct < 50) {
			setShowPandoo(true);
		}
		setClaimed(true);
	};

	const handleBackToSelection = () => {
		setActiveTest(null);
		setCurrentStep(0);
		setUserAnswers({});
		setQuizFinished(false);
		setClaimed(false);
	};

	// Calculate correct score
	const calculateCorrectCount = () => {
		if (!activeTest) return 0;
		let count = 0;
		activeTest.questions.forEach((q, idx) => {
			if (userAnswers[idx] === q.correct) {
				count++;
			}
		});
		return count;
	};

	return (
		<div
			className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto"
			id="test_center_container"
		>
			{/* Header */}
			<div
				id="test_center_header"
				className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6"
			>
				<div>
					<h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
						Test Markazi
					</h2>
				</div>
			</div>

			{/* 1. QUIZ LIST VIEW */}
			{!activeTest && (
				<div className="space-y-6" id="tests_dashboard_view">
					<div className="flex items-center gap-2">
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
						<h3 className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
							Hozirgi kunda faol bo'lgan testlar:
						</h3>
					</div>

					{testsLoading ? (
						<div className="flex justify-center items-center py-20">
							<RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
						</div>
					) : (
						<div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
							id="tests_cards_grid"
						>
						{adminTests.map((test) => (
							<div
								key={test.id}
								className="bg-white dark:bg-[#151433] p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-xs hover:border-gray-200 dark:border-slate-700/30 hover:shadow-sm dark:shadow-none transition-all flex flex-col justify-between h-[300px]"
								id={`test_card_${test.id}`}
							>
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-[10px] font-black tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
											{test.category}
										</span>
										<span
											className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
												test.difficulty === 'Oson'
													? 'bg-emerald-50 text-emerald-700'
													: test.difficulty === "O'rta"
														? 'bg-amber-50 text-amber-700'
														: 'bg-rose-50 text-rose-700'
											}`}
										>
											{test.difficulty}
										</span>
									</div>
									<h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug">
										{test.title}
									</h3>
								</div>

								<div className="pt-4 border-t border-gray-50 space-y-4">
									<div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-slate-400 font-medium">
										<span className="flex items-center gap-1">
											<Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />{' '}
											{test.duration}
										</span>
										<span className="flex items-center gap-1">
											<FileQuestion className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />{' '}
											{test.questionsCount} ta savol
										</span>
									</div>

									<button
										id={`start_test_btn_${test.id}`}
										onClick={() => {
											setActiveTest(test);
											setCurrentStep(0);
											setUserAnswers({});
											setQuizFinished(false);
											setClaimed(false);
										}}
										className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-xs"
									>
										Testni Boshlash <ChevronRight className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
					</div>
					)}
				</div>
			)}

			{/* 2. ACTIVE QUIZ PLAYGROUND */}
			{activeTest && !quizFinished && (
				<div
					className="max-w-2xl mx-auto bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-xs overflow-hidden"
					id="active_quiz_playground"
				>
					{/* Progress Bar */}
					<div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800/30">
						<div
							className="h-full bg-indigo-600 transition-all duration-300"
							style={{
								width: `${((currentStep + 1) / activeTest.questions.length) * 100}%`,
							}}
						/>
					</div>

					<div className="p-8 space-y-6">
						<div className="flex justify-between items-center border-b border-gray-50 pb-4">
							<button
								onClick={handleBackToSelection}
								className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-400 font-bold transition-all"
							>
								<ArrowLeft className="w-4 h-4" /> Chiqish
							</button>
							<span className="text-xs font-black font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
								{currentStep + 1} / {activeTest.questions.length}
							</span>
						</div>

						<div className="space-y-4">
							<span className="text-[10px] font-black tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
								{activeTest.title}
							</span>
							<h3 className="text-lg font-black text-gray-900 dark:text-white leading-relaxed">
								{activeTest.questions[currentStep].q}
							</h3>
						</div>

						<div className="space-y-2.5 pt-2">
							{activeTest.questions[currentStep].options.map(
								(opt, optionIdx) => {
									const isSelected = userAnswers[currentStep] === optionIdx;
									return (
										<button
											key={optionIdx}
											id={`opt_btn_${currentStep}_${optionIdx}`}
											onClick={() => handleSelectOption(optionIdx)}
											className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex justify-between items-center ${
												isSelected
													? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
													: 'border-gray-100 dark:border-slate-700/50 hover:border-gray-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-slate-300'
											}`}
										>
											<span>{opt}</span>
											<div
												className={`w-4 h-4 rounded-full border flex items-center justify-center ${
													isSelected
														? 'border-indigo-600 bg-indigo-600'
														: 'border-gray-300'
												}`}
											>
												{isSelected && (
													<div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#151433]" />
												)}
											</div>
										</button>
									);
								}
							)}
						</div>

						<div className="pt-4 flex justify-end">
							<button
								id="next_step_quiz_btn"
								disabled={userAnswers[currentStep] === undefined}
								onClick={handleNextStep}
								className={`px-6 py-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all ${
									userAnswers[currentStep] !== undefined
										? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
										: 'bg-gray-100 dark:bg-slate-800/30 text-gray-400 dark:text-slate-500 cursor-not-allowed'
								}`}
							>
								{currentStep + 1 === activeTest.questions.length
									? 'Yakunlash'
									: 'Keyingi Savol'}{' '}
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 3. QUIZ FINISHED RESULTS SCREEN */}
			{activeTest && quizFinished && (
				<div
					className="max-w-2xl mx-auto bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-xs p-8 space-y-8"
					id="quiz_results_panel"
				>
					<div className="text-center space-y-3">
						<div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
							<Award className="w-8 h-8" />
						</div>
						<h3 className="text-2xl font-black text-gray-900 dark:text-white">
							Muvaffaqiyatli topshirdingiz!
						</h3>
						<p className="text-sm text-gray-500 dark:text-slate-400">
							{activeTest.title} bo'yicha natijalaringiz hisoblandi.
						</p>
					</div>

					{/* Correct count badge */}
					<div className="p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl flex justify-between items-center">
						<span className="text-xs font-extrabold text-gray-600 dark:text-slate-400">
							To'g'ri javoblar ko'rsatkichi:
						</span>
						<span className="text-lg font-black font-mono text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-xl">
							{calculateCorrectCount()} / {activeTest.questions.length}
						</span>
					</div>

					{/* Reward overview card */}
					<div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white space-y-4">
						<h4 className="text-xs font-black uppercase tracking-widest text-indigo-200">
							Sizga taqdim etiladigan mukofotlar:
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
								<div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
									<Sparkles className="w-5 h-5" />
								</div>
								<div>
									<p className="text-[10px] text-indigo-200 font-medium">
										Tajriba ballari
									</p>
									<p className="text-base font-black font-mono">
										+{activeTest.xpReward} XP
									</p>
								</div>
							</div>

							<div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
								<div className="p-2 bg-amber-500/20 rounded-xl text-amber-300">
									<Coins className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="text-[10px] text-indigo-200 font-medium">
										LifeSprint Coins
									</p>
									<p className="text-base font-black font-mono">
										+{activeTest.coinReward} Coins
									</p>
								</div>
							</div>
						</div>

						{!claimed ? (
							<button
								id="claim_rewards_btn"
								onClick={handleFinishQuiz}
								className="w-full bg-white dark:bg-[#151433] text-indigo-900 hover:bg-indigo-50 py-3.5 rounded-2xl text-xs font-black transition-all shadow-sm dark:shadow-none flex items-center justify-center gap-2"
							>
								Mukofotlarni Qabul Qilish
							</button>
						) : (
							<div className="text-center py-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5">
								<CheckCircle className="w-4 h-4 text-emerald-400" /> Balans
								muvaffaqiyatli to'ldirildi!
							</div>
						)}
					</div>

					{/* Questions review & explanations */}
					<div className="space-y-4">
						<h4 className="text-sm font-black text-gray-800 dark:text-slate-100">
							Xatolar ustida ishlash:
						</h4>
						<div className="space-y-4">
							{activeTest.questions.map((q, idx) => {
								const userAns = userAnswers[idx];
								const isCorrect = userAns === q.correct;
								return (
									<div
										key={idx}
										className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-3"
									>
										<div className="flex justify-between items-start gap-3">
											<h5 className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed">
												{idx + 1}. {q.q}
											</h5>
											{isCorrect ? (
												<span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
													<CheckCircle className="w-3 h-3" /> To'g'ri
												</span>
											) : (
												<span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
													<XCircle className="w-3 h-3" /> Noto'g'ri
												</span>
											)}
										</div>

										<div className="space-y-1 text-[11px]">
											<p className="text-gray-500 dark:text-slate-400 font-medium">
												Sizning javobingiz:{' '}
												<span className="font-bold text-gray-800 dark:text-slate-100">
													{q.options[userAns] || 'Tanlanmagan'}
												</span>
											</p>
											<p className="text-emerald-600 font-bold">
												To'g'ri javob: <span>{q.options[q.correct]}</span>
											</p>
										</div>

										<p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100/50 dark:border-slate-700/50">
											<strong className="text-gray-700 dark:text-slate-300 font-bold">
												Tushuntirish:
											</strong>{' '}
											{q.explanation}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					{claimed && (
						<button
							id="return_to_center_btn"
							onClick={handleBackToSelection}
							className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-2xl text-xs font-black transition-all"
						>
							Testlar Ro'yxatiga Qaytish
						</button>
					)}
				</div>
			)}

			{/* Pandoo AI Mentor Modal */}
			{activeTest && showPandoo && (
				<Pandoo
					isOpen={showPandoo}
					onClose={() => setShowPandoo(false)}
					testTitle={activeTest.title}
					wrongQuestions={activeTest.questions
						.map((q, idx) => ({
							question: q.q,
							options: q.options,
							correct: q.correct,
							userAnswer: userAnswers[idx] ?? -1,
							explanation: q.explanation,
						}))
						.filter((_, idx) => userAnswers[idx] !== activeTest.questions[idx].correct)}
					correctCount={calculateCorrectCount()}
					totalQuestions={activeTest.questions.length}
					setXp={setXp}
					setCoins={setCoins}
					setLevel={setLevel}
				/>
			)}
		</div>
	);
}
