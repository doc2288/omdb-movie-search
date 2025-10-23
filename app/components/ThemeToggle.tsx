import { useTheme } from '~/contexts/ThemeContext';

/* Stable, simple toggle: translate uses full pixel math; no conflicting classes */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative inline-flex w-14 h-7 items-center rounded-full border border-blue-400/80 bg-gray-300 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 overflow-hidden"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* knob container */}
      <span
        className={`absolute top-1 left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ease-out will-change-transform ${isDark ? 'translate-x-[24px]' : 'translate-x-0'}`}
      >
        {isDark ? (
          <svg className="h-3 w-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
        ) : (
          <svg className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707z"/></svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
