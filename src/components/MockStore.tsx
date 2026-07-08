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
} from 'lucide-react';
import { Course, Group } from '../types';

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
}: MockStoreProps) {
	// Status & notifications
	const [statusMsg, setStatusMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const triggerStatus = (msg: string) => {
		setStatusMsg(msg);
		setTimeout(() => setStatusMsg(''), 6000);
	};

	const triggerError = (msg: string) => {
		setErrorMsg(msg);
		setTimeout(() => setErrorMsg(''), 6000);
	};

	// Buy course handler
	const handleBuy = (course: Course) => {
		if (course.enrolled) {
			triggerStatus(`Siz ushbu kursga allaqachon a'zo bo'lgansiz!`);
			return;
		}

		if (coins < course.priceCoins) {
			// Free Simulating Grant!
			const grantConfirm = window.confirm(
				`Sizda tangalar yetarli emas! Lekin xavotirlanmang, "LifeSprint" tizimi orqali 100% BEPUL Grant (Simulyatsiya) yordamida kursni faollashtirishni xohlaysizmi?`
			);
			if (grantConfirm) {
				// Enrol for free as mock demo
				setCourses((prev) =>
					prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
				);

				// Add to group (both students and pending so it shows in "Mening darslarim")
				const studentName = 'Biloliddin Akramov';
				setGroups((prev) => {
					const existingGroup = prev.find((g) => g.courseId === course.id);
					if (existingGroup && !existingGroup.students.includes(studentName)) {
						return prev.map((g) => {
							if (g.courseId === course.id) {
								return {
									...g,
									students: [...g.students, studentName],
									pendingStudents: [...g.pendingStudents, studentName],
									studentsCount: g.studentsCount + 1,
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
							studentsCount: 1,
							students: [studentName],
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
			}
			return;
		}

		// Normal purchase with coins
		api.rewardAndUpdate(setXp, setCoins, setLevel, 'purchase_course', { priceCoins: course.priceCoins });
		setCourses((prev) =>
			prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
		);

		// Add to group (both students and pending so it shows in "Mening darslarim")
		const studentName = 'Biloliddin Akramov';
		setGroups((prev) => {
			const existingGroup = prev.find((g) => g.courseId === course.id);
			if (existingGroup && !existingGroup.students.includes(studentName)) {
				return prev.map((g) => {
					if (g.courseId === course.id) {
						return {
							...g,
							students: [...g.students, studentName],
							pendingStudents: [...g.pendingStudents, studentName],
							studentsCount: g.studentsCount + 1,
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
					studentsCount: 1,
					students: [studentName],
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
			className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto bg-stone-50 min-h-screen text-gray-800"
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
					className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-black text-emerald-800 animate-fade-in flex items-center gap-2 shadow-xs"
					id="store_success_alert"
				>
					<CheckCircle2 className="w-5 h-5 text-emerald-600" />
					<span>{statusMsg}</span>
				</div>
			)}

			{errorMsg && (
				<div
					className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-black text-rose-800 animate-fade-in flex items-center gap-2 shadow-xs"
					id="store_error_alert"
				>
					<ShieldAlert className="w-5 h-5 text-rose-600" />
					<span>{errorMsg}</span>
				</div>
			)}

			{/* Main split grid layout */}
			<div className="space-y-6" id="mock_grid">
				<div className="space-y-6" id="mock_items_section">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-black uppercase tracking-wider text-gray-900">
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
									className="bg-white p-6 border border-gray-150 rounded-3xl space-y-4 shadow-xs transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
								>
									<div className="space-y-3">
										<div className="flex justify-between items-start">
											<span className="text-[10px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full uppercase">
												{course.category}
											</span>
											<div className="flex items-center gap-1 text-xs font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
												<Star className="w-3 h-3 inline fill-current" />{' '}
												{course.rating}
											</div>
										</div>

										<h3 className="text-base font-black text-gray-950 leading-snug">
											{course.title}
										</h3>
										<p className="text-xs text-gray-500 line-clamp-3">
											{course.description}
										</p>

										<div className="pt-2 divide-y divide-gray-100 text-xs text-gray-500">
											<div className="py-2 flex justify-between">
												<span>
													<GraduationCap className="w-3.5 h-3.5 inline" />{' '}
													Ustoz:
												</span>
												<strong className="text-gray-900">
													{course.teacherName}
												</strong>
											</div>
											<div className="py-2 flex justify-between">
												<span>
													<Clock className="w-3.5 h-3.5 inline" /> Davomiyligi:
												</span>
												<strong className="text-gray-900">
													{course.duration}
												</strong>
											</div>
											<div className="py-2 flex justify-between">
												<span>
													<Video className="w-3.5 h-3.5 inline" /> Darslar soni:
												</span>
												<strong className="text-gray-900">
													{course.lessonsCount} ta video dars
												</strong>
											</div>
										</div>
									</div>

									<div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-400 font-bold uppercase">
												Kurs narxi:
											</span>
											<span className="text-lg font-black text-purple-600 font-mono flex items-center gap-1">
												{course.priceCoins}
											</span>
										</div>

										{hasJoined ? (
											<span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase flex items-center gap-1 border border-emerald-100">
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
		</div>
	);
}
