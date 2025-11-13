import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation } from '~/utils/translations';
import type { Language } from '~/utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }
  try {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'uk' || savedLanguage === 'no') {
      return savedLanguage;
    }
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'uk') return 'uk';
    if (browserLang === 'no' || browserLang === 'nb' || browserLang === 'nn') return 'no';
    return 'en';
  } catch {
    return 'en';
  }
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const actualLanguage = getInitialLanguage();
    setLanguageState(actualLanguage);
    setIsHydrated(true);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('language', newLanguage);
    } catch {}
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  );
};

