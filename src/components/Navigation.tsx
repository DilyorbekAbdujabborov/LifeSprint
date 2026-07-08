import React from 'react';
import {
  LayoutDashboard,
  Flame,
  GraduationCap,
  FileQuestion,
  Globe,
  UserCheck,
  MessageSquare,
  Cpu,
  Trophy,
  Briefcase,
  BookOpen,
  Brain,
  BarChart3,
  Settings,
  Sparkles,
  ChevronDown,
  ShoppingCart,
  Gamepad,
  Users
} from 'lucide-react';

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
  
  const collapsibleCategories = [
    {
      key: 'reyting',
      title: "Reyting va Yutuqlar",
      icon: Trophy,
      items: [
        { id: 'competition', label: 'Reyting (Musobaqa)', icon: Trophy },
        { id: 'discipline', label: 'Intizom & Challenge', icon: Flame }
      ]
    },
    {
      key: 'konsultatsiya',
      title: "Konsultatsiya",
      icon: MessageSquare,
      items: [
        { id: 'consulting', label: 'University Consulting', icon: MessageSquare },
        { id: 'university', label: 'Universitet & Grantlar', icon: Globe }
      ]
    },
    {
      key: 'asboblar',
      title: "Asboblar",
      icon: Briefcase,
      items: [
        { id: 'portfolio', label: 'Portfolio & Rezyume', icon: UserCheck },
        { id: 'ai', label: 'Sun\'iy Intellekt', icon: Cpu },
        { id: 'community', label: 'Jamoa & Ijtimoiy', icon: Users },
        { id: 'analytics', label: 'Tahlillar', icon: BarChart3 },
        { id: 'panels', label: 'Boshqaruv Paneli (Settings)', icon: Settings }
      ]
    }
  ];

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    reyting: currentTab === 'competition' || currentTab === 'discipline',
    konsultatsiya: currentTab === 'consulting' || currentTab === 'university',
    asboblar: currentTab === 'portfolio' || currentTab === 'ai' || currentTab === 'community' || currentTab === 'analytics' || currentTab === 'panels',
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  React.useEffect(() => {
    if (currentTab === 'competition' || currentTab === 'discipline') {
      setOpenSections(prev => ({ ...prev, reyting: true }));
    } else if (currentTab === 'consulting' || currentTab === 'university') {
      setOpenSections(prev => ({ ...prev, konsultatsiya: true }));
    } else if (currentTab === 'portfolio' || currentTab === 'ai' || currentTab === 'community' || currentTab === 'analytics' || currentTab === 'panels') {
      setOpenSections(prev => ({ ...prev, asboblar: true }));
    }
  }, [currentTab]);

  const navButtonBase =
    'w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]';
  const navButtonInactive = 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-nav-hover-bg)] hover:text-[var(--sidebar-text)]';
  const navButtonActive = 'bg-[color:var(--brand)] text-[color:var(--brand-contrast)] shadow-sm';

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
      
      {/* Brand Logo - Styled as "LifeSprint" with a modern 3D glowing custom logo */}
      <div className="flex items-center gap-4 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-logo-bg)] p-5 sm:p-6" id="logo_section">
        <div className="relative group flex items-center justify-center shrink-0" id="logo_wrapper">
          {/* Glowing background aura */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 blur-md opacity-55 transition duration-300 group-hover:opacity-100"></div>
          
          {/* Modern 3D/Neon Styled Custom Logo */}
          <div className="relative flex items-center justify-center rounded-2xl border border-[var(--sidebar-logo-inner-border)] bg-[var(--sidebar-logo-inner-bg)] p-2 text-[var(--sidebar-logo-text)] shadow-sm transition-all duration-300 group-hover:scale-105 active:scale-95" id="logo_inner">
            <svg
              className="w-7 h-7"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#0091ff" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Stem / Trunk of Growth - elegant thick curved trunk */}
              <path
                d="M50,85 C50,60 45,45 50,20"
                stroke="url(#growthGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
              />
              
              {/* Left Leaf - beautiful organic shape representing starting point */}
              <path
                d="M48,60 C30,60 25,45 42,40 C46,45 48,52 48,60 Z"
                fill="url(#growthGrad)"
                opacity="0.9"
              />
              
              {/* Right Leaf - higher up, representing progress */}
              <path
                d="M52,45 C70,45 75,30 58,25 C54,30 52,37 52,45 Z"
                fill="url(#growthGrad)"
                opacity="0.95"
              />
              
              {/* Small top rising leaf / arrow head representing peak potential */}
              <path
                d="M50,20 L40,25 C45,15 50,5 50,5 C50,5 55,15 60,25 Z"
                fill="#ffffff"
                filter="url(#glow)"
              />

              {/* Rising energy sparkles */}
              <circle cx="30" cy="35" r="2.5" fill="#10b981" />
              <circle cx="70" cy="20" r="3" fill="#0091ff" />
            </svg>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-lg font-black tracking-tight text-[var(--sidebar-logo-text)] flex items-center gap-1 font-sans" id="brand_name">
            LifeSprint
          </h1>
          <p className="text-[10px] font-black tracking-widest text-[var(--sidebar-accent)] uppercase font-sans" id="brand_tagline">
            Muvaffaqiyat Ekotizimi
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-[var(--sidebar-badge-text)]">
            <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">Daraja {level}</span>
            <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">{xp.toLocaleString()} XP</span>
            <span className="rounded-full border border-[var(--sidebar-badge-border)] bg-[var(--sidebar-badge-bg)] px-2.5 py-1">{coins.toLocaleString()} coin</span>
          </div>
        </div>
      </div>

      {/* Categorized Menu Navigation with Collapsible Accordion Sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin pb-4" id="nav_menu">
        
        {/* ASOSIY Section (Always Visible, Non-collapsible as requested) */}
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

        {/* O'QUVCHI PANEL — eng yuqorida, ochiq holda */}
        <div className="space-y-1.5" id="nav_section_student">
          <span className="text-[10px] font-black tracking-[0.28em] text-[var(--sidebar-section-title)] px-3.5 uppercase block mb-1">
            O'QUVCHI
          </span>
          {[
            { id: 'academics', label: 'Akademik darslar', icon: BookOpen },
            { id: 'testcenter', label: 'Test Markazi', icon: FileQuestion },
          ].map(item => {
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

        {/* O'YIN ZONASI — dars sotib olishdan bir level yuqori */}
        <div className="space-y-1.5" id="nav_section_gamezone">
          <span className="text-[10px] font-black tracking-[0.28em] text-[var(--sidebar-section-title)] px-3.5 uppercase block mb-1">
            O'YIN ZONASI
          </span>
          <button
            id="nav_btn_gamezone"
            onClick={() => { setCurrentTab('gamezone'); setSidebarOpen(false); }}
            className={`${navButtonBase} ${
              currentTab === 'gamezone'
                ? 'bg-amber-500 text-white shadow-sm'
                : navButtonInactive
            }`}
           >
             <Gamepad className={`w-5 h-5 ${currentTab === 'gamezone' ? 'text-[var(--sidebar-text)]' : 'text-[var(--sidebar-icon)]'}`} />
             <span>Game Zone</span>
           </button>
        </div>

        {/* DO'KON — pastroqda */}
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

        {/* Dynamic Collapsible Sections */}
        {collapsibleCategories.map((cat) => {
          const isOpen = openSections[cat.key];
          const CatIcon = cat.icon;
          const isSubActive = cat.items.some(item => currentTab === item.id);

          return (
            <div key={cat.key} className="space-y-1.5" id={`collapsible_sec_${cat.key}`}>
              {/* Expandable Group Title/Button */}
              <button
                onClick={() => toggleSection(cat.key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all duration-200 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                  isSubActive
                    ? 'text-[var(--sidebar-text)] bg-[var(--sidebar-nav-hover-bg)] border border-[var(--sidebar-border)] shadow-xs'
                    : 'text-[var(--sidebar-text-subtle)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-nav-hover-bg)]'
                }`}
                title={`${cat.title} bo'limini ochish/yopish`}
              >
                <div className="flex items-center gap-3.5">
                  <CatIcon className={`w-5 h-5 ${isSubActive ? 'text-[var(--sidebar-accent)]' : 'text-[var(--sidebar-icon)] group-hover:text-[var(--sidebar-text)]'}`} />
                  <span className="tracking-wide uppercase text-xs font-black">{cat.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--sidebar-icon)] group-hover:text-[var(--sidebar-text)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sub-items List */}
              {isOpen && (
                <div className="ml-4 space-y-1 border-l border-[var(--sidebar-border)] pl-4 mt-1.5 animate-fade-in" id={`sub_items_${cat.key}`}>
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav_btn_${item.id}`}
                        onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                          isActive
                          ? 'bg-[color:var(--brand)] text-[color:var(--brand-contrast)] shadow-xs font-black'
                            : 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-nav-hover-bg)] hover:text-[var(--sidebar-text)]'
                        }`}
                      >
                        <ItemIcon className={`w-4 h-4 ${isActive ? 'text-[var(--sidebar-text)]' : 'text-[var(--sidebar-icon)]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
    </>
  );
}
