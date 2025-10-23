import { useTheme } from '~/contexts/ThemeContext';

/*
 Track: w-14 (56px), h-7 (28px), border 1px => inner 54x26 when using overflow-hidden
 Knob: w-5 (20px), h-5 (20px)
 Left/right padding: 3px (0.75rem = 12px? no). Tailwind top-1=4px. We'll compute precisely:
 Use inset-y-1 to vertically center knob with fixed left-1 and when dark translate-x-[24px].
 4px (left-1) + 20px (knob) + 24px (translate) = 48px < 54px inner width -> right gap ~6px including borders -> safe
*/
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 border border-blue-400/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-200 ease-out ${theme === 'dark' ? 'translate-x-[24px]' : 'translate-x-0'}`}>
        {theme === 'light' ? (
          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
