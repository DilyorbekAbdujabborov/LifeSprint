import React from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  Globe,
  MessageSquare,
  Users,
  ClipboardList,
  ShoppingCart,
  Gamepad,
  Swords,
  Shield,
  BookOpen,
  Clock,
} from 'lucide-react';
import logoSrc from '../img/logo.jpg';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: 'student' | 'teacher' | 'parent' | 'admin';
  setUserRole: (role: 'student' | 'teacher' | 'parent' | 'admin') => void;
  xp: number;
  level: number;
  coins: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  xp,
  level,
  coins,
  sidebarOpen,
  setSidebarOpen
}: NavigationProps) {

  const navButtonBase =
    'w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]';
  const navButtonInactive = 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-nav-hover-bg)] hover:text-[var(--sidebar-text)]';
  const navButtonActive = 'bg-[color:var(--brand)] text-[color:var(--brand-contrast)] shadow-sm';

  const sections = [
    {
      key: 'mock_hub',
      title: "MOCK HUB",
      items: [
        { id: 'academics', label: 'Akademik darslar', icon: BookOpen },
        { id: 'testcenter', label: 'Test Markazi', icon: FileQuestion },
        { id: 'consulting', label: 'Konsulting', icon: MessageSquare },
        { id: 'university', label: 'Universitet & Grantlar', icon: Globe },
      ]
    },
    {
      key: 'talim_olish',
      title: "TA'LIM OLISH",
      items: [
        { id: 'student_mygroups', label: 'Mening Guruhlarim', icon: Users },
        { id: 'student_mytests', label: 'Mening Testlarim', icon: FileQuestion },
        { id: 'student_myhomework', label: 'Mening Topshiriqlarim', icon: ClipboardList },
      ]
    },
    {
      key: 'intizom',
      title: "INTIZOM",
      items: [
        { id: 'discipline', label: 'Intizom & Focus', icon: Clock },
      ]
    },
    {
      key: 'oyin_zonasi',
      title: "O'YIN ZONASI",
      items: [
        { id: 'gamezone', label: 'AI Adventures', icon: Gamepad },
        { id: 'edu_battle', label: 'Edu Battle', icon: Swords },
        { id: 'edu_team', label: 'Edu Team', icon: Shield },
      ]
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'var(--sidebar-overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`app-sidebar fixed left-0 top-0 z-40 flex h-screen w-[19rem] select-none flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:translate-x-0`}
        id="sidebar_container"
      >
      
      {/* Brand Logo */}
      <div className="flex items-center gap-4 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-logo-bg)] p-5 sm:p-6" id="logo_section">
        <div className="relative group flex items-center justify-center shrink-0" id="logo_wrapper">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 blur-md opacity-55 transition duration-300 group-hover:opacity-100"></div>
          <div className="relative flex items-center justify-center rounded-2xl border border-[var(--sidebar-logo-inner-border)] bg-[var(--sidebar-logo-inner-bg)] p-1 text-[var(--sidebar-logo-text)] shadow-sm transition-all duration-300 group-hover:scale-105 active:scale-95 overflow-hidden" id="logo_inner">
            <img src={logoSrc} alt="LifeSprint" className="w-9 h-9 object-cover rounded-xl" />
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-lg font-black tracking-tight text-[var(--sidebar-logo-text)] flex items-center gap-1 font-sans" id="brand_name">
            LifeSprint
          </h1>
          <p className="text-[10px] font-black tracking-widest text-[var(--sidebar-accent)] uppercase font-sans" id="brand_tagline">
            Muvaffaqiyat Ekotizimi
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-[var(--sidebar-border)] text-[10px] font-bold text-[var(--sidebar-badge-text)]">
        <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">Daraja {level}</span>
        <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">{xp.toLocaleString()} XP</span>
        <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">{coins.toLocaleString()} coin</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin pb-4" id="nav_menu">
        
        {/* ASOSIY */}
        <div className="space-y-1.5" id="nav_section_main">
          <span className="text-[10px] font-black tracking-[0.28em] text-[var(--sidebar-section-title)] px-3.5 uppercase block mb-1">
            ASOSIY
          </span>
          <button
            id="nav_btn_dashboard"
            onClick={() => { setCurrentTab('dashboard'); setSidebarOpen(false); }}
            className={`${navButtonBase} ${currentTab === 'dashboard' ? navButtonActive : navButtonInactive}`}
           >
             <LayoutDashboard className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-[var(--sidebar-text)]' : 'text-[var(--sidebar-icon)]'}`} />
             <span>Boshqaruv paneli</span>
           </button>
        </div>

        {/* Dynamic sections */}
        {sections.map((section) => (
          <div key={section.key} className="space-y-1.5">
            <span className="text-[10px] font-black tracking-[0.28em] text-[var(--sidebar-section-title)] px-3.5 uppercase block mb-1">
              {section.title}
            </span>
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }}
                  className={`${navButtonBase} ${isActive ? navButtonActive : navButtonInactive}`}
                >
                  <ItemIcon className={`w-5 h-5 ${isActive ? 'text-[var(--sidebar-text)]' : 'text-[var(--sidebar-icon)]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* DO'KON — separate at the bottom */}
        <div className="space-y-1.5" id="nav_section_store">
          <span className="text-[10px] font-black tracking-[0.28em] text-[var(--sidebar-section-title)] px-3.5 uppercase block mb-1">
            DO'KON
          </span>
          <button
            id="nav_btn_mock_store"
            onClick={() => { setCurrentTab('mock_store'); setSidebarOpen(false); }}
            className={`${navButtonBase} ${
              currentTab === 'mock_store'
                ? 'bg-emerald-500 text-white shadow-sm'
                : navButtonInactive
            }`}
           >
             <ShoppingCart className={`w-5 h-5 ${currentTab === 'mock_store' ? 'text-[var(--sidebar-text)]' : 'text-[var(--sidebar-icon)]'}`} />
             <span>Kurslar Do'koni</span>
          </button>
        </div>

      </nav>
    </aside>
    </>
  );
}
