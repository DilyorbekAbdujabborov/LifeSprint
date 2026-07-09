import { useEffect, lazy, Suspense, useState, useRef } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider } from './toast';
import { useStore } from './store';
import AuthScreen from './components/AuthScreen';
import Navigation from './components/Navigation';
import Header from './components/Header';
import LevelModal from './components/LevelModal';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import PandooChat from './components/PandooChat';
import { Loader2, MessageCircle, X } from 'lucide-react';

const Discipline = lazy(() => import('./components/Discipline'));
const Academics = lazy(() => import('./components/Academics'));
const TestCenter = lazy(() => import('./components/TestCenter'));
const UniversityFinder = lazy(() => import('./components/University'));
const Consulting = lazy(() => import('./components/Consulting'));
const ParentPanel = lazy(() => import('./components/ParentPanel'));
const MockStore = lazy(() => import('./components/MockStore'));
const GameZone = lazy(() => import('./components/GameZone'));
const StudentGroupsView = lazy(() => import('./components/StudentGroupsView'));
const StudentTests = lazy(() => import('./components/StudentTests'));
const EduBattle = lazy(() => import('./components/EduBattle'));
const EduTeam = lazy(() => import('./components/EduTeam'));

const LoaderScreen = ({ label }: { label: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] text-[color:var(--text)]">
    <div className="app-panel flex flex-col items-center gap-3 px-6 py-5">
      <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand)]" />
      <span className="text-xs font-semibold text-[color:var(--text-muted)]">{label}</span>
    </div>
  </div>
);

const PageLoader = () => (
  <div className="flex h-full items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand)]" />
  </div>
);

const TAB_ID_TO_HASH: Record<string, string> = {
  dashboard: '/', discipline: 'discipline',
  academics: 'academics', testcenter: 'testcenter',
  mock_store: 'mock-store',
  university: 'university', consulting: 'consulting',
  gamezone: 'gamezone',
  student_mygroups: 'my-groups', student_mytests: 'my-tests', student_myhomework: 'my-homework',
  edu_battle: 'edu-battle', edu_team: 'edu-team',
};

const HASH_TO_TAB_ID: Record<string, string> = {};
for (const [tab, hash] of Object.entries(TAB_ID_TO_HASH)) {
  HASH_TO_TAB_ID[hash] = tab;
}

function AppMain() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const storeCurrentTab = useStore((s) => s.currentTab);
  const {
    loaded, loading, xp, level, coins, tasks, exams, habits, courses, groups,
    consultations, certificates, portfolio, posts, leaderboard, events,
    userRole, isDarkMode, sidebarOpen, setSidebarOpen, setCurrentTab,
    loadState, saveState,
  } = useStore();

  const [pandooOpen, setPandooOpen] = useState(false);
  const synced = useRef(false);

  // One-time initial sync: hash → store, then allow store → hash
  useEffect(() => {
    const hashKey = location.pathname === '/' ? '/' : location.pathname.replace(/^\//, '');
    const tab = HASH_TO_TAB_ID[hashKey] || 'dashboard';
    setCurrentTab(tab);
    synced.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Browser back/forward: sync hash → store
  useEffect(() => {
    const handlePop = () => {
      const hk = location.pathname === '/' ? '/' : location.pathname.replace(/^\//, '');
      const tab = HASH_TO_TAB_ID[hk] || 'dashboard';
      setCurrentTab(tab);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [location.pathname, setCurrentTab]);

  // Store → Hash (only after initial sync)
  useEffect(() => {
    if (!synced.current) return;
    const target = TAB_ID_TO_HASH[storeCurrentTab];
    if (target && location.pathname !== (target === '/' ? '/' : '/' + target)) {
      navigate(target === '/' ? '/' : '/' + target, { replace: true });
    }
  }, [storeCurrentTab, navigate, location.pathname]);

  useEffect(() => {
    loadState().then(() => {
      useStore.getState().loadGameProfile();
    });
    const n = setInterval(() => useStore.getState().saveState(), 30000);
    const onUnload = () => useStore.getState().saveState();
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(n);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  const renderView = () => {
    if (userRole === 'parent') return <ParentPanel habits={habits} xp={xp} />;
    if (!loaded && loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" /></div>;

    const common = { xp, level, setXp: useStore.getState().setXp, setLevel: useStore.getState().setLevel, coins, setCoins: useStore.getState().setCoins, isDarkMode };

    switch (storeCurrentTab) {
      case 'dashboard': return <Dashboard tasks={tasks} setTasks={useStore.getState().setTasks} exams={exams} courses={courses} setCourses={useStore.getState().setCourses} groups={groups} setGroups={useStore.getState().setGroups} consultations={consultations} setConsultations={useStore.getState().setConsultations} certificates={certificates} setCertificates={useStore.getState().setCertificates} user={user} userRole={userRole} setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} {...common} />;
      case 'discipline': return <Discipline habits={habits} setHabits={useStore.getState().setHabits} {...common} />;
      case 'academics': return <Academics courses={courses} setCourses={useStore.getState().setCourses} userRole={userRole} {...common} />;
      case 'testcenter': return <TestCenter {...common} />;
      case 'mock_store': return <MockStore courses={courses} setCourses={useStore.getState().setCourses} groups={groups} setGroups={useStore.getState().setGroups} userRole={userRole} {...common} />;
      case 'university': return <UniversityFinder />;
      case 'consulting': return <Consulting />;
      case 'gamezone':
        return <GameZone />;
      case 'edu_battle':
        return <EduBattle {...common} />;
      case 'edu_team':
        return <EduTeam {...common} />;
      case 'student_mygroups': {
        const studentName = user?.name || 'Biloliddin Akramov';
        const approvedGroups = groups.filter((g) => g.students.includes(studentName));
        const pendingGroups = groups.filter((g) => g.pendingStudents?.includes(studentName) && !g.students.includes(studentName));
        const hasAnyActivity = approvedGroups.length > 0 || pendingGroups.length > 0;
        if (!hasAnyActivity) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Guruhlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                <p className="text-base font-bold">Iltimos, avval dars sotib oling</p>
                <p className="text-xs mt-2">Kurslar do'koniga o'ting va o'zingizga mos kursni xarid qiling</p>
                <button onClick={() => navigate('/mock-store')} className="mt-4 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer">
                  Kurslar do'koni
                </button>
              </div>
            </div>
          );
        }
        if (approvedGroups.length === 0 && pendingGroups.length > 0) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Guruhlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-amber-800/30 text-amber-400' : 'bg-white border-amber-200 text-amber-600'}`}>
                <p className="text-base font-bold">Tasdiqlash kutilmoqda</p>
                <p className="text-xs mt-2">Sizning xaridingiz o'qituvchi tomonidan tasdiqlanishi kutilmoqda. Bu biroz vaqt olishi mumkin.</p>
              </div>
            </div>
          );
        }
        const triggerStatus = (msg: string) => {};
        return <StudentGroupsView groups={groups} studentGroups={approvedGroups} xp={xp} coins={coins} setXp={useStore.getState().setXp} setCoins={useStore.getState().setCoins} setLevel={useStore.getState().setLevel} setGroups={useStore.getState().setGroups} triggerStatus={triggerStatus} isDarkMode={isDarkMode} />;
      }
      case 'student_mytests': {
        const studentName = user?.name || 'Biloliddin Akramov';
        const approvedGroups = groups.filter((g) => g.students.includes(studentName));
        const pendingGroups = groups.filter((g) => g.pendingStudents?.includes(studentName) && !g.students.includes(studentName));
        const hasAnyActivity = approvedGroups.length > 0 || pendingGroups.length > 0;
        if (!hasAnyActivity) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Testlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                <p className="text-base font-bold">Iltimos, avval dars sotib oling</p>
                <p className="text-xs mt-2">Kurslar do'koniga o'ting va o'zingizga mos kursni xarid qiling</p>
                <button onClick={() => navigate('/mock-store')} className="mt-4 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer">
                  Kurslar do'koni
                </button>
              </div>
            </div>
          );
        }
        if (approvedGroups.length === 0 && pendingGroups.length > 0) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Testlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-amber-800/30 text-amber-400' : 'bg-white border-amber-200 text-amber-600'}`}>
                <p className="text-base font-bold">Tasdiqlash kutilmoqda</p>
                <p className="text-xs mt-2">Sizning xaridingiz o'qituvchi tomonidan tasdiqlanishi kutilmoqda. Bu biroz vaqt olishi mumkin.</p>
              </div>
            </div>
          );
        }
        return <StudentTests studentGroups={approvedGroups} setXp={useStore.getState().setXp} setCoins={useStore.getState().setCoins} setLevel={useStore.getState().setLevel} setGroups={useStore.getState().setGroups} activeGroupId={null} />;
      }
      case 'student_myhomework': {
        const studentName = user?.name || 'Biloliddin Akramov';
        const approvedGroups = groups.filter((g) => g.students.includes(studentName));
        const pendingGroups = groups.filter((g) => g.pendingStudents?.includes(studentName) && !g.students.includes(studentName));
        const hasAnyActivity = approvedGroups.length > 0 || pendingGroups.length > 0;
        if (!hasAnyActivity) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Topshiriqlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                <p className="text-base font-bold">Iltimos, avval dars sotib oling</p>
                <p className="text-xs mt-2">Kurslar do'koniga o'ting va o'zingizga mos kursni xarid qiling</p>
                <button onClick={() => navigate('/mock-store')} className="mt-4 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer">
                  Kurslar do'koni
                </button>
              </div>
            </div>
          );
        }
        if (approvedGroups.length === 0 && pendingGroups.length > 0) {
          return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Topshiriqlarim</h2>
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-amber-800/30 text-amber-400' : 'bg-white border-amber-200 text-amber-600'}`}>
                <p className="text-base font-bold">Tasdiqlash kutilmoqda</p>
                <p className="text-xs mt-2">Sizning xaridingiz o'qituvchi tomonidan tasdiqlanishi kutilmoqda. Bu biroz vaqt olishi mumkin.</p>
              </div>
            </div>
          );
        }
        const allHomeworks = approvedGroups.flatMap((g) => g.homeworks.map((hw) => ({ ...hw, groupName: g.name })));
        return (
          <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
            <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mening Topshiriqlarim</h2>
            {allHomeworks.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-[#151433] border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                <p className="text-sm font-bold">Hali topshiriqlar yo'q</p>
                <p className="text-xs mt-1">O'qituvchingiz topshiriq qo'shishini kuting</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allHomeworks.map((hw, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#151433] border-slate-800' : 'bg-white border-gray-200'} space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{hw.groupName}</span>
                        <h3 className="text-sm font-bold text-white mt-1">{hw.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Muddat: {hw.deadline || 'Belgilanmagan'}</span>
                      <span>Holat: {hw.status === 'completed' ? 'Bajarilgan' : hw.status === 'pending' ? 'Kutilmoqda' : 'Yangi'}</span>
                    </div>
                    {hw.score !== undefined && (
                      <div className="text-xs font-bold text-amber-400">Ball: {hw.score}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      default: return null;
    }
  };

  return (
    <div className="app-shell relative flex h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>
      <Navigation
        currentTab={storeCurrentTab} setCurrentTab={setCurrentTab} userRole={userRole}
        setUserRole={useStore.getState().setUserRole} xp={xp} level={level}
        coins={coins} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
      />
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>{renderView()}</Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <LevelModal />
      <ConfirmDialog />

      {/* Floating Pandoo AI Assistant */}
      {pandooOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-end p-4 sm:p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md h-[80vh] sm:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-[#0f0f1a]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-xs font-black text-white">
                  P
                </div>
                <span className="text-sm font-black text-white">Pandoo AI</span>
              </div>
              <button onClick={() => setPandooOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[calc(100%-52px)]">
              <PandooChat />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setPandooOpen(!pandooOpen)}
        className="fixed bottom-5 right-5 z-[150] w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-sky-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Pandoo AI yordamchi"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) return <LoaderScreen label="Sessiya tekshirilmoqda" />;
  if (!user) return <AuthScreen />;
  return <AppMain />;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AuthGate />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
