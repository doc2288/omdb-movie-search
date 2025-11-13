import { useState } from 'react';
import { useLanguage } from '~/contexts/LanguageContext';

const languages = [
  { code: 'en' as const, name: 'English', shortCode: 'EN' },
  { code: 'uk' as const, name: 'Українська', shortCode: 'UA' },
  { code: 'no' as const, name: 'Norsk', shortCode: 'NO' },
];

const LanguageToggle = () => {
  const { language, setLanguage, isHydrated } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (!isHydrated) {
    return (
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-dark-bg-tertiary animate-pulse" />
    );
  }

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 h-10 px-3 rounded-lg bg-white dark:bg-dark-bg-card border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-secondary transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-dark-text-primary"
        aria-label="Select language"
        aria-expanded={isOpen}
        title="Select language"
      >
        <span className="text-xs font-semibold text-gray-600 dark:text-dark-text-secondary leading-none">{currentLang.shortCode}</span>
        <span className="hidden sm:inline leading-none">{currentLang.name}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-card border border-gray-200 dark:border-dark-border rounded-lg shadow-xl z-50 animate-scale-in">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                    language === lang.code
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-secondary'
                  }`}
                >
                  <span className="text-xs font-semibold min-w-[2rem] leading-none">{lang.shortCode}</span>
                  <span className="leading-none">{lang.name}</span>
                  {language === lang.code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;

