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

// Функция для определения начальной темы
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'; // SSR fallback
  }
  
  try {
    // Проверяем, не установлена ли уже тема скриптом
    const hasInlineScript = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (hasInlineScript && savedTheme === 'dark') {
      return 'dark';
    }
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Проверяем системные предпочтения
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch (error) {
    return 'light';
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      // Обновляем состояние, если оно отличается
      if (theme !== initialTheme) {
        setThemeState(initialTheme);
      }
      
      // Применяем тему к документу (на случай, если скрипт не сработал)
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    } catch (error) {
      console.warn('Error initializing theme:', error);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    } catch (error) {
      console.warn('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};