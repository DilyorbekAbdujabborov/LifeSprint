import { create } from 'zustand';
import * as api from './api';
import type { Task, Exam, Habit, Course, Group, ConsultationSession, LmsCertificate, PortfolioData, Post, LeaderboardEntry, EventItem, GameProfile, GameAchievement, QuestDef, TitleDef } from './types';
import {
  DEFAULT_TASKS, DEFAULT_EXAMS, DEFAULT_HABITS, DEFAULT_COURSES, DEFAULT_GROUPS,
  DEFAULT_CONSULTATIONS, DEFAULT_CERTIFICATES, DEFAULT_PORTFOLIO, DEFAULT_POSTS,
  DEFAULT_LEADERBOARD, DEFAULT_EVENTS, DEFAULT_BADGES,
} from './defaults';

interface AppState {
  loaded: boolean;
  loading: boolean;
  xp: number;
  level: number;
  coins: number;
  userRole: 'student' | 'teacher' | 'parent' | 'admin';
  tasks: Task[];
  exams: Exam[];
  habits: Habit[];
  courses: Course[];
  groups: Group[];
  consultations: ConsultationSession[];
  certificates: LmsCertificate[];
  portfolio: PortfolioData;
  posts: Post[];
  leaderboard: LeaderboardEntry[];
  events: EventItem[];

  gameProfile: GameProfile | null;
  achievements: GameAchievement[];
  questDefs: QuestDef[];
  titleDefs: TitleDef[];
  newAchievements: GameAchievement[];
  newTitles: TitleDef[];

  isDarkMode: boolean;
  showLevelModal: boolean;
  levelModalTab: 'sat' | 'ielts' | 'milliy' | 'quiz' | 'xp' | 'liga';
  sidebarOpen: boolean;
  notifications: api.NotificationItem[];
  unreadCount: number;
  confirmDialog: { open: boolean; title: string; message: string; onConfirm: () => void } | null;
  currentTab: string;

  setXp: (v: number) => void;
  setLevel: (v: number) => void;
  setCoins: (v: number) => void;
  setUserRole: (v: 'student' | 'teacher' | 'parent' | 'admin') => void;
  setTasks: (v: Task[] | ((prev: Task[]) => Task[])) => void;
  setExams: (v: Exam[] | ((prev: Exam[]) => Exam[])) => void;
  setHabits: (v: Habit[] | ((prev: Habit[]) => Habit[])) => void;
  setCourses: (v: Course[] | ((prev: Course[]) => Course[])) => void;
  setGroups: (v: Group[] | ((prev: Group[]) => Group[])) => void;
  setConsultations: (v: ConsultationSession[] | ((prev: ConsultationSession[]) => ConsultationSession[])) => void;
  setCertificates: (v: LmsCertificate[] | ((prev: LmsCertificate[]) => LmsCertificate[])) => void;
  setPortfolio: (v: PortfolioData) => void;
  setPosts: (v: Post[] | ((prev: Post[]) => Post[])) => void;
  setLeaderboard: (v: LeaderboardEntry[] | ((prev: LeaderboardEntry[]) => LeaderboardEntry[])) => void;
  setEvents: (v: EventItem[] | ((prev: EventItem[]) => EventItem[])) => void;
  setGameProfile: (v: GameProfile | null | ((prev: GameProfile | null) => GameProfile | null)) => void;
  setAchievements: (v: GameAchievement[]) => void;
  setQuestDefs: (v: QuestDef[]) => void;
  setTitleDefs: (v: TitleDef[]) => void;
  setNewAchievements: (v: GameAchievement[]) => void;
  setNewTitles: (v: TitleDef[]) => void;
  setDarkMode: (v: boolean) => void;
  toggleDarkMode: () => void;
  setShowLevelModal: (v: boolean) => void;
  setLevelModalTab: (v: 'sat' | 'ielts' | 'milliy' | 'quiz' | 'xp' | 'liga') => void;
  setSidebarOpen: (v: boolean) => void;
  setNotifications: (v: api.NotificationItem[]) => void;
  setUnreadCount: (v: number) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;

  setCurrentTab: (tab: string) => void;
  loadState: () => Promise<void>;
  saveState: () => void;
  loadGameProfile: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<AppState>((set, get) => ({
  loaded: false,
  loading: true,
  xp: 0,
  level: 1,
  coins: 0,
  userRole: 'student',
  tasks: DEFAULT_TASKS,
  exams: DEFAULT_EXAMS,
  habits: DEFAULT_HABITS,
  courses: DEFAULT_COURSES,
  groups: DEFAULT_GROUPS,
  consultations: DEFAULT_CONSULTATIONS,
  certificates: DEFAULT_CERTIFICATES,
  portfolio: DEFAULT_PORTFOLIO,
  posts: DEFAULT_POSTS,
  leaderboard: DEFAULT_LEADERBOARD,
  events: DEFAULT_EVENTS,
  gameProfile: null,
  achievements: [],
  questDefs: [],
  titleDefs: [],
  newAchievements: [],
  newTitles: [],

  isDarkMode: (() => {
    const saved = localStorage.getItem('lifesprint_theme');
    return saved ? saved === 'dark' : true;
  })(),
  showLevelModal: false,
  levelModalTab: 'sat',
  sidebarOpen: false,
  notifications: [],
  unreadCount: 0,
  confirmDialog: null,
  currentTab: 'dashboard',

  setXp: (v) => set({ xp: v }),
  setLevel: (v) => set({ level: v }),
  setCoins: (v) => set({ coins: v }),
  setUserRole: (v) => set({ userRole: v }),
  setTasks: (v) => set((s) => ({ tasks: typeof v === 'function' ? v(s.tasks) : v })),
  setExams: (v) => set((s) => ({ exams: typeof v === 'function' ? v(s.exams) : v })),
  setHabits: (v) => set((s) => ({ habits: typeof v === 'function' ? v(s.habits) : v })),
  setCourses: (v) => set((s) => ({ courses: typeof v === 'function' ? v(s.courses) : v })),
  setGroups: (v) => set((s) => ({ groups: typeof v === 'function' ? v(s.groups) : v })),
  setConsultations: (v) => set((s) => ({ consultations: typeof v === 'function' ? v(s.consultations) : v })),
  setCertificates: (v) => set((s) => ({ certificates: typeof v === 'function' ? v(s.certificates) : v })),
  setPortfolio: (v) => set({ portfolio: v }),
  setPosts: (v) => set((s) => ({ posts: typeof v === 'function' ? v(s.posts) : v })),
  setLeaderboard: (v) => set((s) => ({ leaderboard: typeof v === 'function' ? v(s.leaderboard) : v })),
  setEvents: (v) => set((s) => ({ events: typeof v === 'function' ? v(s.events) : v })),
  setGameProfile: (v) => set((s) => ({ gameProfile: typeof v === 'function' ? v(s.gameProfile) : v })),
  setAchievements: (v) => set({ achievements: v }),
  setQuestDefs: (v) => set({ questDefs: v }),
  setTitleDefs: (v) => set({ titleDefs: v }),
  setNewAchievements: (v) => set({ newAchievements: v }),
  setNewTitles: (v) => set({ newTitles: v }),
  setDarkMode: (v: boolean) => set({ isDarkMode: v }),
  toggleDarkMode: () => {
    // ThemeProvider listens to store changes and syncs DOM + localStorage
    set((s) => ({ isDarkMode: !s.isDarkMode }));
  },
  setShowLevelModal: (v) => set({ showLevelModal: v }),
  setLevelModalTab: (v) => set({ levelModalTab: v }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setNotifications: (v) => set({ notifications: v }),
  setUnreadCount: (v) => set({ unreadCount: v }),
  showConfirm: (title, message, onConfirm) => set({ confirmDialog: { open: true, title, message, onConfirm } }),
  hideConfirm: () => set({ confirmDialog: null }),
  setCurrentTab: (tab) => set({ currentTab: tab }),

  loadState: async () => {
    try {
      const res = await api.fetchState<any>();
      if (res.state) {
        const s = res.state;
        set({
          xp: s.xp ?? 0,
          level: s.level ?? 1,
          coins: s.coins ?? 0,
          userRole: s.userRole ?? 'student',
          tasks: s.tasks && s.tasks.length > 0 ? s.tasks : DEFAULT_TASKS,
          exams: s.exams && s.exams.length > 0 ? s.exams : DEFAULT_EXAMS,
          habits: s.habits && s.habits.length > 0 ? s.habits : DEFAULT_HABITS,
          courses: s.courses && s.courses.length > 0 ? s.courses : DEFAULT_COURSES,
          groups: s.groups && s.groups.length > 0 ? s.groups : DEFAULT_GROUPS,
          consultations: s.consultations && s.consultations.length > 0 ? s.consultations : DEFAULT_CONSULTATIONS,
          certificates: s.certificates && s.certificates.length > 0 ? s.certificates : DEFAULT_CERTIFICATES,
          portfolio: s.portfolio ?? DEFAULT_PORTFOLIO,
          posts: s.posts && s.posts.length > 0 ? s.posts : DEFAULT_POSTS,
          leaderboard: s.leaderboard && s.leaderboard.length > 0 ? s.leaderboard : [],
          events: s.events && s.events.length > 0 ? s.events : DEFAULT_EVENTS,
        });
      }

      // Load real leaderboard from backend
      try {
        const lbRes = await api.request<{ leaderboard: any[] }>('/api/game/leaderboard');
        if (lbRes.leaderboard) {
          set({ leaderboard: lbRes.leaderboard });
        }
      } catch {
        // Fallback to current leaderboard if API fails
      }
    } catch {
      set({
        tasks: DEFAULT_TASKS, exams: DEFAULT_EXAMS, habits: DEFAULT_HABITS,
        courses: DEFAULT_COURSES, groups: DEFAULT_GROUPS,
        consultations: DEFAULT_CONSULTATIONS, certificates: DEFAULT_CERTIFICATES,
        portfolio: DEFAULT_PORTFOLIO, posts: DEFAULT_POSTS,
        leaderboard: [], events: DEFAULT_EVENTS,
      });
    } finally {
      set({ loaded: true, loading: false });
    }
  },

  saveState: () => {
    if (!get().loaded) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const s = get();
      api.saveState({
        xp: s.xp, level: s.level, coins: s.coins, userRole: s.userRole,
        tasks: s.tasks, exams: s.exams, habits: s.habits, courses: s.courses,
        groups: s.groups, consultations: s.consultations, certificates: s.certificates,
        portfolio: s.portfolio, posts: s.posts, leaderboard: s.leaderboard, events: s.events,
      }).catch(() => {});
    }, 800);
  },

  loadGameProfile: async () => {
    try {
      const res = await api.request<{
        profile: GameProfile;
        achievements: GameAchievement[];
        quests: QuestDef[];
        titles: TitleDef[];
        newAchievements: GameAchievement[];
        newTitles: TitleDef[];
      }>('/api/game/profile');
      set({
        gameProfile: res.profile,
        achievements: res.achievements,
        questDefs: res.quests,
        titleDefs: res.titles,
        newAchievements: res.newAchievements,
        newTitles: res.newTitles,
      });
    } catch {}
  },
}));
