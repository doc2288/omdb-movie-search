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
  const [theme, setThemeState] = useState<Theme>('light'); // Начинаем всегда со светлой темы
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Этот эффект выполняется только на клиенте после гидратации
    const actualTheme = getInitialTheme();
    setThemeState(actualTheme);
    setIsHydrated(true);
    
    // Синхронизируем DOM с актуальной темой
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', actualTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {}
  }, [theme, isHydrated]);

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