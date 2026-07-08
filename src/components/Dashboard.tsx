import React, { useState } from 'react';
import { CheckCircle2, Award, BookOpen } from 'lucide-react';
import * as api from '../api';
import { EmptyState } from './Skeleton';
import type { AuthUser } from '../api';
import type { Course, ConsultationSession, LmsCertificate, Group, Task, Exam } from '../types';
import StudentOverview from './StudentOverview';
import StudentGroupsView from './StudentGroupsView';
import StudentMooc from './StudentMooc';
import StudentQuizzes from './StudentQuizzes';
import StudentTests from './StudentTests';
import TeacherPanel from './TeacherPanel';
import AdminPanel from './AdminPanel';

interface DashboardProps {
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  exams: Exam[]; xp: number; setXp: React.Dispatch<React.SetStateAction<number>>;
  coins: number; setCoins: React.Dispatch<React.SetStateAction<number>>;
  level: number; setLevel: React.Dispatch<React.SetStateAction<number>>;
  courses: Course[]; setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  groups: Group[]; setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  consultations: ConsultationSession[]; setConsultations: React.Dispatch<React.SetStateAction<ConsultationSession[]>>;
  certificates: LmsCertificate[]; setCertificates: React.Dispatch<React.SetStateAction<LmsCertificate[]>>;
  user: AuthUser | null; userRole: 'student' | 'teacher' | 'parent' | 'admin';
  setCurrentTab?: (tab: string) => void; isDarkMode: boolean;
}

export default function Dashboard({
  tasks, setTasks, exams, xp, setXp, coins, setCoins, level, setLevel,
  courses, setCourses, groups, setGroups, consultations, setConsultations,
  certificates, setCertificates, user, userRole, setCurrentTab, isDarkMode,
}: DashboardProps) {
  const [studentTab, setStudentTab] = useState<'overview' | 'mock_store' | 'groups' | 'quizzes' | 'tests' | 'reyting' | 'homeworks' | 'certificates'>('overview');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const triggerStatus = (msg: string) => { setStatusMsg(msg); setTimeout(() => setStatusMsg(''), 4000); };
  const studentGroups = groups.filter((g) => g.students.includes(user?.name || 'Biloliddin Akramov'));
  const pendingGroups = groups.filter((g) => g.pendingStudents?.includes(user?.name || 'Biloliddin Akramov'));

  const handleBuyCourse = (course: Course) => {
    if (coins < course.priceCoins) { triggerStatus(`Tanga yetarli emas! Yana ${course.priceCoins - coins} tanga kerak.`); return; }
    api.rewardAndUpdate(setXp, setCoins, setLevel, 'purchase_course', { priceCoins: course.priceCoins });
    setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c)));
    const studentName = user?.name || 'Biloliddin Akramov';
    setGroups((prev) => prev.map((g) => {
      if (g.courseId === course.id && !g.students.includes(studentName)) {
        return { ...g, students: [...g.students, studentName], studentsCount: g.studentsCount + 1 };
      }
      return g;
    }));
  };

  const studentTabs = [
    { id: 'overview', label: 'Bosh Sahifa' }, { id: 'groups', label: 'Mening Guruhlarim' },
    { id: 'mock_store', label: "Mock Do'koni" }, { id: 'quizzes', label: 'Quizlar' },
    { id: 'tests', label: 'Imtihon & Testlar' }, { id: 'homeworks', label: 'Topshiriqlar' },
    { id: 'reyting', label: 'Reyting' },
    { id: 'certificates', label: 'Sertifikatlar' },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 pb-8 sm:p-6">
      {statusMsg && (
        <div className="app-panel flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs animate-fade-in dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" role="status" aria-live="polite">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* STUDENT VIEW */}
      {userRole === 'student' && (
        <div className="space-y-6">
          <nav className="flex gap-2 overflow-x-auto border-b border-[color:var(--border)] pb-3 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Talaba panellari">
            {studentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setStudentTab(tab.id); setActiveGroupId(null); }}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                  studentTab === tab.id
                    ? 'bg-[color:var(--brand)] text-[color:var(--brand-contrast)] shadow-xs'
                    : 'border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:bg-[color:var(--surface-2)]'
                }`}
                type="button"
                aria-current={studentTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {studentTab === 'overview' && (
            <StudentOverview
              xp={xp} coins={coins} level={level} user={user}
              studentGroups={studentGroups} groups={groups} courses={courses}
              setXp={setXp} setCoins={setCoins} setLevel={setLevel}
              setGroups={setGroups}
              onNavigate={(tab) => setStudentTab(tab as any)}
              onEnterGroup={(id) => { setActiveGroupId(id); setStudentTab('groups'); }}
              triggerStatus={triggerStatus} isDarkMode={isDarkMode}
            />
          )}

          {studentTab === 'groups' && (
            <StudentGroupsView
              groups={groups} studentGroups={studentGroups}
              xp={xp} coins={coins} setXp={setXp} setCoins={setCoins} setLevel={setLevel}
              setGroups={setGroups} triggerStatus={triggerStatus} isDarkMode={isDarkMode}
            />
          )}

          {studentTab === 'mock_store' && (
            <StudentMooc
              courses={courses}
              coins={coins}
              onBuyCourse={handleBuyCourse}
            />
          )}

          {studentTab === 'quizzes' && (
            <StudentQuizzes
              studentGroups={studentGroups}
              setXp={setXp} setCoins={setCoins} setLevel={setLevel}
              setGroups={setGroups} activeGroupId={activeGroupId}
            />
          )}

          {studentTab === 'tests' && (
            <StudentTests
              studentGroups={studentGroups}
              setXp={setXp} setCoins={setCoins} setLevel={setLevel}
              setGroups={setGroups} activeGroupId={activeGroupId}
            />
          )}

          {studentTab === 'homeworks' && (
            <div className="space-y-6 text-left">
              <h2 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">Mening faol uy vazifalarim</h2>
              {studentGroups.flatMap((g) => g.homeworks).length === 0 ? (
                <EmptyState icon={BookOpen} title="Vazifalar yo'q" description="Hali hech qanday uy vazifasi berilmagan." />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {studentGroups.flatMap((g) => g.homeworks.map((hw) => ({ ...hw, groupName: g.name }))).map((hw) => (
                    <div key={hw.id} className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">{hw.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Guruh: {hw.groupName} &bull; Muddat: <strong className="text-rose-500">{hw.deadline}</strong>
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${hw.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {hw.status === 'completed' ? `${hw.score} ball` : 'Kutilmoqda'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {studentTab === 'reyting' && (
            <div className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4 text-left">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Reyting</h2>
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {[
                  { rank: 1, name: 'Biloliddin A.', xp: xp, school: 'Prezident Maktabi' },
                  { rank: 2, name: 'Saidabror A.', xp: 9836, school: 'Prezident Maktabi' },
                  { rank: 3, name: 'Bunyodbek N.', xp: 9249, school: 'Prezident Maktabi' },
                ].map((u) => (
                  <div key={u.rank} className="flex items-center justify-between py-3 px-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-mono font-bold text-xs text-gray-500" aria-label={`${u.rank}-o'rin`}>#{u.rank}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.school}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500 font-mono">{u.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {studentTab === 'certificates' && (
            <div className="space-y-4 text-left">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mening sertifikatlarim</h2>
              {certificates.length === 0 ? (
                <EmptyState icon={Award} title="Sertifikatlar yo'q" description="Hali hech qanday sertifikat olmagansiz. Kurslarni tugating va sertifikatlarga ega bo'ling!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="p-6 bg-white dark:bg-[#151433] rounded-3xl border border-gray-100 dark:border-slate-800 space-y-3">
                      <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Award className="w-12 h-12 text-white/80" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">{cert.courseTitle}</h3>
                      <p className="text-[10px] text-gray-400">{cert.studentName} &bull; {cert.issueDate}</p>
                      <span className="text-[9px] font-mono text-gray-400 block truncate">ID: {cert.credentialId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TEACHER VIEW */}
      {userRole === 'teacher' && (
        <TeacherPanel
          groups={groups}
          courses={courses}
          certificates={certificates}
          setGroups={setGroups}
          setCourses={setCourses}
          setCertificates={setCertificates}
          triggerStatus={triggerStatus}
        />
      )}

      {/* ADMIN VIEW */}
      {userRole === 'admin' && <AdminPanel />}
    </div>
  );
}
