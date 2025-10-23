import { useTheme } from '~/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isHydrated } = useTheme();
  const isDark = theme === 'dark';

  // Предотвращаем мигание до гидратации
  if (!isHydrated) {
    return (
      <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full border border-blue-400/80 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex w-14 h-7 items-center rounded-full border border-blue-400/80 bg-gray-300 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-blue-500/90"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span
        className={`absolute top-1 left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg will-change-transform transition-all duration-300 ease-in-out ${isDark ? 'translate-x-[24px] bg-gray-100' : 'translate-x-0 bg-white'}`}
      >
        {isDark ? (
          <svg 
            className="h-3 w-3 text-blue-400 transition-all duration-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        ) : (
          <svg 
            className="h-3 w-3 text-yellow-500 transition-all duration-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707z"
            />
          </svg>
        )}
      </span>
      
      {/* Дополнительные индикаторы для лучшей визуализации */}
      <div className={`absolute top-1/2 left-2 transform -translate-y-1/2 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
      </div>
      
      <div className={`absolute top-1/2 right-2 transform -translate-y-1/2 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-1 h-1 bg-blue-300 rounded-full" />
        <div className="w-0.5 h-0.5 bg-blue-200 rounded-full mt-0.5 ml-1" />
      </div>
    </button>
  );
};

export default ThemeToggle;