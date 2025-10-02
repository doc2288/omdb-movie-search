import { Form, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import type { SearchParams } from '~/types/omdb';

interface SearchBarProps {
  defaultValues: SearchParams;
  onSubmit?: () => void;
  isLoading?: boolean;
}

const MOVIE_TYPES = [
  { value: '', label: 'Все типы' },
  { value: 'movie', label: 'Фильмы' },
  { value: 'series', label: 'Сериалы' },
  { value: 'episode', label: 'Эпизоды' },
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Form
        id="search-form"
        method="get"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Поиск фильмов, сериалов и эпизодов
          </label>
          <div className="relative">
            <input
              id="search"
              name="s"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите название фильма..."
              className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="button"
              onClick={handleSearchClick}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <svg className="h-5 w-5 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Тип
            </label>
            <select
              id="type"
              name="type"
              defaultValue={defaultValues.type || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {MOVIE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Год
            </label>
            <select
              id="year"
              name="y"
              defaultValue={defaultValues.y || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Любой год</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Жанр
            </label>
            <select
              id="genre"
              name="genre"
              defaultValue={defaultValues.genre || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Любой жанр</option>
              {POPULAR_GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Поиск...
              </span>
            ) : (
              'Найти фильмы'
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}