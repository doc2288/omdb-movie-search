import { useTheme } from '~/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isHydrated } = useTheme();

  // Don't render until hydrated to prevent flash
  if (!isHydrated) {
    return (
      <div className="w-14 md:w-16 h-8 md:h-9 bg-gray-300 rounded-full animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={[
        'relative inline-flex items-center justify-center',
        'h-8 md:h-9 w-14 md:w-16 rounded-full',
        'bg-gray-300 dark:bg-gray-600',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'ring-offset-2 dark:ring-offset-gray-900 ring-offset-white',
        'hover:bg-gray-400 dark:hover:bg-gray-500',
        'active:scale-95',
      ].join(' ')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Toggle knob */}
      <div
        className={[
          'absolute left-[2px]',
          'top-1/2 -translate-y-1/2',
          'h-6 w-6 md:h-7 md:w-7',
          'rounded-full bg-white shadow-md',
          'transition-all duration-200 ease-out',
          theme === 'dark' ? 'left-[calc(100%-2px)] -translate-x-full' : 'translate-x-0',
          'flex items-center justify-center',
        ].join(' ')}
      >
        {/* Sun icon */}
        <svg
          className={[
            'absolute transition-all duration-200',
            theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            'h-[14px] w-[14px] md:h-[16px] md:w-[16px]',
            'text-yellow-500',
          ].join(' ')}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707z"
            clipRule="evenodd"
          />
        </svg>
        
        {/* Moon icon */}
        <svg
          className={[
            'absolute transition-all duration-200',
            theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            'h-[14px] w-[14px] md:h-[16px] md:w-[16px]',
            'text-blue-500',
          ].join(' ')}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;