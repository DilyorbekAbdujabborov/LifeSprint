import React, { useState } from 'react';
import * as api from '../api';
import { EmptyState } from './Skeleton';
import type { Group, Course, LmsCertificate } from '../types';
import { BookOpen, Users, ClipboardList, UserPlus, UserCheck, Calendar, Clock } from 'lucide-react';

interface TeacherPanelProps {
  groups: Group[];
  courses: Course[];
  certificates: LmsCertificate[];
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  setCourses: (v: Course[] | ((prev: Course[]) => Course[])) => void;
  setCertificates: (v: LmsCertificate[] | ((prev: LmsCertificate[]) => LmsCertificate[])) => void;
  triggerStatus: (msg: string) => void;
}

export default function TeacherPanel({
  groups, courses, certificates, setGroups, setCourses, setCertificates, triggerStatus,
}: TeacherPanelProps) {
  const [teacherTab, setTeacherTab] = useState<'lessons' | 'groups' | 'quizzes' | 'attendance' | 'schedule'>('lessons');
  const [selectedGroupForLesson, setSelectedGroupForLesson] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('45 daqiqa');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Dasturlash');
  const [newCoursePrice, setNewCoursePrice] = useState(100);
  const [selectedGroupForQuiz, setSelectedGroupForQuiz] = useState('');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCount, setNewQuizCount] = useState(10);
  const [addStudentName, setAddStudentName] = useState('Saidabror Abdusaidov');
  const [addStudentGroupId, setAddStudentGroupId] = useState('');
  const [certStudentName, setCertStudentName] = useState('Bunyodbek Nematov');
  const [certCourseTitle, setCertCourseTitle] = useState("Frontend Dasturlash (React & Next.js)");
  const [scheduleGroupId, setScheduleGroupId] = useState('');
  const [scheduleDays, setScheduleDays] = useState('Dush, Chorsh, Jum');
  const [scheduleTime, setScheduleTime] = useState('14:00 - 15:30');

  const teacherTabs = [
    { id: 'lessons', label: 'Darslar & Video', icon: BookOpen },
    { id: 'groups', label: 'Guruhlar', icon: Users },
    { id: 'quizzes', label: 'Quiz yaratish', icon: ClipboardList },
    { id: 'attendance', label: "O'quvchilar", icon: UserPlus },
    { id: 'schedule', label: 'Dars jadvali', icon: Calendar },
  ];

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !selectedCourseId) { triggerStatus('Guruh nomi va kursni tanlang!'); return; }
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const newGroup: Group = {
      id: `g_${Date.now()}`, name: newGroupName, teacherName: 'Prof. Olima Tursunova',
      courseTitle: selectedCourse?.title || 'Boshqa Kurs', courseId: selectedCourseId,
      studentsCount: 3, students: ['Saidabror Abdusaidov', 'Bunyodbek Nematov', 'Kamron Ergashev'],
      pendingStudents: [], courseDays: [], courseTime: '14:00 - 15:30',
      rating: 5.0, progress: 5,
      lessons: [{ id: `l_${Date.now()}-1`, title: 'Kirish va tushunchalar', videoUrl: 'https://www.youtube.com/embed/t29cQMUrhdM', duration: '30 daqiqa', date: '2026-07-10', completed: false }],
      homeworks: [{ id: `hw_${Date.now()}-1`, title: "Kursga kirish darsligi konspekti", deadline: '2026-07-15', status: 'pending' as const }],
      quizzes: [{ id: `qz_${Date.now()}-1`, title: 'Dastlabki bilim testi', questionsCount: 5, completed: false, category: 'Guruh' }],
      tests: [], announcements: [{ id: `an_${Date.now()}-1`, author: 'Prof. Olima Tursunova', content: 'Guruhimiz tashkil etildi!', date: '2026-07-08' }],
      files: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    api.createGroup(newGroup).then((res) => res.groups && setGroups(res.groups)).catch(() => {});
    triggerStatus(`"${newGroupName}" guruhi yaratildi!`);
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const newCourse: Course = {
      id: `c_${Date.now()}`, title: newCourseTitle, description: newCourseDesc || "Hech qanday tavsif yo'q.",
      teacherName: 'Prof. Olima Tursunova', priceCoins: newCoursePrice, enrolled: false,
      duration: '3 oy (24 dars)', lessonsCount: 24, rating: 5.0, ratingCount: 1,
      category: newCourseCategory, color: 'indigo',
    };
    setCourses([...courses, newCourse]);
    setNewCourseTitle(''); setNewCourseDesc('');
    api.publishCourse(newCourse).then((res) => res.courses && setCourses(res.courses)).catch(() => {});
    triggerStatus(`"${newCourseTitle}" kursi yaratildi!`);
  };

  return (
    <div className="space-y-6">
      <nav className="flex gap-2 overflow-x-auto pb-3 border-b border-gray-200 dark:border-slate-800 scrollbar-thin" aria-label="O'qituvchi panellari">
        {teacherTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTeacherTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              teacherTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-[#151433] text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
            type="button"
            aria-current={teacherTab === tab.id ? 'page' : undefined}
          >
            <tab.icon className="w-3.5 h-3.5 inline mr-1.5" />
            {tab.label}
          </button>
        ))}
      </nav>

      {teacherTab === 'lessons' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedGroupForLesson || !newLessonTitle.trim()) { triggerStatus('Guruh va dars nomini kiriting!'); return; }
            setGroups((prev) => prev.map((g) =>
              g.id === selectedGroupForLesson
                ? { ...g, lessons: [...g.lessons, { id: `l_${Date.now()}`, title: newLessonTitle, videoUrl: newLessonVideo || 'https://www.youtube.com/embed/t29cQMUrhdM', duration: newLessonDuration, date: '2026-07-10', completed: false }] }
                : g
            ));
            setNewLessonTitle(''); setNewLessonVideo('');
            triggerStatus('Dars yuklandi!');
          }}
          className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dars yuklash</h2>
          <div>
            <label htmlFor="teacher-lesson-group" className="sr-only">Guruhni tanlang</label>
            <select
              id="teacher-lesson-group"
              value={selectedGroupForLesson}
              onChange={(e) => setSelectedGroupForLesson(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="teacher-lesson-title" className="sr-only">Dars sarlavhasi</label>
            <input
              id="teacher-lesson-title"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="Dars sarlavhasi"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="teacher-lesson-video" className="sr-only">Video URL</label>
            <input
              id="teacher-lesson-video"
              value={newLessonVideo}
              onChange={(e) => setNewLessonVideo(e.target.value)}
              placeholder="Video URL (YouTube)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            Darsni yuklash
          </button>
        </form>
      )}

      {teacherTab === 'groups' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateGroup} className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Yangi guruh yaratish</h2>
            <div>
              <label htmlFor="teacher-group-name" className="sr-only">Guruh nomi</label>
              <input
                id="teacher-group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Guruh nomi"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="teacher-group-course" className="sr-only">Kursni tanlang</label>
              <select
                id="teacher-group-course"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <option value="">Kursni tanlang</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Guruh yaratish
            </button>
          </form>

          <form onSubmit={handlePublishCourse} className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Yangi kurs yaratish</h2>
            <div>
              <label htmlFor="teacher-course-title" className="sr-only">Kurs nomi</label>
              <input
                id="teacher-course-title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="Kurs nomi"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="teacher-course-desc" className="sr-only">Kurs haqida</label>
              <textarea
                id="teacher-course-desc"
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                rows={3}
                placeholder="Kurs haqida qisqacha"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="teacher-course-category" className="sr-only">Kategoriya</label>
                <select
                  id="teacher-course-category"
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  {['Dasturlash', 'Matematika', 'Ingliz tili', 'Tarix', 'Fizika'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label htmlFor="teacher-course-price" className="sr-only">Narxi</label>
                <input
                  id="teacher-course-price"
                  type="number"
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Kursni nashr qilish
            </button>
          </form>
        </div>
      )}

      {teacherTab === 'quizzes' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedGroupForQuiz || !newQuizTitle.trim()) return;
            setGroups((prev) => prev.map((g) =>
              g.id === selectedGroupForQuiz
                ? { ...g, quizzes: [...g.quizzes, { id: `qz_${Date.now()}`, title: newQuizTitle, questionsCount: newQuizCount, completed: false, category: 'Guruh' }] }
                : g
            ));
            setNewQuizTitle('');
            triggerStatus('Quiz yaratildi!');
          }}
          className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quiz yaratish</h2>
          <div>
            <label htmlFor="teacher-quiz-group" className="sr-only">Guruhni tanlang</label>
            <select
              id="teacher-quiz-group"
              value={selectedGroupForQuiz}
              onChange={(e) => setSelectedGroupForQuiz(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="teacher-quiz-title" className="sr-only">Quiz nomi</label>
            <input
              id="teacher-quiz-title"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              placeholder="Quiz nomi"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="teacher-quiz-count" className="sr-only">Savollar soni</label>
            <input
              id="teacher-quiz-count"
              type="number"
              value={newQuizCount}
              onChange={(e) => setNewQuizCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Quiz yaratish
          </button>
        </form>
      )}

      {teacherTab === 'attendance' && (
        <div className="space-y-6">
          {/* Pending Students Section */}
          <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" /> Kutayotgan o'quvchilar
            </h2>
            <p className="text-xs text-gray-400">Kurs sotib olgan, tasdiqlanmagan o'quvchilar</p>
            {groups.filter(g => g.pendingStudents?.length > 0).length === 0 ? (
              <EmptyState icon={UserPlus} title="Kutayotgan o'quvchilar yo'q" description="Hali hech kim kurs sotib olmagan." />
            ) : (
              groups.filter(g => g.pendingStudents?.length > 0).map(g => (
                <div key={g.id} className="border rounded-2xl p-4 border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{g.name}</h3>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                      {g.pendingStudents.length} ta
                    </span>
                  </div>
                  <div className="space-y-2">
                    {g.pendingStudents.map(st => (
                      <div key={st} className="flex items-center justify-between bg-white dark:bg-slate-800/50 rounded-xl px-4 py-2.5 border border-gray-100 dark:border-slate-700/30">
                        <span className="text-xs font-bold text-gray-800 dark:text-white">{st}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setGroups(prev => prev.map(group =>
                                group.id === g.id
                                  ? {
                                      ...group,
                                      pendingStudents: group.pendingStudents.filter(s => s !== st),
                                      students: [...group.students, st],
                                      studentsCount: group.studentsCount + 1,
                                    }
                                  : group
                              ));
                              triggerStatus(`"${st}" guruhga tasdiqlandi!`);
                            }}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                            type="button"
                          >
                            Tasdiqlash
                          </button>
                          <button
                            onClick={() => {
                              setGroups(prev => prev.map(group =>
                                group.id === g.id
                                  ? { ...group, pendingStudents: group.pendingStudents.filter(s => s !== st) }
                                  : group
                              ));
                              triggerStatus(`"${st}" rad etildi.`);
                            }}
                            className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-200 dark:hover:bg-rose-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                            type="button"
                          >
                            Rad etish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Student Manually */}
          <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">O'quvchi qo'shish</h2>
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                if (!addStudentName.trim() || !addStudentGroupId) { triggerStatus('Ism va guruhni tanlang!'); return; }
                const matchedGroup = groups.find((g) => g.id === addStudentGroupId);
                if (!matchedGroup) { triggerStatus('Guruh topilmadi!'); return; }
                if (matchedGroup.students.includes(addStudentName) || matchedGroup.pendingStudents?.includes(addStudentName)) { triggerStatus("Bu o'quvchi allaqachon guruhda yoki kutmoqda!"); return; }
                setGroups((prev) => prev.map((g) =>
                  g.id === addStudentGroupId
                    ? { ...g, pendingStudents: [...(g.pendingStudents || []), addStudentName] }
                    : g
                ));
                setAddStudentName('Saidabror Abdusaidov');
                triggerStatus(`"${addStudentName}" kutayotganlar ro'yxatiga qo'shildi!`);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="teacher-student-name" className="sr-only">O'quvchi ismi</label>
                <input
                  id="teacher-student-name"
                  value={addStudentName}
                  onChange={(e) => setAddStudentName(e.target.value)}
                  placeholder="O'quvchi ismi"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="teacher-student-group" className="sr-only">Guruhni tanlang</label>
                <select
                  id="teacher-student-group"
                  value={addStudentGroupId}
                  onChange={(e) => setAddStudentGroupId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <option value="">Guruhni tanlang</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Kutish ro'yxatiga qo'shish
              </button>
            </form>

            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                const newCert: LmsCertificate = {
                  id: `cert_${Date.now()}`, studentName: certStudentName, courseTitle: certCourseTitle,
                  issueDate: '2026-07-08', credentialId: `LS-CERT-${Math.floor(100000 + Math.random() * 900000)}`, downloadUrl: '',
                };
                setCertificates([...certificates, newCert]);
                api.issueCertificate(newCert)
                  .then((res) => { if (res.certificates) setCertificates(res.certificates); })
                  .catch(() => {});
                triggerStatus(`"${certStudentName}" ga sertifikat berildi!`);
              }}
              className="mt-6 space-y-4 pt-6 border-t border-gray-100 dark:border-slate-800"
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Sertifikat berish</h3>
              <div>
                <label htmlFor="teacher-cert-student" className="sr-only">Talaba ismi</label>
                <input
                  id="teacher-cert-student"
                  value={certStudentName}
                  onChange={(e) => setCertStudentName(e.target.value)}
                  placeholder="Talaba ismi"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="teacher-cert-course" className="sr-only">Kurs nomi</label>
                <input
                  id="teacher-cert-course"
                  value={certCourseTitle}
                  onChange={(e) => setCertCourseTitle(e.target.value)}
                  placeholder="Kurs nomi"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Sertifikat berish
              </button>
            </form>
          </div>
        </div>
      )}

      {teacherTab === 'schedule' && (
        <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Dars jadvali
          </h2>
          <p className="text-xs text-gray-400">Guruh uchun dars kunlari va vaqtini belgilang</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!scheduleGroupId) { triggerStatus('Guruhni tanlang!'); return; }
              const daysMap: Record<string, string> = { 'Dush': '2026-07-', 'Sesh': '2026-07-', 'Chorsh': '2026-07-', 'Pay': '2026-07-', 'Jum': '2026-07-' };
              const shortDays = scheduleDays.split(',').map(d => d.trim());
              const startDay = 7;
              const generatedDays: string[] = [];
              for (let d = 0; d < 30; d++) {
                const dayName = ['Yak','Dush','Sesh','Chorsh','Pay','Jum','Shan'][(startDay + d) % 7];
                if (shortDays.includes(dayName)) {
                  generatedDays.push(`2026-07-${String(d + 1).padStart(2, '0')}`);
                }
              }
              setGroups(prev => prev.map(g =>
                g.id === scheduleGroupId
                  ? { ...g, courseDays: generatedDays, courseTime: scheduleTime }
                  : g
              ));
              triggerStatus(`Jadval yangilandi! ${generatedDays.length} ta dars kuni belgilandi.`);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="teacher-schedule-group" className="text-xs font-bold text-gray-500 block mb-1">Guruh</label>
              <select
                id="teacher-schedule-group"
                value={scheduleGroupId}
                onChange={(e) => {
                  setScheduleGroupId(e.target.value);
                  const g = groups.find(gr => gr.id === e.target.value);
                  if (g) {
                    setScheduleDays(g.courseDays?.length ? 'Dush, Chorsh, Jum' : 'Dush, Chorsh, Jum');
                    setScheduleTime(g.courseTime || '14:00 - 15:30');
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="">Guruhni tanlang</option>
                {groups.filter(g => g.students.length > 0 || g.pendingStudents?.length > 0).map((g) => (
                  <option key={g.id} value={g.id}>{g.name} ({g.students.length + (g.pendingStudents?.length || 0)} o'quvchi)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="teacher-schedule-days" className="text-xs font-bold text-gray-500 block mb-1">Dars kunlari</label>
                <input
                  id="teacher-schedule-days"
                  value={scheduleDays}
                  onChange={(e) => setScheduleDays(e.target.value)}
                  placeholder="Dush, Chorsh, Jum"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <p className="text-[9px] text-gray-400 mt-1">Qisqa nomlar: Dush, Sesh, Chorsh, Pay, Jum, Shan, Yak</p>
              </div>
              <div>
                <label htmlFor="teacher-schedule-time" className="text-xs font-bold text-gray-500 block mb-1">
                  <Clock className="w-3 h-3 inline" /> Dars vaqti
                </label>
                <input
                  id="teacher-schedule-time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="14:00 - 15:30"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Jadvalni saqlash
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
