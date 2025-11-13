import { useSearchParams, useSubmit } from '@remix-run/react';
import { useLanguage } from '~/contexts/LanguageContext';

type SortOption = 'default' | 'rating-desc' | 'rating-asc' | 'year-desc' | 'year-asc' | 'title-asc' | 'title-desc';

export default function SortFilter() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const { t } = useLanguage();

  const currentSort = (searchParams.get('sort') || 'default') as SortOption;

  const sortOptions: Array<{ value: SortOption; label: string; icon: string }> = [
    { value: 'default', label: t('sort.default'), icon: '🔀' },
    { value: 'rating-desc', label: t('sort.ratingDesc'), icon: '⭐' },
    { value: 'rating-asc', label: t('sort.ratingAsc'), icon: '⭐' },
    { value: 'year-desc', label: t('sort.yearDesc'), icon: '📅' },
    { value: 'year-asc', label: t('sort.yearAsc'), icon: '📅' },
    { value: 'title-asc', label: t('sort.titleAsc'), icon: '🔤' },
    { value: 'title-desc', label: t('sort.titleDesc'), icon: '🔤' },
  ];

  const handleSortChange = (sortValue: SortOption) => {
    const formData = new FormData();
    
    // Preserve all existing search params
    searchParams.forEach((value, key) => {
      if (key !== 'sort') {
        formData.set(key, value);
      }
    });
    
    if (sortValue !== 'default') {
      formData.set('sort', sortValue);
    }
    
    formData.set('page', '1'); // Reset to first page when sorting
    
    submit(formData, { method: 'get' });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        {t('sort.sortBy')}:
      </label>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="px-3 py-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm font-medium cursor-pointer appearance-none pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

