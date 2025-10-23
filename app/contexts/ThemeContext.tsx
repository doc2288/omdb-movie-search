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
  // Проверяем доступность localStorage (только на клиенте)
  if (typeof window !== 'undefined') {
    try {
      const savedTheme = localStorage.getItem('movie-search-theme') as Theme | null;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
      
      // Проверяем системные предпочтения
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      console.warn('Error accessing localStorage or matchMedia:', error);
      return 'light';
    }
  }
  
  // На сервере возвращаем светлую тему по умолчанию
  return 'light';
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [isHydrated, setIsHydrated] = useState(false);

  // Эффект для гидратации на клиенте
  useEffect(() => {
    setIsHydrated(true);
    
    // Повторно инициализируем тему после гидратации
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    
    // Применяем тему к документу
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  // Эффект для отслеживания изменений системных предпочтений
  useEffect(() => {
    if (!isHydrated) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Применяем изменения только если пользователь не устанавливал тему вручную
      const savedTheme = localStorage.getItem('movie-search-theme');
      if (!savedTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    try {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (error) {
      console.warn('Error setting up media query listener:', error);
    }
  }, [isHydrated]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('movie-search-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      } catch (error) {
        console.warn('Error saving theme to localStorage:', error);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};