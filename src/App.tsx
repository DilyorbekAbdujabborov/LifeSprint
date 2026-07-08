import { useEffect, lazy, Suspense } from 'react';
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
import { Loader2 } from 'lucide-react';

const Discipline = lazy(() => import('./components/Discipline'));
const Academics = lazy(() => import('./components/Academics'));
const TestCenter = lazy(() => import('./components/TestCenter'));
const UniversityFinder = lazy(() => import('./components/University'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Consulting = lazy(() => import('./components/Consulting'));
const Community = lazy(() => import('./components/Community'));
const AiCoach = lazy(() => import('./components/AiCoach'));
const ParentPanel = lazy(() => import('./components/ParentPanel'));
const Competition = lazy(() => import('./components/Competition'));
const Analytics = lazy(() => import('./components/Analytics'));
const MockStore = lazy(() => import('./components/MockStore'));
const GameZone = lazy(() => import('./components/GameZone'));

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
  dashboard: '/', competition: 'competition', discipline: 'discipline',
  academics: 'academics', testcenter: 'testcenter',
  mock_store: 'mock-store',
  university: 'university', portfolio: 'portfolio', consulting: 'consulting',
  ai: 'ai', community: 'community', panels: 'panels', analytics: 'analytics', gamezone: 'gamezone',
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

  // Hash → Store (on mount & back/forward)
  const hashKey = location.pathname === '/' ? '/' : location.pathname.replace(/^\//, '');
  useEffect(() => {
    const tab = HASH_TO_TAB_ID[hashKey] || 'dashboard';
    setCurrentTab(tab);
  }, [hashKey, setCurrentTab]);

  // Store → Hash (on tab navigation)
  useEffect(() => {
    const target = TAB_ID_TO_HASH[storeCurrentTab];
    if (target && location.pathname !== (target === '/' ? '/' : '/' + target)) {
      navigate(target === '/' ? '/' : '/' + target, { replace: true });
    }
  }, [storeCurrentTab, navigate, location.pathname]);

  useEffect(() => { loadState().then(() => { useStore.getState().saveState(); }); const n = setInterval(() => useStore.getState().saveState(), 30000); return () => clearInterval(n); }, []);
  useEffect(() => { saveState(); }, [xp, level, coins, tasks, exams, habits, courses, groups, consultations, certificates, portfolio, posts, leaderboard, events, userRole]);

  const renderView = () => {
    if (userRole === 'parent') return <ParentPanel habits={habits} xp={xp} />;
    if (!loaded && loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" /></div>;

    const common = { xp, level, setXp: useStore.getState().setXp, setLevel: useStore.getState().setLevel, coins, setCoins: useStore.getState().setCoins, isDarkMode };

    switch (storeCurrentTab) {
      case 'dashboard': return <Dashboard tasks={tasks} setTasks={useStore.getState().setTasks} exams={exams} courses={courses} setCourses={useStore.getState().setCourses} groups={groups} setGroups={useStore.getState().setGroups} consultations={consultations} setConsultations={useStore.getState().setConsultations} certificates={certificates} setCertificates={useStore.getState().setCertificates} user={user} userRole={userRole} setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} {...common} />;
      case 'competition': return <Competition {...common} />;
      case 'discipline': return <Discipline habits={habits} setHabits={useStore.getState().setHabits} {...common} />;
      case 'academics': return <Academics courses={courses} setCourses={useStore.getState().setCourses} userRole={userRole} {...common} />;
      case 'testcenter': return <TestCenter {...common} />;
      case 'mock_store': return <MockStore courses={courses} setCourses={useStore.getState().setCourses} groups={groups} setGroups={useStore.getState().setGroups} userRole={userRole} {...common} />;
      case 'university': return <UniversityFinder />;
      case 'portfolio': return <Portfolio portfolio={portfolio} setPortfolio={useStore.getState().setPortfolio} />;
      case 'consulting': return <Consulting />;
      case 'ai': return <AiCoach {...common} />;
      case 'community': return <Community posts={posts} setPosts={useStore.getState().setPosts} leaderboard={leaderboard} setLeaderboard={useStore.getState().setLeaderboard} events={events} {...common} />;
      case 'panels': return <ParentPanel habits={habits} xp={xp} />;
      case 'analytics': return <Analytics xp={xp} isDarkMode={isDarkMode} />;
      case 'gamezone':
        return <GameZone />;
      default: return null;
    }
  };

  return (
    <div className="app-shell relative flex h-screen overflow-hidden font-sans transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
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
