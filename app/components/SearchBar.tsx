import { Form, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import type { SearchParams } from '~/types/omdb';

interface SearchBarProps {
  defaultValues: SearchParams;
  onSubmit?: () => void;
  isLoading?: boolean;
}

const MOVIE_TYPES = [
  { value: '', label: 'All Types', icon: '🎬' },
  { value: 'movie', label: 'Movies', icon: '🎬' },
  { value: 'series', label: 'TV Series', icon: '📺' },
  { value: 'episode', label: 'Episodes', icon: '📹' },
];

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
  const [searchTerm, setSearchTerm] = useState(defaultValues.s || '');
  const [isExpanded, setIsExpanded] = useState(!!defaultValues.type || !!defaultValues.y || !!defaultValues.genre);
  const submit = useSubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.set('page', '1'); // Reset to first page on new search
    submit(formData, { method: "get" });
  };

  const handleSearchClick = () => {
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  };

  const handleClearFilters = () => {
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
      const formData = new FormData();
      formData.set('s', searchTerm);
      formData.set('page', '1');
      submit(formData, { method: "get" });
    }
  };

  const hasActiveFilters = defaultValues.type || defaultValues.y || defaultValues.genre;

  return (
    <div className="bg-white dark:bg-dark-bg-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-200 dark:border-dark-border transition-all duration-300">
      <Form
        id="search-form"
        method="get"
        className="p-6"
        onSubmit={handleSubmit}
      >
        {/* Main Search Input */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-3">
            🔍 Search for movies, series and episodes
          </label>
          <div className="relative flex gap-2">
            <div className="relative flex-1 group">
              <input
                id="search"
                name="s"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter movie title, director, actor..."
                className="w-full px-4 py-4 pl-12 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg group-hover:border-gray-400 dark:group-hover:border-gray-600"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap font-medium"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Search</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors group"
          >
            <svg
              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Active
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filters */}
        <div className={`space-y-4 transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">
                🎬 Content Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={defaultValues.type || ''}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                {MOVIE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">
                📅 Release Year
              </label>
              <select
                id="year"
                name="y"
                defaultValue={defaultValues.y || ''}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">✨ Any Year</option>
                {YEARS.slice(0, 50).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">
                🎭 Genre
              </label>
              <select
                id="genre"
                name="genre"
                defaultValue={defaultValues.genre || ''}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">🌎 Any Genre</option>
                {POPULAR_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Popular Search Suggestions */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-4">
            <div className="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-3">
              🔥 Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {['Marvel', 'Batman', 'Star Wars', 'Harry Potter', 'John Wick', 'Avengers'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchTerm(term);
                    const form = document.getElementById('search-form') as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      formData.set('s', term);
                      formData.set('page', '1');
                      submit(formData, { method: "get" });
                    }
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}