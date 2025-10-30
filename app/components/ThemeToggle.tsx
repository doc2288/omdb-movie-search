import { useTheme } from '~/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isHydrated } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={isHydrated ? toggleTheme : undefined}
      disabled={!isHydrated}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors duration-200 select-none outline-none focus:outline-none focus:ring-0 ${
        isDark
          ? 'bg-dark-bg-tertiary text-light-text-primary border-dark-border hover:bg-dark-bg-card'
          : 'bg-light-bg-secondary text-light-text-primary border-light-border hover:bg-light-bg-tertiary'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <svg className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
          <span className="text-sm font-medium">Dark</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707z"/>
          </svg>
          <span className="text-sm font-medium">Light</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
