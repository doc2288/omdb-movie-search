import { Form } from '@remix-run/react';
import type { SearchParams } from '~/types/omdb';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  searchParams: SearchParams;
}

const RESULTS_PER_PAGE = 10;

export default function Pagination({ currentPage, totalResults, searchParams }: PaginationProps) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    if (searchParams.s) params.set('s', searchParams.s);
    if (searchParams.type) params.set('type', searchParams.type);
    if (searchParams.y) params.set('y', searchParams.y);
    if (searchParams.genre) params.set('genre', searchParams.genre);
    params.set('page', page.toString());
    
    return `/?${params.toString()}`;
  };

  const getVisiblePageNumbers = () => {
    const delta = 2; // Show 2 pages on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-bg-card border border-gray-200 dark:border-dark-border rounded-xl shadow-card-light dark:shadow-card-dark p-6 transition-colors duration-300">
      {/* Mobile pagination */}
      <div className="flex justify-between items-center sm:hidden">
        <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          {hasPrevPage ? (
            <a
              href={createPageUrl(currentPage - 1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <svg className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </a>
          ) : (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-not-allowed">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          )}
          
          {hasNextPage ? (
            <a
              href={createPageUrl(currentPage + 1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              Next
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-not-allowed">
              Next
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-700 dark:text-dark-text-secondary">
            <span className="mr-1">📄</span>
            Showing page <span className="font-semibold text-blue-600 dark:text-blue-400 mx-1">{currentPage}</span> of{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400 mx-1">{totalPages}</span> pages
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {totalResults.toLocaleString()} results
          </div>
        </div>
        
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {/* Previous button */}
          {hasPrevPage ? (
            <a
              href={createPageUrl(currentPage - 1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1 hidden md:block">Previous</span>
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1 hidden md:block">Previous</span>
            </span>
          )}
          
          {/* Page numbers */}
          <div className="flex">
            {getVisiblePageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-bg-secondary border-t border-b border-gray-300 dark:border-dark-border"
                  >
                    •••
                  </span>
                );
              }
              
              const page = pageNum as number;
              const isActive = page === currentPage;
              
              return (
                <a
                  key={page}
                  href={createPageUrl(page)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b transition-all duration-200 ${isActive
                      ? 'z-10 bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-white dark:bg-dark-bg-secondary border-gray-300 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </a>
              );
            })}
          </div>
          
          {/* Next button */}
          {hasNextPage ? (
            <a
              href={createPageUrl(currentPage + 1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 group"
            >
              <span className="mr-1 hidden md:block">Next</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg cursor-not-allowed">
              <span className="mr-1 hidden md:block">Next</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </nav>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Start</span>
          <span>{Math.round((currentPage / totalPages) * 100)}% complete</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );
}