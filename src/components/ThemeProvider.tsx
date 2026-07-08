import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { useStore } from '../store';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'lifesprint_theme';

function getStoredTheme(): Theme | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function persistTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Init: sync store + DOM + localStorage
  useEffect(() => {
    const theme = getInitialTheme();
    const isDark = theme === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
    persistTheme(theme);

    const store = useStore.getState();
    if (store.isDarkMode !== isDark) {
      store.setDarkMode(isDark);
    }
  }, []);

  // Listen for system preference changes (only if user hasn't explicitly chosen)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = () => {
      const stored = getStoredTheme();
      if (!stored) {
        const sysDark = mq.matches;
        document.documentElement.classList.toggle('dark', sysDark);
        persistTheme(sysDark ? 'dark' : 'light');
        const store = useStore.getState();
        if (store.isDarkMode !== sysDark) {
          store.setDarkMode(sysDark);
        }
      }
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subscribe to store changes → sync DOM + localStorage
  useEffect(() => {
    const unsub = useStore.subscribe((state, prev) => {
      if (state.isDarkMode !== prev.isDarkMode) {
        document.documentElement.classList.toggle('dark', state.isDarkMode);
        persistTheme(state.isDarkMode ? 'dark' : 'light');
      }
    });
    return unsub;
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !useStore.getState().isDarkMode;
    useStore.getState().setDarkMode(next);
    // DOM + localStorage sync happens via subscribe above
  }, []);

  const setTheme = useCallback((t: Theme) => {
    const next = t === 'dark';
    useStore.getState().setDarkMode(next);
  }, []);

  const theme = useStore((s) => s.isDarkMode ? 'dark' : 'light');
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() faqat ThemeProvider ichida ishlatilishi kerak.');
  }
  return ctx;
}
