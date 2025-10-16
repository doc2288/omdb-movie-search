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
    throw new error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

function applyThemeClass(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  // Remove existing theme classes
  root.classList.remove('dark', 'light');
  body.classList.remove('dark', 'light');
  
  // Add new theme class
  root.classList.add(theme);
  body.classList.add(theme);
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('theme') as Theme | null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Ignore localStorage errors
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme on client-side only
  useEffect(() => {
    const savedTheme = getStoredTheme();
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);
    setIsHydrated(true);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme: Theme = e.matches ? 'dark' : 'light';
      const savedTheme = getStoredTheme();
      
      // Only update if no theme is saved (following system preference)
      if (!savedTheme) {
        setThemeState(systemTheme);
        applyThemeClass(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyThemeClass(newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};