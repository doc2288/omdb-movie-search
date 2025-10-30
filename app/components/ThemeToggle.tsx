import { useTheme } from '~/contexts/ThemeContext';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme, isHydrated } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const updateThemeFromDOM = () => {
      if (typeof document !== 'undefined') {
        const hasDarkClass = document.documentElement.classList.contains('dark');
        setCurrentTheme(hasDarkClass ? 'dark' : 'light');
      }
    };
    
    updateThemeFromDOM();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateThemeFromDOM();
        }
      });
    });
    
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isHydrated) {
      setCurrentTheme(theme);
    }
  }, [isHydrated, theme]);

  const isDark = currentTheme === 'dark';

  return (
    <button
      type="button"
      onClick={isHydrated ? toggleTheme : undefined}
      className={`relative inline-flex w-12 h-6 items-center rounded-full border border-blue-400/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300 ${
        isDark ? 'bg-gray-600' : 'bg-gray-300'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      disabled={!isHydrated}
    >
      <span
        className={`absolute top-0.5 left-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <svg className="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        ) : (
          <svg className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011-1zm-9.193.707a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2 1 1 0 000 2zm3.05 6.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414-8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM16 11a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;