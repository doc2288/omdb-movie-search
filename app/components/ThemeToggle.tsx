import { useTheme } from '~/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        className="
          relative inline-flex items-center justify-center
          w-14 h-7 rounded-full transition-all duration-300 ease-in-out
          bg-gray-300 dark:bg-gray-600
          hover:bg-gray-400 dark:hover:bg-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800 focus:ring-offset-white
          border border-gray-300 dark:border-gray-500
        "
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {/* Toggle circle */}
        <div
          className={`
            absolute w-5 h-5 rounded-full transition-all duration-300 ease-in-out
            bg-white shadow-lg transform flex items-center justify-center
            border border-gray-200 dark:border-gray-400
            ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}
          `}
        >
          {/* Sun icon for light mode */}
          <svg
            className={`w-3 h-3 transition-opacity duration-300 text-yellow-500 ${
              theme === 'light' ? 'opacity-100' : 'opacity-0'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
          
          {/* Moon icon for dark mode */}
          <svg
            className={`w-3 h-3 transition-opacity duration-300 absolute text-blue-400 ${
              theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>
        
        {/* Background icons for visual feedback */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <svg 
            className={`w-4 h-4 text-yellow-400 transition-opacity duration-300 ${
              theme === 'light' ? 'opacity-30' : 'opacity-60'
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
          
          <svg 
            className={`w-4 h-4 text-blue-300 transition-opacity duration-300 ${
              theme === 'dark' ? 'opacity-30' : 'opacity-60'
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;