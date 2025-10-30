import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
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

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme === 'dark' || savedTheme === 'light') {
          return savedTheme;
        }
      } catch {
      }
      if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
    }
    return getInitialTheme();
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      if (savedTheme && (savedTheme === 'dark') !== hasDarkClass) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        if (theme !== savedTheme) {
          setThemeState(savedTheme);
        }
      }
      else if (!savedTheme && hasDarkClass && theme !== 'dark') {
        setThemeState('dark');
        localStorage.setItem('theme', 'dark');
      }
      else if (!savedTheme && !hasDarkClass && theme === 'dark') {
        setThemeState('light');
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {}
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};