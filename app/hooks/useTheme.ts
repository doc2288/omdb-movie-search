import { useState, useEffect, useCallback } from 'react';
import { Theme } from '~/contexts/ThemeContext';
import {
  getSavedTheme,
  saveTheme,
  getSystemTheme,
  applyThemeToDocument,
  setupSystemThemeListener,
  isLocalStorageAvailable,
} from '~/utils/theme';

interface UseThemeOptions {
  /** Начальная тема (по умолчанию: сохраненная или системная) */
  initialTheme?: Theme;
  /** Автоматически применять тему к документу */
  applyToDocument?: boolean;
  /** Следить за системными предпочтениями */
  followSystemPreference?: boolean;
}

interface UseThemeReturn {
  /** Текущая тема */
  theme: Theme;
  /** Переключить между светлой и темной темой */
  toggleTheme: () => void;
  /** Установить конкретную тему */
  setTheme: (theme: Theme) => void;
  /** Произошла ли гидратация на клиенте */
  isHydrated: boolean;
  /** Доступен ли localStorage */
  isStorageAvailable: boolean;
  /** Системная тема */
  systemTheme: Theme;
  /** Простоит ли пользователь системные предпочтения */
  isUsingSystemPreference: boolean;
}

const defaultOptions: Required<UseThemeOptions> = {
  initialTheme: 'light',
  applyToDocument: true,
  followSystemPreference: true,
};

/**
 * Кастомный хук для управления темами
 * 
 * Особенности:
 * - Автоматическое сохранение в localStorage
 * - Поддержка системных предпочтений
 * - Безопасность для SSR/гидратации
 * - Обработка ошибок localStorage
 */
export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const opts = { ...defaultOptions, ...options };
  
  // Определяем начальную тему
  const getInitialTheme = useCallback((): Theme => {
    if (opts.initialTheme !== 'light') {
      return opts.initialTheme;
    }
    
    // По умолчанию ищем сохраненную, затем системную
    const savedTheme = getSavedTheme();
    return savedTheme || getSystemTheme();
  }, [opts.initialTheme]);
  
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);
  const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme());
  
  // Определяем, использует ли пользователь системные предпочтения
  const isUsingSystemPreference = !getSavedTheme();

  // Эффект гидратации
  useEffect(() => {
    setIsHydrated(true);
    setIsStorageAvailable(isLocalStorageAvailable());
    
    // Повторная инициализация темы после гидратации
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    setSystemTheme(getSystemTheme());
    
    if (opts.applyToDocument) {
      applyThemeToDocument(initialTheme);
    }
  }, [getInitialTheme, opts.applyToDocument]);

  // Эффект для отслеживания системных предпочтений
  useEffect(() => {
    if (!isHydrated || !opts.followSystemPreference) {
      return;
    }

    const cleanup = setupSystemThemeListener((newSystemTheme) => {
      setSystemTheme(newSystemTheme);
      
      // Применяем только если пользователь не установил тему вручную
      if (isUsingSystemPreference) {
        setThemeState(newSystemTheme);
        if (opts.applyToDocument) {
          applyThemeToDocument(newSystemTheme);
        }
      }
    });

    return cleanup || undefined;
  }, [isHydrated, opts.followSystemPreference, opts.applyToDocument, isUsingSystemPreference]);

  // Функция установки темы
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (isStorageAvailable) {
      saveTheme(newTheme);
    }
    
    if (opts.applyToDocument) {
      applyThemeToDocument(newTheme);
    }
  }, [isStorageAvailable, opts.applyToDocument]);

  // Функция переключения темы
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isHydrated,
    isStorageAvailable,
    systemTheme,
    isUsingSystemPreference,
  };
}