import { useTheme } from '~/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isHydrated } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={isHydrated ? toggleTheme : undefined}
      disabled={!isHydrated}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg select-none outline-none focus:outline-none focus:ring-0 transition-colors duration-200 ${
        isDark
          ? 'bg-dark-bg-tertiary hover:bg-dark-bg-card'
          : 'bg-light-bg-secondary hover:bg-light-bg-tertiary'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      ) : (
        <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 00-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm-8.95 2.83a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;