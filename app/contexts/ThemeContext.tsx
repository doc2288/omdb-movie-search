import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

function applyThemeClass(next: Theme) {
  const root = document.documentElement;
  const body = document.body;
  root.classList.remove('dark');
  body.classList.remove('dark');
  if (next === 'dark') {
    root.classList.add('dark');
    body.classList.add('dark');
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('light');

  // Init on mount and sync with prefers-color-scheme
  useEffect(() => {
    const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as Theme | null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);

    // Optional: react to system changes
    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const listener = (e: MediaQueryListEvent) => {
      const sys: Theme = e.matches ? 'dark' : 'light';
      const saved = (localStorage.getItem('theme') as Theme | null);
      if (!saved) {
        setThemeState(sys);
        applyThemeClass(sys);
      }
    };
    if (mql) mql.addEventListener('change', listener);
    return () => { if (mql) mql.removeEventListener('change', listener); };
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem('theme', next);
    applyThemeClass(next);
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
