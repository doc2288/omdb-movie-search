import { Form, useSubmit } from '@remix-run/react';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { SearchParams } from '~/types/omdb';
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
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => CURRENT_YEAR - i
);

export default function SearchBar({ defaultValues, onSubmit, isLoading }: SearchBarProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(defaultValues.s || '');
  const [isExpanded, setIsExpanded] = useState(!!defaultValues.type || !!defaultValues.y || !!defaultValues.genre);
  const [yearInput, setYearInput] = useState(defaultValues.y || '');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [genreInput, setGenreInput] = useState(defaultValues.genre || '');
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const yearRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const genreSearchInputRef = useRef<HTMLInputElement>(null);
  const submit = useSubmit();

  // Sync state with defaultValues changes
  useEffect(() => {
    setYearInput(defaultValues.y || '');
    setGenreInput(defaultValues.genre || '');
  }, [defaultValues.y, defaultValues.genre]);

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

  const handleYearChange = useCallback((year: string) => {
    setYearInput(year);
    setIsYearOpen(false);
    setYearSearch('');
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      if (year) {
        formData.set('y', year);
      } else {
        formData.delete('y');
      }
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  }, [submit]);

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
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
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

  const filteredGenres = useMemo(() => {
    if (!genreSearch) return POPULAR_GENRES;
    const search = genreSearch.toLowerCase();
    return POPULAR_GENRES.filter(genre => genre.toLowerCase().includes(search));
  }, [genreSearch]);

  const hasActiveFilters = defaultValues.type || defaultValues.y || defaultValues.genre;
  const activeFiltersCount = [defaultValues.type, defaultValues.y, defaultValues.genre].filter(Boolean).length;

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
            Filters
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
                        const form = document.getElementById('search-form') as HTMLFormElement;
                        if (form) {
                          const formData = new FormData(form);
                          if (type.value) {
                            formData.set('type', type.value);
                          } else {
                            formData.delete('type');
                          }
                          formData.set('page', '1');
                          submit(formData, { method: "get" });
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

            {/* Year and Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Dropdown */}
              <div ref={yearRef} className="relative" style={{ overflow: 'visible' }}>
                <label htmlFor="year" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('search.releaseYear')}
                </label>
                <div className="relative" style={{ overflow: 'visible' }}>
                  <input
                    type="text"
                    id="year"
                    name="y"
                    value={yearInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        setYearInput(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && /^\d{4}$/.test(value)) {
                        const yearNum = parseInt(value, 10);
                        if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                          handleYearChange(value);
                        } else {
                          setYearInput('');
                          handleYearChange('');
                        }
                      } else if (!value) {
                        handleYearChange('');
                      } else {
                        // Invalid format, clear it
                        setYearInput('');
                        handleYearChange('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = yearInput.trim();
                        if (value && /^\d{4}$/.test(value)) {
                          const yearNum = parseInt(value, 10);
                          if (yearNum >= 1900 && yearNum <= CURRENT_YEAR) {
                            handleYearChange(value);
                          }
                        } else if (!value) {
                          handleYearChange('');
                        }
                        setIsYearOpen(false);
                      }
                    }}
                    onFocus={() => {
                      setIsYearOpen(true);
                    }}
                    onClick={() => {
                      setIsYearOpen(true);
                    }}
                    placeholder={t('search.anyYear')}
                    className="w-full px-3 py-2 pr-8 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsYearOpen(!isYearOpen);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className={`h-4 w-4 transform transition-transform ${isYearOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isYearOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg shadow-xl max-h-96 overflow-hidden" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                      <div className="overflow-y-auto max-h-96">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleYearChange('');
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                            !yearInput ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
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
                              handleYearChange(year.toString());
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                              yearInput === year.toString() ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
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
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onBlur={(e) => {
                      // Apply the genre on blur if it's not empty
                      const value = e.target.value.trim();
                      if (value) {
                        handleGenreChange(value);
                      } else {
                        handleGenreChange('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = genreInput.trim();
                        if (value) {
                          handleGenreChange(value);
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
                          placeholder="Search genre..."
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
                        {filteredGenres.map((genre) => (
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
                            {genre}
                          </button>
                        ))}
                        {filteredGenres.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No genres found
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
