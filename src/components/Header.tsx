import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import * as api from '../api';
import {
  Sparkles, Flame, Moon, Sun, MessageSquare, Bell, ChevronDown,
  LogOut, GraduationCap, Key, User, Settings, CheckCheck, Trophy
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const {
    xp, coins, level, userRole, setUserRole, setCurrentTab,
    isDarkMode, toggleDarkMode, setSidebarOpen, currentTab,
    showLevelModal, setShowLevelModal, setLevelModalTab,
    notifications, unreadCount, setNotifications, setUnreadCount
  } = useStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.fetchNotifications().then(res => {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getTitle = () => {
    const map: Record<string, string> = {
      dashboard: "Boshqaruv paneli",
      mock_store: "Mock Do'koni",
      academics: "Akademik darslar",
      testcenter: "Test Markazi",
      competition: "Reyting va Musobaqa",
      discipline: "Intizom & Challenge",
      consulting: "University Consulting",
      university: "Universitetlar & Grantlar",
      portfolio: "Portfolio & Rezyume",
      ai: "Sun'iy Intellekt",
      community: "Jamiyat & Guruhlar",
      panels: "Boshqaruv Paneli",
      analytics: "O'zlashtirish Tahlili",
      gamezone: "Game Zone",
    };
    return map[currentTab] || "Boshqaruv paneli";
  };

  return (
    <header className="app-header sticky top-0 z-20 flex items-center justify-between gap-2 px-3 py-3 transition-colors duration-300 sm:gap-4 sm:px-6 sm:py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          aria-label="Menyuni ochish"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <button
          onClick={() => {
            if (currentTab !== 'dashboard') setCurrentTab('dashboard');
            else toast("Siz hozirda boshqaruv panelidasiz", 'info');
          }}
          className="flex items-center gap-1.5 rounded-2xl bg-[color:var(--brand-soft)] px-3 py-2.5 text-xs font-extrabold text-[color:var(--brand)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] sm:px-5 sm:text-sm"
          type="button"
        >
          &lt; <span className="hidden sm:inline">Ortga</span>
        </button>
        <h2 className="max-w-[120px] truncate text-sm font-bold tracking-tight text-[color:var(--text)] sm:max-w-none sm:text-xl lg:text-2xl">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-bold text-[color:var(--text)] shadow-2xs sm:flex">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          {level}
        </div>

        <button
          onClick={() => { setShowLevelModal(true); setLevelModalTab('xp'); }}
          className="flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1.5 text-xs font-bold text-[color:var(--text)] shadow-2xs transition-all hover:bg-[color:var(--surface-2)] sm:gap-3.5 sm:pr-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          title="Daraja va XP ma'lumotlarini ko'rish"
          type="button"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs font-extrabold text-[color:var(--brand-contrast)] shadow-xs">
            {level}
          </div>
          <div className="flex min-w-0 items-center gap-1 font-mono text-[color:var(--reward)]">
            <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="hidden sm:inline">{xp}</span>
          </div>
          <div className="hidden items-center gap-1 font-mono text-[color:var(--danger)] sm:flex">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{level}</span>
          </div>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-gray-200 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => toast("Yangi xabarlar yo'q", 'info')}
          className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          aria-label="Xabarlar"
          type="button"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <div className="relative hidden sm:block" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
            aria-label="Bildirishnomalar"
            type="button"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              </>
            )}
          </button>

          {notifOpen && (
            <div className="app-panel absolute right-0 top-full z-50 mt-2.5 max-h-96 w-80 space-y-2 overflow-y-auto p-3 text-[color:var(--text)]">
              <div className="mb-2 flex items-center justify-between border-b border-[color:var(--border)] px-1 pb-2">
                <span className="text-xs font-bold tracking-wide">Bildirishnomalar</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => { api.markAllNotificationsRead(); setNotifications(notifications.map(n => ({ ...n, read: 1 }))); setUnreadCount(0); }}
                    className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-[color:var(--brand)] hover:underline"
                    type="button"
                  >
                    <CheckCheck className="w-3 h-3" /> Hammasini o'qish
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Bildirishnomalar yo'q</p>
              ) : notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.read) { api.markNotificationRead(n.id); setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: 1 } : item)); setUnreadCount(Math.max(0, unreadCount - 1)); }
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all text-left ${n.read ? (isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50') : (isDarkMode ? 'bg-[#1d1b46] border border-slate-700/50' : 'bg-[#f5f3ff] border border-purple-100/30')}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); }}}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'achievement' ? 'bg-amber-500' : n.type === 'warning' ? 'bg-rose-500' : n.type === 'system' ? 'bg-emerald-500' : 'bg-blue-500'} ${n.read ? 'opacity-30' : ''}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight">{n.title}</p>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{n.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
          className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          aria-label={isDarkMode ? "Yorug' rejim" : "Tungi rejim"}
          type="button"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-1.5 rounded-2xl border-l border-[color:var(--border)] px-1 py-1 transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] sm:gap-2.5 sm:pl-3 sm:pr-2"
            aria-label="Profil menyusi"
            type="button"
          >
            <img
              src={
                userRole === 'teacher'
                  ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                  : userRole === 'admin'
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
                  : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
              }
              alt="Foydalanuvchi"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20 shrink-0"
            />
            <div className="hidden sm:block text-left">
              <p className={`text-sm font-bold leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || (userRole === 'teacher' ? 'Olima' : userRole === 'admin' ? 'Admin' : 'Biloliddin')}
              </p>
              <span className="text-[11px] font-semibold flex items-center gap-1">
                {userRole === 'student' ? <GraduationCap className="w-3 h-3 inline" /> : <Key className="w-3 h-3 inline" />}
                {userRole === 'student' ? 'O\'quvchi' : userRole === 'teacher' ? 'O\'qituvchi' : 'Admin'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          </button>

          {profileOpen && (
            <div className="app-panel absolute right-0 top-full z-50 mt-2.5 w-64 max-w-[90vw] p-2 text-left text-[color:var(--text)]">
              <div className="mb-1 flex items-center gap-3 border-b border-[color:var(--border)] px-2 py-2.5">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" alt="" className="w-10 h-10 rounded-full object-cover border" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-tight text-[color:var(--text)]">{user?.name || 'Biloliddin Akramov'}</p>
                  <p className="text-[11px] font-extrabold text-[color:var(--brand)]">Daraja {level}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => { setProfileOpen(false); toast("Profil sozlamalari", 'info'); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                  type="button"
                >
                  <User className="w-4 h-4" /> Profil
                </button>
                <button
                  onClick={() => { setProfileOpen(false); toast("Sozlamalar tez kunda qo'shiladi", 'info'); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold text-[color:var(--text-muted)] transition-all hover:bg-[color:var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                  type="button"
                >
                  <Settings className="w-4 h-4" /> Sozlamalar
                </button>
              </div>
              <div className="mx-2 my-1.5 space-y-1.5 rounded-xl bg-[color:var(--surface-2)] p-2.5 text-[11px] font-bold">
                <div className="flex justify-between"><span>XP:</span><span className="text-[#f59e0b] font-mono">{xp}</span></div>
                <div className="flex justify-between"><span>Tangalar:</span><span className="font-mono text-[color:var(--brand)]">{coins}</span></div>
                <div className="flex justify-between"><span>O'zlashtirish:</span><span className="font-mono text-sky-500">{level}%</span></div>
              </div>
              <div className="border-t border-[color:var(--border)] px-2 pt-2">
                <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Rol</p>
                <CustomSelect
                  value={userRole}
                  onChange={(v) => { setUserRole(v as 'student' | 'teacher' | 'parent' | 'admin'); setCurrentTab('dashboard'); setProfileOpen(false); }}
                  options={[
                    { value: 'student', label: 'O\'quvchi' },
                    { value: 'teacher', label: 'O\'qituvchi' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
              </div>
              <button
                onClick={() => { logout(); }}
                className="mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-500 transition-all hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:hover:bg-rose-950/30"
                type="button"
              >
                <LogOut className="w-4 h-4" /> Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
