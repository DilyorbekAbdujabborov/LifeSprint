import React, { useState } from 'react';
import * as api from '../api';
import {
	BookOpen,
	Sparkles,
	Coins,
	ArrowRight,
	Check,
	AlertCircle,
	Users,
	CheckCircle2,
	Tag,
	ShieldAlert,
	GraduationCap,
	ShoppingBag,
	Star,
	Clock,
	Video,
	X,
} from 'lucide-react';
import { Course, Group } from '../types';
import logoImg from '../img/logo.jpg';

interface MockStoreProps {
	courses: Course[];
	setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
	groups: Group[];
	setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
	coins: number;
	setCoins: React.Dispatch<React.SetStateAction<number>>;
	xp: number;
	setXp: React.Dispatch<React.SetStateAction<number>>;
	setLevel: React.Dispatch<React.SetStateAction<number>>;
	userRole: 'student' | 'teacher' | 'parent' | 'admin';
	isDarkMode?: boolean;
}

export default function MockStore({
	courses,
	setCourses,
	groups,
	setGroups,
	coins,
	setCoins,
	xp,
	setXp,
	setLevel,
	userRole,
	isDarkMode,
}: MockStoreProps) {
	// Status & notifications
	const [statusMsg, setStatusMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [showGrantModal, setShowGrantModal] = useState<Course | null>(null);

	const triggerStatus = (msg: string) => {
		setStatusMsg(msg);
		setTimeout(() => setStatusMsg(''), 6000);
	};

	const triggerError = (msg: string) => {
		setErrorMsg(msg);
		setTimeout(() => setErrorMsg(''), 6000);
	};

	const handleGrantConfirm = () => {
		if (!showGrantModal) return;
		const course = showGrantModal;

		setCourses((prev) =>
			prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
		);

		const studentName = 'Biloliddin Akramov';
		setGroups((prev) => {
			const existingGroup = prev.find((g) => g.courseId === course.id);
			if (existingGroup && !existingGroup.pendingStudents.includes(studentName)) {
				return prev.map((g) => {
					if (g.courseId === course.id) {
						return {
							...g,
							pendingStudents: [...g.pendingStudents, studentName],
						};
					}
					return g;
				});
			} else if (!existingGroup) {
				const newGroup = {
					id: `g_${Date.now()}`,
					name: `${course.title} Guruh`,
					teacherName: course.teacherName,
					courseTitle: course.title,
					courseId: course.id,
					studentsCount: 0,
					students: [],
					pendingStudents: [studentName],
					courseDays: [],
					courseTime: '',
					rating: course.rating,
					progress: 0,
					lessons: [],
					homeworks: [],
					quizzes: [],
					tests: [],
					announcements: [],
					files: [],
				};
				return [...prev, newGroup];
			}
			return prev;
		});

		api.rewardAndUpdate(setXp, null, setLevel, 'grant_enrollment');
		triggerStatus(
			`Tabriklaymiz! Sizga maxsus grant berildi! "${course.title}" kursi muvaffaqiyatli faollashtirildi. (+100 XP)`
		);
		setShowGrantModal(null);
	};

	// Buy course handler
	const handleBuy = (course: Course) => {
		if (course.enrolled) {
			triggerStatus(`Siz ushbu kursga allaqachon a'zo bo'lgansiz!`);
			return;
		}

		if (coins < course.priceCoins) {
			setShowGrantModal(course);
			return;
		}

		// Normal purchase with coins
		api.rewardAndUpdate(setXp, setCoins, setLevel, 'purchase_course', { priceCoins: course.priceCoins });
		setCourses((prev) =>
			prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
		);

		// Add to pendingStudents — teacher must approve
		const studentName = 'Biloliddin Akramov';
		setGroups((prev) => {
			const existingGroup = prev.find((g) => g.courseId === course.id);
			if (existingGroup && !existingGroup.pendingStudents.includes(studentName)) {
				return prev.map((g) => {
					if (g.courseId === course.id) {
						return {
							...g,
							pendingStudents: [...g.pendingStudents, studentName],
						};
					}
					return g;
				});
			} else if (!existingGroup) {
				const newGroup = {
					id: `g_${Date.now()}`,
					name: `${course.title} Guruh`,
					teacherName: course.teacherName,
					courseTitle: course.title,
					courseId: course.id,
					studentsCount: 0,
					students: [],
					pendingStudents: [studentName],
					courseDays: [],
					courseTime: '',
					rating: course.rating,
					progress: 0,
					lessons: [],
					homeworks: [],
					quizzes: [],
					tests: [],
					announcements: [],
					files: [],
				};
				return [...prev, newGroup];
			}
			return prev;
		});

		triggerStatus(
			`Tabriklaymiz! "${course.title}" kursi muvaffaqiyatli xarid qilindi!`
		);
	};

	return (
		<div
			className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a1a] text-slate-100' : 'bg-stone-50 text-gray-800'}`}
			id="mock_store_page"
		>
			{/* Page header and visual hero bar */}
			<div
				className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] p-6 sm:p-8 rounded-3xl text-white shadow-sm relative overflow-hidden"
				id="mock_hero_bar"
			>
				<div className="absolute top-0 right-0 translate-x-12 -translate-y-6 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
				<div className="relative z-10 space-y-2">
					<span className="text-[10px] font-black tracking-widest bg-black/20 px-3 py-1 rounded-full uppercase">
						KURS SOTIB OLISH VA SOTUV PANELl
					</span>
					<h1 className="text-2xl sm:text-4xl font-black">
						<ShoppingBag className="w-5 h-5 inline" /> Kurslar va Darslar
						Do'koni
					</h1>
					<p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
						Tizimdagi eng sifatli o'quv darslarini tangalaringiz evaziga xarid
						qiling yoki o'qituvchi sifatida yangi darslarni sotuvga qo'ying.
					</p>
					<div className="flex items-center gap-3 pt-2 text-xs font-black">
						<span className="bg-white/25 px-3 py-1.5 rounded-xl flex items-center gap-1">
							<Coins className="w-4 h-4 text-yellow-300 fill-current animate-bounce" />{' '}
							Sizning tangalaringiz: {coins}
						</span>
					</div>
				</div>
			</div>

			{/* Warnings & Success alerts */}
		{statusMsg && (
			<div
				className={`p-4 rounded-2xl text-xs font-black animate-fade-in flex items-center gap-2 shadow-xs ${isDarkMode ? 'bg-emerald-900/30 border border-emerald-700/40 text-emerald-300' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}
				id="store_success_alert"
			>
				<CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
				<span>{statusMsg}</span>
			</div>
		)}

		{errorMsg && (
			<div
				className={`p-4 rounded-2xl text-xs font-black animate-fade-in flex items-center gap-2 shadow-xs ${isDarkMode ? 'bg-rose-900/30 border border-rose-700/40 text-rose-300' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}
				id="store_error_alert"
			>
				<ShieldAlert className={`w-5 h-5 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
				<span>{errorMsg}</span>
			</div>
		)}

			{/* Main split grid layout */}
			<div className="space-y-6" id="mock_grid">
				<div className="space-y-6" id="mock_items_section">
					<div className="flex justify-between items-center">
						<h2 className={`text-lg font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
							<ShoppingBag className="w-5 h-5 inline" /> Sotuvdagi Barcha
							Kurslar ({courses.length})
						</h2>
						<span className="text-xs font-bold text-[#10b981]">
							Xaridlar avtomatik guruhga ulanadi
						</span>
					</div>

					<div
						className="grid grid-cols-1 md:grid-cols-2 gap-6"
						id="courses_store_grid"
					>
						{courses.map((course) => {
							const hasJoined = course.enrolled;
							return (
								<div
									key={course.id}
									className={`p-6 rounded-3xl space-y-4 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${isDarkMode ? 'bg-[#151433] border border-slate-800 shadow-none' : 'bg-white border border-gray-150 shadow-xs'}`}
								>
									<div className="space-y-3">
										<div className="flex justify-between items-start">
											<span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
												{course.category}
											</span>
											<div className={`flex items-center gap-1 text-xs font-extrabold text-amber-500 px-2 py-0.5 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
												<Star className="w-3 h-3 inline fill-current" />{' '}
												{course.rating}
											</div>
										</div>

										<h3 className={`text-base font-black leading-snug ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
											{course.title}
										</h3>
										<p className={`text-xs line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
											{course.description}
										</p>

										<div className={`pt-2 divide-y text-xs ${isDarkMode ? 'divide-slate-800 text-slate-400' : 'divide-gray-100 text-gray-500'}`}>
											<div className="py-2 flex justify-between">
												<span>
													<GraduationCap className="w-3.5 h-3.5 inline" />{' '}
													Ustoz:
												</span>
												<strong className={isDarkMode ? 'text-slate-200' : 'text-gray-900'}>
													{course.teacherName}
												</strong>
											</div>
											<div className="py-2 flex justify-between">
												<span>
													<Clock className="w-3.5 h-3.5 inline" /> Davomiyligi:
												</span>
												<strong className={isDarkMode ? 'text-slate-200' : 'text-gray-900'}>
													{course.duration}
												</strong>
											</div>
											<div className="py-2 flex justify-between">
												<span>
													<Video className="w-3.5 h-3.5 inline" /> Darslar soni:
												</span>
												<strong className={isDarkMode ? 'text-slate-200' : 'text-gray-900'}>
													{course.lessonsCount} ta video dars
												</strong>
											</div>
										</div>
									</div>

									<div className={`pt-4 flex items-center justify-between gap-3 ${isDarkMode ? 'border-t border-slate-800' : 'border-t border-gray-100'}`}>
										<div className="flex flex-col">
											<span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
												Kurs narxi:
											</span>
											<div className="flex items-center gap-2">
												{course.priceMoney ? (
													<span className="text-lg font-black text-emerald-600 font-mono">
														{course.priceMoney.toLocaleString()} so'm
													</span>
												) : (
													<span className="text-lg font-black text-purple-600 font-mono flex items-center gap-1">
														{course.priceCoins}
													</span>
												)}
											</div>
										</div>

										{hasJoined ? (
											<span className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-1 border ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/40' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
												<Check className="w-4 h-4" /> Sotib olingan
											</span>
										) : (
											<button
												onClick={() => handleBuy(course)}
												className="px-4 py-2.5 bg-[#10b981] hover:bg-[#0d9488] text-white rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer"
											>
												Sotib olish <ArrowRight className="w-3.5 h-3.5" />
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

			</div>

			{/* Grant Modal */}
			{showGrantModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setShowGrantModal(null)}>
					<div className={`max-w-md w-full p-6 rounded-3xl shadow-2xl border space-y-5 ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-gray-200'}`} onClick={e => e.stopPropagation()}>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<img src={logoImg} alt="LifeSprint" className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-emerald-500/30" />
								<div>
									<h3 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BEPUL Grant</h3>
									<p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>LifeSprint simulyatsiya tizimi</p>
								</div>
							</div>
							<button onClick={() => setShowGrantModal(null)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}>
								<X className="w-4 h-4" />
							</button>
						</div>

						<div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'}`}>
							<div className={`flex items-center gap-2 font-black text-xs uppercase tracking-wider mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
								<Sparkles className="w-4 h-4" /> Grant taklifi
							</div>
							<p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
								Sizda tangalar yetarli emas! Lekin xavotirlanmang, <strong className="text-emerald-500">"LifeSprint" tizimi</strong> orqali 100% BEPUL Grant (Simulyatsiya) yordamida kursni faollashtirishni xohlaysizmi?
							</p>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowGrantModal(null)}
								className={`flex-1 py-3 rounded-xl text-sm font-black transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
							>
								Yo'q
							</button>
							<button
								onClick={handleGrantConfirm}
								className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
							>
								<Sparkles className="w-4 h-4" /> Ha, faollashtirish
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
