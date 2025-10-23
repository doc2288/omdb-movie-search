import { useState } from 'react';
import { useTheme } from '~/contexts/ThemeContext';
import type { Theme } from '~/contexts/ThemeContext';

interface ThemeSettingsProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const ThemeSettings = ({ className = '', isOpen = false, onClose }: ThemeSettingsProps) => {
  const { theme, setTheme, isHydrated } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme | 'system'>(
    typeof window !== 'undefined' && localStorage.getItem('movie-search-theme') ? theme : 'system'
  );

  const handleThemeChange = (newTheme: Theme | 'system') => {
    setSelectedTheme(newTheme);
    
    if (newTheme === 'system') {
      // Удаляем сохраненные предпочтения
      if (typeof window !== 'undefined') {
        localStorage.removeItem('movie-search-theme');
      }
      
      // Применяем системную тему
      const systemTheme: Theme = 
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Подложка */}
      <div className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50" onClick={onClose} />
      
      {/* Модальное окно */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl border border-gray-200 dark:border-dark-border p-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
            Настройки темы
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Опции тем */}
        <div className="space-y-3">
          {/* Светлая тема */}
          <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={selectedTheme === 'light'}
              onChange={() => handleThemeChange('light')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedTheme === 'light' 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedTheme === 'light' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">Светлая тема</div>
                <div className="text-sm text-gray-500 dark:text-dark-text-tertiary">Яркая цветовая схема</div>
              </div>
            </div>
          </label>

          {/* Темная тема */}
          <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={selectedTheme === 'dark'}
              onChange={() => handleThemeChange('dark')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedTheme === 'dark' 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedTheme === 'dark' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">Темная тема</div>
                <div className="text-sm text-gray-500 dark:text-dark-text-tertiary">Мягкая для глаз схема</div>
              </div>
            </div>
          </label>

          {/* Системная тема */}
          <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={selectedTheme === 'system'}
              onChange={() => handleThemeChange('system')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              selectedTheme === 'system' 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedTheme === 'system' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-medium text-gray-900 dark:text-dark-text-primary">Системная</div>
                <div className="text-sm text-gray-500 dark:text-dark-text-tertiary">Следовать настройкам ОС</div>
              </div>
            </div>
          </label>
        </div>

        {/* Информация */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-dark-text-tertiary">
            Ваши предпочтения автоматически сохраняются в локальном хранилище браузера.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;