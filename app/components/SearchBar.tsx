import { Form, useSubmit } from '@remix-run/react';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { SearchParams } from '~/types/movie-api';
import { useLanguage } from '~/contexts/LanguageContext';

interface SearchBarProps {
  defaultValues: SearchParams;
  onSubmit?: () => void;
  isLoading?: boolean;
}

const POPULAR_GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Music',
  'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
] as const;

type GenreKey = typeof POPULAR_GENRES[number];

const getGenreTranslationKey = (genre: string): string => {
  const genreMap: Record<string, string> = {
    'Action': 'search.genres.action',
    'Adventure': 'search.genres.adventure',
    'Animation': 'search.genres.animation',
    'Biography': 'search.genres.biography',
    'Comedy': 'search.genres.comedy',
    'Crime': 'search.genres.crime',
    'Documentary': 'search.genres.documentary',
    'Drama': 'search.genres.drama',
    'Family': 'search.genres.family',
    'Fantasy': 'search.genres.fantasy',
    'Horror': 'search.genres.horror',
    'Music': 'search.genres.music',
    'Mystery': 'search.genres.mystery',
    'Romance': 'search.genres.romance',
    'Sci-Fi': 'search.genres.sciFi',
    'Sport': 'search.genres.sport',
    'Thriller': 'search.genres.thriller',
    'War': 'search.genres.war',
    'Western': 'search.genres.western',
  };
  return genreMap[genre] || genre;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => CURRENT_YEAR - i
);

export default function SearchBar({ defaultValues, onSubmit, isLoading }: SearchBarProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(defaultValues.s || '');
  const [isExpanded, setIsExpanded] = useState(!!defaultValues.type || !!defaultValues.yearFrom || !!defaultValues.yearTo || !!defaultValues.genre);
  const [yearFromInput, setYearFromInput] = useState(defaultValues.yearFrom || '');
  const [yearToInput, setYearToInput] = useState(defaultValues.yearTo || '');
  const [isYearFromOpen, setIsYearFromOpen] = useState(false);
  const [isYearToOpen, setIsYearToOpen] = useState(false);
  const [yearRangeError, setYearRangeError] = useState(false);
  const [genreInput, setGenreInput] = useState(defaultValues.genre || '');
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const yearFromRef = useRef<HTMLDivElement>(null);
  const yearToRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const genreSearchInputRef = useRef<HTMLInputElement>(null);
  const submit = useSubmit();

  // Sync state with defaultValues changes
  useEffect(() => {
    setYearFromInput(defaultValues.yearFrom || '');
    setYearToInput(defaultValues.yearTo || '');
    setGenreInput(defaultValues.genre || '');
    
    // Validate range on sync
    if (defaultValues.yearFrom && defaultValues.yearTo) {
      const yearFromNum = parseInt(defaultValues.yearFrom, 10);
      const yearToNum = parseInt(defaultValues.yearTo, 10);
      setYearRangeError(!isNaN(yearFromNum) && !isNaN(yearToNum) && yearFromNum > yearToNum);
    } else {
      setYearRangeError(false);
    }
  }, [defaultValues.yearFrom, defaultValues.yearTo, defaultValues.genre]);
  
  // Validate range whenever inputs change
  useEffect(() => {
    if (yearFromInput && yearToInput) {
      const yearFromNum = parseInt(yearFromInput, 10);
      const yearToNum = parseInt(yearToInput, 10);
      setYearRangeError(!isNaN(yearFromNum) && !isNaN(yearToNum) && yearFromNum > yearToNum);
    } else {
      setYearRangeError(false);
    }
  }, [yearFromInput, yearToInput]);

  // Auto-focus search input when genre dropdown opens
  useEffect(() => {
    if (isGenreOpen && genreSearchInputRef.current) {
      setTimeout(() => {
        genreSearchInputRef.current?.focus();
      }, 0);
    }
  }, [isGenreOpen]);

  const MOVIE_TYPES = useMemo(() => [
    { value: '', label: t('search.allTypes'), icon: '🎬' },
    { value: 'movie', label: t('search.movies'), icon: '🎬' },
    { value: 'series', label: t('search.tvSeries'), icon: '📺' },
    { value: 'episode', label: t('search.episodes'), icon: '📹' },
  ], [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.set('page', '1');
    submit(formData, { method: "get" });
  };

  const handleClearFilters = useCallback(() => {
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData();
      formData.set('s', searchTerm);
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [searchTerm, submit]);

  const handleFilterChange = useCallback(() => {
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [submit]);

  const handleYearFromChange = useCallback((year: string) => {
    setYearFromInput(year);
    setIsYearFromOpen(false);
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      
      // Validate range: yearFrom should not be greater than yearTo
      if (year && yearToInput) {
        const yearFromNum = parseInt(year, 10);
        const yearToNum = parseInt(yearToInput, 10);
        if (!isNaN(yearFromNum) && !isNaN(yearToNum) && yearFromNum > yearToNum) {
          // If invalid range, clear yearTo
          formData.delete('yearTo');
          setYearToInput('');
        }
      }
      
      if (year) {
        formData.set('yearFrom', year);
      } else {
        formData.delete('yearFrom');
      }
      // Remove old y parameter if exists
      formData.delete('y');
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [submit, yearToInput]);

  const handleYearToChange = useCallback((year: string) => {
    setYearToInput(year);
    setIsYearToOpen(false);
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      
      // Validate range: yearTo should not be less than yearFrom
      if (year && yearFromInput) {
        const yearFromNum = parseInt(yearFromInput, 10);
        const yearToNum = parseInt(year, 10);
        if (!isNaN(yearFromNum) && !isNaN(yearToNum) && yearToNum < yearFromNum) {
          // If invalid range, clear yearFrom
          formData.delete('yearFrom');
          setYearFromInput('');
        }
      }
      
      if (year) {
        formData.set('yearTo', year);
      } else {
        formData.delete('yearTo');
      }
      // Remove old y parameter if exists
      formData.delete('y');
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [submit, yearFromInput]);

  const handleGenreChange = useCallback((genre: string) => {
    setGenreInput(genre);
    setIsGenreOpen(false);
    setGenreSearch('');
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      if (genre) {
        formData.set('genre', genre);
      } else {
        formData.delete('genre');
      }
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [submit]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearFromRef.current && !yearFromRef.current.contains(event.target as Node)) {
        setIsYearFromOpen(false);
      }
      if (yearToRef.current && !yearToRef.current.contains(event.target as Node)) {
        setIsYearToOpen(false);
      }
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false);
        setGenreSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTranslatedGenre = useCallback((genre: string): string => {
    if (!genre) return '';
    const genreKey = getGenreTranslationKey(genre);
    return genreKey.startsWith('search.genres.') ? t(genreKey as any) : genre;
  }, [t]);

  const filteredGenres = useMemo(() => {
    if (!genreSearch) return POPULAR_GENRES;
    const search = genreSearch.toLowerCase();
    return POPULAR_GENRES.filter(genre => {
      const genreKey = getGenreTranslationKey(genre);
      const translatedGenre = genreKey.startsWith('search.genres.') ? t(genreKey as any) : genre;
      return genre.toLowerCase().includes(search) || translatedGenre.toLowerCase().includes(search);
    });
  }, [genreSearch, t]);

  const hasActiveFilters = defaultValues.type || defaultValues.yearFrom || defaultValues.yearTo || defaultValues.genre;
  const activeFiltersCount = [defaultValues.type, defaultValues.yearFrom, defaultValues.yearTo, defaultValues.genre].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-dark-bg-card rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-dark-border">
      <Form
        id="search-form"
        method="get"
        onSubmit={handleSubmit}
        className="p-4"
      >
        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              id="search"
              name="s"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full px-4 py-3 pl-11 pr-10 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">{t('search.searching')}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{t('search.button')}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-border">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg
              className={`h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {t('search.filters')}
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white dark:bg-blue-500">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              {t('search.clearFilters')}
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        <div className={`transition-all duration-300 overflow-visible ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 space-y-4" style={{ overflow: 'visible' }}>
            {/* Content Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('search.contentType')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MOVIE_TYPES.map((type) => {
                  const isActive = (type.value === '' && !defaultValues.type) || defaultValues.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        onSubmit?.(); // Показываем индикатор загрузки сразу
                        const form = document.getElementById('search-form') as HTMLFormElement;
                        if (form) {
                          const formData = new FormData(form);
                          if (type.value) {
                            formData.set('type', type.value);
                          } else {
                            formData.delete('type');
                          }
                          formData.set('page', '1');
                          // Используем navigate для более быстрого переключения
                          submit(formData, { method: "get", replace: false });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" name="type" defaultValue={defaultValues.type || ''} />
            </div>

            {/* Year Range and Genre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year From Dropdown */}
              <div ref={yearFromRef} className="relative" style={{ overflow: 'visible', marginBottom: yearRangeError && yearFromInput ? '20px' : '0' }}>
                <label htmlFor="yearFrom" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('search.yearFrom')}
                </label>
                <div className="relative" style={{ overflow: 'visible' }}>
                  <input
                    type="text"
                    id="yearFrom"
                    name="yearFrom"
                    value={yearFromInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        setYearFromInput(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && /^\d{4}$/.test(value)) {
                        const yearNum = parseInt(value, 10);
                        if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                          // Validate range: yearFrom should not be greater than yearTo
                          if (yearToInput) {
                            const yearToNum = parseInt(yearToInput, 10);
                            if (!isNaN(yearToNum) && yearNum > yearToNum) {
                              // Invalid range, show error but don't clear
                              setYearFromInput(value);
                              return;
                            }
                          }
                          handleYearFromChange(value);
                        } else {
                          setYearFromInput('');
                          handleYearFromChange('');
                        }
                      } else if (!value) {
                        handleYearFromChange('');
                      } else {
                        // Invalid format, clear it
                        setYearFromInput('');
                        handleYearFromChange('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = yearFromInput.trim();
                        if (value && /^\d{4}$/.test(value)) {
                          const yearNum = parseInt(value, 10);
                          if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                            handleYearFromChange(value);
                          }
                        } else if (!value) {
                          handleYearFromChange('');
                        }
                        setIsYearFromOpen(false);
                      }
                    }}
                    onFocus={() => {
                      setIsYearFromOpen(true);
                    }}
                    onClick={() => {
                      setIsYearFromOpen(true);
                    }}
                    placeholder={t('search.anyYear')}
                    className={`w-full px-3 py-2 pr-8 bg-white dark:bg-dark-bg-secondary border ${
                      yearRangeError && yearFromInput ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-dark-border'
                    } text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm`}
                  />
                  {yearRangeError && yearFromInput && (
                    <div className="absolute -bottom-5 left-0 text-xs text-red-600 dark:text-red-400 whitespace-nowrap">
                      {t('search.yearRangeError')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsYearFromOpen(!isYearFromOpen);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className={`h-4 w-4 transform transition-transform ${isYearFromOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isYearFromOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg shadow-xl max-h-96 overflow-hidden" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                      <div className="overflow-y-auto max-h-96">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleYearFromChange('');
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                            !yearFromInput ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {t('search.anyYear')}
                        </button>
                        {YEARS.slice(0, 50).map((year) => (
                          <button
                            key={year}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleYearFromChange(year.toString());
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                              yearFromInput === year.toString() ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Year To Dropdown */}
              <div ref={yearToRef} className="relative" style={{ overflow: 'visible', marginBottom: yearRangeError && yearToInput ? '20px' : '0' }}>
                <label htmlFor="yearTo" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('search.yearTo')}
                </label>
                <div className="relative" style={{ overflow: 'visible' }}>
                  <input
                    type="text"
                    id="yearTo"
                    name="yearTo"
                    value={yearToInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        setYearToInput(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && /^\d{4}$/.test(value)) {
                        const yearNum = parseInt(value, 10);
                        if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                          // Validate range: yearTo should not be less than yearFrom
                          if (yearFromInput) {
                            const yearFromNum = parseInt(yearFromInput, 10);
                            if (!isNaN(yearFromNum) && yearNum < yearFromNum) {
                              // Invalid range, show error but don't clear
                              setYearToInput(value);
                              return;
                            }
                          }
                          handleYearToChange(value);
                        } else {
                          setYearToInput('');
                          handleYearToChange('');
                        }
                      } else if (!value) {
                        handleYearToChange('');
                      } else {
                        // Invalid format, clear it
                        setYearToInput('');
                        handleYearToChange('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = yearToInput.trim();
                        if (value && /^\d{4}$/.test(value)) {
                          const yearNum = parseInt(value, 10);
                          if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                            handleYearToChange(value);
                          }
                        } else if (!value) {
                          handleYearToChange('');
                        }
                        setIsYearToOpen(false);
                      }
                    }}
                    onFocus={() => {
                      setIsYearToOpen(true);
                    }}
                    onClick={() => {
                      setIsYearToOpen(true);
                    }}
                    placeholder={t('search.anyYear')}
                    className={`w-full px-3 py-2 pr-8 bg-white dark:bg-dark-bg-secondary border ${
                      yearRangeError && yearToInput ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-dark-border'
                    } text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm`}
                  />
                  {yearRangeError && yearToInput && (
                    <div className="absolute -bottom-5 left-0 text-xs text-red-600 dark:text-red-400 whitespace-nowrap">
                      {t('search.yearRangeError')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsYearToOpen(!isYearToOpen);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className={`h-4 w-4 transform transition-transform ${isYearToOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isYearToOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg shadow-xl max-h-96 overflow-hidden" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                      <div className="overflow-y-auto max-h-96">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleYearToChange('');
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                            !yearToInput ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {t('search.anyYear')}
                        </button>
                        {YEARS.slice(0, 50).map((year) => (
                          <button
                            key={year}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleYearToChange(year.toString());
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                              yearToInput === year.toString() ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Genre Dropdown */}
              <div ref={genreRef} className="relative" style={{ overflow: 'visible' }}>
                <label htmlFor="genre" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('search.genre')}
                </label>
                <div className="relative" style={{ overflow: 'visible' }}>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={genreInput ? getTranslatedGenre(genreInput) : ''}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Find matching genre by translated name
                      const matchingGenre = POPULAR_GENRES.find(genre => {
                        const translated = getTranslatedGenre(genre);
                        return translated.toLowerCase() === inputValue.toLowerCase();
                      });
                      
                      if (matchingGenre) {
                        // If exact match found, use English name
                        setGenreInput(matchingGenre);
                      } else {
                        // Allow free text input for custom genres
                        setGenreInput(inputValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Apply the genre on blur if it's not empty
                      const value = e.target.value.trim();
                      if (value) {
                        // Find matching genre by translated name
                        const matchingGenre = POPULAR_GENRES.find(genre => {
                          const translated = getTranslatedGenre(genre);
                          return translated.toLowerCase() === value.toLowerCase();
                        });
                        
                        if (matchingGenre) {
                          handleGenreChange(matchingGenre);
                        } else {
                          // If no match, use the input value as is (for custom genres)
                          handleGenreChange(value);
                        }
                      } else {
                        handleGenreChange('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value) {
                          // Find matching genre by translated name
                          const matchingGenre = POPULAR_GENRES.find(genre => {
                            const translated = getTranslatedGenre(genre);
                            return translated.toLowerCase() === value.toLowerCase();
                          });
                          
                          if (matchingGenre) {
                            handleGenreChange(matchingGenre);
                          } else {
                            handleGenreChange(value);
                          }
                        } else {
                          handleGenreChange('');
                        }
                        setIsGenreOpen(false);
                      }
                    }}
                    onFocus={(e) => {
                      if (isGenreOpen) {
                        // If dropdown is already open, blur the input and focus search field
                        e.target.blur();
                        setTimeout(() => {
                          genreSearchInputRef.current?.focus();
                        }, 0);
                      } else {
                        setIsGenreOpen(true);
                      }
                    }}
                    onClick={() => {
                      if (!isGenreOpen) {
                        setIsGenreOpen(true);
                      } else {
                        // If already open, focus search field instead
                        setTimeout(() => {
                          genreSearchInputRef.current?.focus();
                        }, 0);
                      }
                    }}
                    readOnly={isGenreOpen}
                    placeholder={t('search.anyGenre')}
                    className="w-full px-3 py-2 pr-8 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm cursor-pointer"
                  />
                  <input type="hidden" name="genre" value={genreInput || ''} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsGenreOpen(!isGenreOpen);
                      setGenreSearch('');
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className={`h-4 w-4 transform transition-transform ${isGenreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isGenreOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg shadow-xl max-h-96 overflow-hidden" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                      <div className="p-2 border-b border-gray-200 dark:border-dark-border">
                        <input
                          type="text"
                          ref={genreSearchInputRef}
                          value={genreSearch}
                          onChange={(e) => setGenreSearch(e.target.value)}
                          placeholder={t('search.searchGenre')}
                          className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-dark-border rounded focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-dark-text-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsGenreOpen(false);
                              setGenreSearch('');
                            }
                          }}
                        />
                      </div>
                      <div className="overflow-y-auto max-h-80">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleGenreChange('');
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                            !genreInput ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {t('search.anyGenre')}
                        </button>
                        {filteredGenres.map((genre) => {
                          const genreKey = getGenreTranslationKey(genre);
                          const translatedGenre = genreKey.startsWith('search.genres.') ? t(genreKey as any) : genre;
                          return (
                            <button
                              key={genre}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleGenreChange(genre);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                                genreInput === genre ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {translatedGenre}
                            </button>
                          );
                        })}
                        {filteredGenres.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {t('search.noGenresFound')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
