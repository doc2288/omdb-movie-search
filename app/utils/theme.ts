import { Theme } from '~/contexts/ThemeContext';

/**
 * Ключ для localStorage
 */
export const THEME_STORAGE_KEY = 'movie-search-theme';

/**
 * Получает сохраненную тему из localStorage
 */
export function getSavedTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
    return null;
  }
}

/**
 * Сохраняет тему в localStorage
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Error saving theme to localStorage:', error);
  }
}

/**
 * Получает системные предпочтения темы
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Error reading system theme preference:', error);
    return 'light';
  }
}

/**
 * Применяет тему к документу
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  try {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    
    // Дополнительно устанавливаем атрибут для совместимости
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновляем meta-тег для мобильных браузеров
    updateThemeColorMeta(theme);
  } catch (error) {
    console.warn('Error applying theme to document:', error);
  }
}

/**
 * Обновляет meta-тег theme-color для мобильных браузеров
 */
function updateThemeColorMeta(theme: Theme): void {
  try {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    const color = theme === 'dark' ? '#0F0F23' : '#FFFFFF';
    metaThemeColor.setAttribute('content', color);
  } catch (error) {
    console.warn('Error updating theme-color meta tag:', error);
  }
}

/**
 * Получает начальную тему (сохраненную или системную)
 */
export function getInitialTheme(): Theme {
  const saved = getSavedTheme();
  return saved || getSystemTheme();
}

/**
 * Настраивает слушатель системных предпочтений
 */
export function setupSystemThemeListener(
  callback: (theme: Theme) => void,
  shouldIgnoreSaved = false
): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Применяем системные изменения только если нет сохраненных предпочтений
      const savedTheme = getSavedTheme();
      if (!savedTheme || shouldIgnoreSaved) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        callback(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Возвращаем функцию очистки
    return () => mediaQuery.removeEventListener('change', handleChange);
  } catch (error) {
    console.warn('Error setting up system theme listener:', error);
    return null;
  }
}

/**
 * Проверяет, поддерживает ли браузер localStorage
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__theme_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}