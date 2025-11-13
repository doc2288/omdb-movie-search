import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { searchMovies, getMovieDetail, getApiManager } from '~/utils/api-manager';
import type { MovieSearchItem, MovieDetail, SearchParams, MovieSearchResponse } from '~/types/movie-api';
import SearchBar from '~/components/SearchBar';
import MovieCard from '~/components/MovieCard';
import Pagination from '~/components/Pagination';
import ThemeToggle from '~/components/ThemeToggle';
import LanguageToggle from '~/components/LanguageToggle';
import SortFilter from '~/components/SortFilter';
import { useLanguage } from '~/contexts/LanguageContext';

export const meta: MetaFunction = () => {
  return [
    { title: 'OMDb Movie Search - Find Movies, Series and Episodes' },
    { name: 'description', content: 'Search and discover movies, series and episodes using the OMDb database with advanced filtering options.' },
  ];
};

interface LoaderData {
  movies: MovieSearchItem[];
  movieDetails: Record<string, MovieDetail>;
  totalResults: number;
  currentPage: number;
  searchParams: SearchParams;
  error?: string;
  isRandomResults?: boolean;
}

const POPULAR_QUERIES = [
  'Marvel', 'Batman', 'Star Wars', 'Disney', 'Action',
  'Comedy', 'Drama', 'Horror', 'Thriller', 'Animation',
  'Adventure', 'Crime', 'Family', 'Fantasy', 'Mystery',
  'Romance', 'Sci-Fi', 'War', 'Western', 'Biography'
];

const MOVIES_PER_PAGE = 120;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const oldYear = url.searchParams.get('y');
  const yearFrom = url.searchParams.get('yearFrom');
  const yearTo = url.searchParams.get('yearTo');
  
  // Migrate old 'y' parameter to yearFrom/yearTo if new parameters are not set
  let finalYearFrom = yearFrom;
  let finalYearTo = yearTo;
  if (oldYear && !yearFrom && !yearTo) {
    finalYearFrom = oldYear;
    finalYearTo = oldYear;
  }
  
  const searchParams: SearchParams = {
    s: url.searchParams.get('s') || undefined,
    type: url.searchParams.get('type') as 'movie' | 'series' | 'episode' | undefined,
    y: oldYear || undefined,
    yearFrom: finalYearFrom || undefined,
    yearTo: finalYearTo || undefined,
    page: url.searchParams.get('page') || '1',
    genre: url.searchParams.get('genre') || undefined,
    sort: url.searchParams.get('sort') || undefined,
  };

  // Check API availability before attempting any searches
  const apiManager = getApiManager();
  if (!apiManager.hasProviders()) {
    return json<LoaderData>({
      movies: [],
      movieDetails: {},
      totalResults: 0,
      currentPage: parseInt(searchParams.page || '1', 10),
      searchParams,
      error: 'No API providers configured. Please set OMDB_API_KEY in your environment variables or use HDRezka.',
    }, {
      status: 200, // Return 200 instead of 500 to show error message in UI
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  try {
    let searchQuery = searchParams.s;
    let isRandomResults = false;

    if (!searchQuery) {
      // Если выбран тип контента, используем соответствующий запрос
      if (searchParams.type === 'series') {
        searchQuery = 'series';
      } else if (searchParams.type === 'movie') {
        searchQuery = 'movie';
      } else {
        const randomIndex = Math.floor(Math.random() * POPULAR_QUERIES.length);
        searchQuery = POPULAR_QUERIES[randomIndex];
      }
      isRandomResults = true;
    }

    // If year range is specified, fetch all pages or query by each year
    const parsedYearFrom = searchParams.yearFrom ? parseInt(searchParams.yearFrom, 10) : null;
    const parsedYearTo = searchParams.yearTo ? parseInt(searchParams.yearTo, 10) : null;
    const hasYearRange = (parsedYearFrom !== null || parsedYearTo !== null) && 
                         (parsedYearFrom === null || parsedYearTo === null || parsedYearFrom <= parsedYearTo);
    
    let allMovies: MovieSearchItem[] = [];
    let totalResultsFromAPI = 0;

    if (hasYearRange && searchQuery) {
      if (parsedYearFrom !== null && parsedYearTo !== null) {
        // Query for each year in the range to get all results
        const yearRange = parsedYearTo - parsedYearFrom + 1;
        
        // If range is small (<= 10 years), query each year separately with all pages
        // Otherwise, fetch all pages from first query
        if (yearRange <= 10) {
          const seenIds = new Set<string>();
          
          for (let year = parsedYearFrom; year <= parsedYearTo; year++) {
            try {
              // Add delay between requests to avoid rate limiting (200ms per request)
              if (year > parsedYearFrom) {
                await new Promise(resolve => setTimeout(resolve, 200));
              }
              
              // Get first page to check total results
              const firstPageResponse = await searchMovies({
                ...searchParams,
                s: searchQuery,
                y: year.toString(),
                page: '1',
              });
              
              if (firstPageResponse.Response === 'True' && firstPageResponse.Search) {
                // Add movies from first page
                for (const movie of firstPageResponse.Search) {
                  if (movie.imdbID && !seenIds.has(movie.imdbID)) {
                    seenIds.add(movie.imdbID);
                    allMovies.push(movie);
                  }
                }
                
                // Get total results for this year
                const yearTotalResults = parseInt(firstPageResponse.totalResults || '0', 10);
                if (totalResultsFromAPI === 0) {
                  totalResultsFromAPI = yearTotalResults;
                }
                
                // Fetch remaining pages for this year (max 5 pages = 50 movies per year to avoid rate limits)
                const yearTotalPages = Math.min(Math.ceil(yearTotalResults / 10), 5);
                for (let page = 2; page <= yearTotalPages; page++) {
                  try {
                    // Add delay between page requests
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    const pageResponse = await searchMovies({
                      ...searchParams,
                      s: searchQuery,
                      y: year.toString(),
                      page: page.toString(),
                    });
                    
                    if (pageResponse.Response === 'True' && pageResponse.Search) {
                      for (const movie of pageResponse.Search) {
                        if (movie.imdbID && !seenIds.has(movie.imdbID)) {
                          seenIds.add(movie.imdbID);
                          allMovies.push(movie);
                        }
                      }
                    }
                  } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn(`Failed to fetch page ${page} for year ${year}:`, error);
                    }
                    // Continue with next page instead of failing completely
                  }
                }
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(`Failed to fetch movies for year ${year}:`, error);
              }
              // Continue with next year instead of failing completely
            }
          }
        }
      } else if ((parsedYearFrom !== null || parsedYearTo !== null) && searchQuery) {
        // If only one bound is specified, fetch all pages from the query
        // For larger ranges, fetch all pages from the first query
        const firstResponse = await searchMovies({
          ...searchParams,
          s: searchQuery,
          page: '1',
        });
        
        if (firstResponse.Response === 'True' && firstResponse.Search) {
          allMovies.push(...firstResponse.Search);
          totalResultsFromAPI = parseInt(firstResponse.totalResults || '0', 10);
          
          // Fetch remaining pages with delays to avoid rate limiting
          // Limit to 20 pages (200 results) to avoid too many requests
          const totalPages = Math.min(Math.ceil(totalResultsFromAPI / 10), 20);
          const seenIds = new Set<string>();
          allMovies.forEach(movie => seenIds.add(movie.imdbID));
          
          for (let page = 2; page <= totalPages; page++) {
            try {
              // Add delay between page requests (200ms)
              await new Promise(resolve => setTimeout(resolve, 200));
              
              const pageResponse = await searchMovies({
                ...searchParams,
                s: searchQuery,
                page: page.toString(),
              });
              
              if (pageResponse.Response === 'True' && pageResponse.Search) {
                for (const movie of pageResponse.Search) {
                  if (movie.imdbID && !seenIds.has(movie.imdbID)) {
                    seenIds.add(movie.imdbID);
                    allMovies.push(movie);
                  }
                }
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(`Failed to fetch page ${page}:`, error);
              }
              // Continue with next page instead of failing completely
            }
          }
        }
      }
    }

    // Use the fetched movies or do a single query
    let searchResponse: MovieSearchResponse;
    if (allMovies.length > 0) {
      // Create a mock response with all movies
      searchResponse = {
        Response: 'True',
        Search: allMovies,
        totalResults: allMovies.length.toString(),
      };
    } else {
      searchResponse = await searchMovies({
        ...searchParams,
        s: searchQuery,
      });
    }

    if (searchResponse.Response === 'False') {
      if (isRandomResults) {
        const fallbackIndex = Math.floor(Math.random() * POPULAR_QUERIES.length);
        const fallbackQuery = POPULAR_QUERIES[fallbackIndex];
        const fallbackResponse = await searchMovies({
          ...searchParams,
          s: fallbackQuery,
        });
        
        if (fallbackResponse.Response === 'True') {
          const movies = fallbackResponse.Search || [];
          
          // Remove duplicates by imdbID
          const seenIds = new Set<string>();
          const uniqueMovies = movies.filter(movie => {
            if (!movie.imdbID || seenIds.has(movie.imdbID)) {
              return false;
            }
            seenIds.add(movie.imdbID);
            return true;
          });
          
          const movieDetailsPromises = uniqueMovies.map(movie => 
            getMovieDetail(movie.imdbID)
          );
          const detailedMovies = await Promise.all(movieDetailsPromises);
          
          const movieDetails: Record<string, MovieDetail> = {};
          detailedMovies.forEach((detail, index) => {
            if (detail) {
              movieDetails[uniqueMovies[index].imdbID] = detail;
            }
          });
          
          return json<LoaderData>({
            movies: uniqueMovies,
            movieDetails,
            totalResults: parseInt(fallbackResponse.totalResults || '0', 10),
            currentPage: parseInt(searchParams.page || '1', 10),
            searchParams: { ...searchParams, s: undefined },
            isRandomResults: true,
          }, {
            headers: {
              'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            },
          });
        }
      }
      
      return json<LoaderData>({
        movies: [],
        movieDetails: {},
        totalResults: 0,
        currentPage: parseInt(searchParams.page || '1', 10),
        searchParams,
        error: searchResponse.Error || 'No results found',
        isRandomResults,
      }, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    let movies = searchResponse.Search || [];
    
    // Фильтруем по типу контента, если указан
    if (searchParams.type && searchParams.type !== 'episode') {
      movies = movies.filter(movie => {
        // Для HDRezka тип определяется по URL, для OMDb - по полю Type
        if (movie.imdbID.startsWith('hdrezka-')) {
          return movie.Type === searchParams.type;
        }
        return movie.Type === searchParams.type;
      });
    }
    
    // Remove duplicates by imdbID (if not already done)
    const seenIds = new Set<string>();
    const uniqueMovies = movies.filter(movie => {
      if (!movie.imdbID || seenIds.has(movie.imdbID)) {
        return false;
      }
      seenIds.add(movie.imdbID);
      return true;
    });
    
    let movieDetails: Record<string, MovieDetail> = {};
    let filteredMovies = uniqueMovies;

    // Оптимизация: загружаем детали только для первых 20 фильмов (текущая страница)
    // и только если нужна фильтрация по жанру
    const DETAILS_PER_PAGE = 20;
    const pageNum = parseInt(searchParams.page || '1', 10);
    const startIndex = (pageNum - 1) * DETAILS_PER_PAGE;
    const endIndex = startIndex + DETAILS_PER_PAGE;
    const moviesToLoadDetails = uniqueMovies.slice(startIndex, endIndex);

    // Всегда загружаем детали для отображения (независимо от наличия фильтра по жанру)
    const needsDetails = true;
    
    if (needsDetails && moviesToLoadDetails.length > 0) {
      // Ограничиваем параллелизм - максимум 5 запросов одновременно
      const BATCH_SIZE = 5;
      const batches: typeof moviesToLoadDetails[] = [];
      
      for (let i = 0; i < moviesToLoadDetails.length; i += BATCH_SIZE) {
        batches.push(moviesToLoadDetails.slice(i, i + BATCH_SIZE));
      }

      for (const batch of batches) {
        const batchPromises = batch.map(movie => 
          Promise.race([
            getMovieDetail(movie.imdbID),
            new Promise<MovieDetail | null>((resolve) => 
              setTimeout(() => resolve(null), 5000) // Таймаут 5 секунд
            )
          ])
        );
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach((detail, index) => {
          if (detail) {
            movieDetails[batch[index].imdbID] = detail;
            
            // Обновляем постер в результатах поиска, если он был 'N/A'
            const movie = batch[index];
            if (movie.Poster === 'N/A' && detail.Poster && detail.Poster !== 'N/A') {
              movie.Poster = detail.Poster;
            }
          }
        });
      }
    }

    // Фильтрация по жанру - только если жанр указан И есть поисковый запрос
    // Если жанр указан без поискового запроса, не применяем фильтрацию
    if (searchParams.genre && searchParams.s && uniqueMovies.length > 0) {
      const genreLower = searchParams.genre.toLowerCase();
      // Для фильтрации по жанру загружаем детали только для фильмов без деталей
      const moviesNeedingDetails = uniqueMovies.filter(movie => !movieDetails[movie.imdbID]);
      
      if (moviesNeedingDetails.length > 0) {
        // Загружаем детали для фильтруемых фильмов небольшими батчами
        const BATCH_SIZE = 3;
        for (let i = 0; i < Math.min(moviesNeedingDetails.length, 30); i += BATCH_SIZE) {
          const batch = moviesNeedingDetails.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map(movie => 
            Promise.race([
              getMovieDetail(movie.imdbID),
              new Promise<MovieDetail | null>((resolve) => 
                setTimeout(() => resolve(null), 3000)
              )
            ])
          );
          
          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach((detail, index) => {
            if (detail) {
              movieDetails[batch[index].imdbID] = detail;
            }
          });
        }
      }
      
      // Фильтруем только фильмы с загруженными деталями, которые содержат указанный жанр
      filteredMovies = uniqueMovies.filter(movie => {
        const detail = movieDetails[movie.imdbID];
        // Если детали не загружены, не исключаем фильм (показываем его)
        if (!detail) {
          return true;
        }
        // Если детали загружены, проверяем жанр
        return detail.Genre && detail.Genre.toLowerCase().includes(genreLower);
      });
    }

    // Filter by year range if specified
    if ((searchParams.yearFrom || searchParams.yearTo) && filteredMovies.length > 0) {
      const filterYearFrom = searchParams.yearFrom ? parseInt(searchParams.yearFrom, 10) : null;
      const filterYearTo = searchParams.yearTo ? parseInt(searchParams.yearTo, 10) : null;
      
      // Validate range: if both are set, filterYearFrom should be <= filterYearTo
      if (filterYearFrom === null || filterYearTo === null || filterYearFrom <= filterYearTo) {
        filteredMovies = filteredMovies.filter(movie => {
          // Extract year from movie.Year (can be "2000" or "2000–2001" or "2000–")
          const yearStr = movie.Year || '';
          const yearMatch = yearStr.match(/^(\d{4})/);
          if (!yearMatch) return false;
          
          const movieYear = parseInt(yearMatch[1], 10);
          if (isNaN(movieYear)) return false;
          
          if (filterYearFrom !== null && movieYear < filterYearFrom) {
            return false;
          }
          if (filterYearTo !== null && movieYear > filterYearTo) {
            return false;
          }
          return true;
        });
      }
    }

    // Calculate total results after filtering
    let finalTotalResults = filteredMovies.length;
    if (hasYearRange && allMovies.length > 0) {
      // If we fetched all pages, use the filtered count
      finalTotalResults = filteredMovies.length;
    } else {
      // Otherwise use API total results
      finalTotalResults = parseInt(searchResponse.totalResults || '0', 10);
    }

    // For year range, return all movies (client-side pagination will handle it)
    // For regular search, use API pagination
    const currentPage = parseInt(searchParams.page || '1', 10);
    
    // If year range is specified, return all movies (client will paginate)
    // Otherwise, return filtered movies with API total results
    const paginatedTotalResults = (hasYearRange && allMovies.length > 0) 
      ? filteredMovies.length 
      : finalTotalResults;

    return json<LoaderData>({
      movies: filteredMovies,
      movieDetails,
      totalResults: paginatedTotalResults,
      currentPage: currentPage,
      searchParams: isRandomResults ? { ...searchParams, s: undefined } : searchParams,
      isRandomResults,
    }, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Search error:', error);
    }
    let errorMessage = 'Failed to search movies. Please try again.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Provide more user-friendly messages
      if (error.message.includes('No API providers available')) {
        errorMessage = 'No API providers configured. Please set OMDB_API_KEY in your environment variables.';
      } else if (error.message.includes('API key')) {
        errorMessage = error.message;
      }
    }
    
    return json<LoaderData>({
      movies: [],
      movieDetails: {},
      totalResults: 0,
      currentPage: parseInt(searchParams.page || '1', 10),
      searchParams,
      error: errorMessage,
    }, {
      status: 200, // Return 200 to show error message in UI instead of 500
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  const handleFormSubmit = () => {
    setIsLoading(true);
  };

  // Remove duplicates by imdbID
  // Показываем все фильмы, даже без постеров (постеры могут загружаться позже)
  const seenIds = new Set<string>();
  let validMovies = data.movies.filter(
    (movie): movie is MovieSearchItem => {
      if (!movie.imdbID || seenIds.has(movie.imdbID)) {
        return false;
      }
      // Показываем все фильмы, независимо от наличия постера
      // Постер может быть 'N/A' или отсутствовать, но фильм все равно должен отображаться
      seenIds.add(movie.imdbID);
      return true;
    }
  );
  
  // Логируем для отладки (уже обернуто в проверку NODE_ENV)

  // Apply sorting before pagination
  const sortParam = searchParams.get('sort') || 'default';
  if (sortParam !== 'default') {
    validMovies = [...validMovies].sort((a, b) => {
      const detailA = data.movieDetails[a.imdbID];
      const detailB = data.movieDetails[b.imdbID];

      switch (sortParam) {
        case 'rating-desc': {
          const ratingA = detailA?.imdbRating ? parseFloat(detailA.imdbRating) : 0;
          const ratingB = detailB?.imdbRating ? parseFloat(detailB.imdbRating) : 0;
          return ratingB - ratingA;
        }
        case 'rating-asc': {
          const ratingA = detailA?.imdbRating ? parseFloat(detailA.imdbRating) : 0;
          const ratingB = detailB?.imdbRating ? parseFloat(detailB.imdbRating) : 0;
          return ratingA - ratingB;
        }
        case 'year-desc': {
          const yearA = parseInt(a.Year) || 0;
          const yearB = parseInt(b.Year) || 0;
          return yearB - yearA;
        }
        case 'year-asc': {
          const yearA = parseInt(a.Year) || 0;
          const yearB = parseInt(b.Year) || 0;
          return yearA - yearB;
        }
        case 'title-asc': {
          return a.Title.localeCompare(b.Title);
        }
        case 'title-desc': {
          return b.Title.localeCompare(a.Title);
        }
        default:
          return 0;
      }
    });
  }

  // Client-side pagination for year range
  const hasYearRange = data.searchParams.yearFrom || data.searchParams.yearTo;
  const currentPage = parseInt(data.searchParams.page || '1', 10);
  
  let displayedMovies = validMovies;
  let displayPagination = false;
  
  if (hasYearRange && validMovies.length > MOVIES_PER_PAGE) {
    // Apply client-side pagination
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    displayedMovies = validMovies.slice(startIndex, endIndex);
    displayPagination = validMovies.length > MOVIES_PER_PAGE;
  } else if (!hasYearRange) {
    // For regular search, use API pagination
    displayPagination = data.totalResults > 10 && !data.isRandomResults;
  }
  
  // Логируем для отладки (уже обернуто в проверку NODE_ENV)

  return (
    <div className="min-h-screen w-full bg-light-bg-primary dark:bg-dark-bg-primary text-gray-900 dark:text-dark-text-primary transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold">{t('app.title')}</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary">{t('app.subtitle')}</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <SearchBar defaultValues={data.searchParams} onSubmit={handleFormSubmit} isLoading={isLoading} />
        <main className="mt-8" aria-live="polite">
          {data.error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/40 rounded-full">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">{t('results.error')}</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">{data.error}</p>
                <Form method="get" className="inline"><button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">{t('results.tryAgain')}</button></Form>
              </div>
            </div>
          ) : validMovies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-dark-text-tertiary">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" /></svg>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">{t('results.noResults')}</h3>
                <p>{t('results.tryChanging')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  {data.isRandomResults ? (
                    <p className="text-gray-600 dark:text-dark-text-secondary">{t('results.showingPopular')}</p>
                  ) : (
                    <p className="text-gray-600 dark:text-dark-text-secondary">
                      {t('results.found')} <span className="font-semibold text-blue-600 dark:text-blue-400">{validMovies.length}</span> {t('results.results')}
                      {data.searchParams.s && (
                        <span> {t('results.for')} "<span className="font-semibold text-purple-600 dark:text-purple-400">{data.searchParams.s}</span>"</span>
                      )}
                      {validMovies.length !== data.movies.length && (
                        <span className="text-gray-400 dark:text-dark-text-tertiary text-sm ml-2">
                          ({data.movies.length - validMovies.length} {t('results.hidden')})
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <SortFilter />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {displayedMovies.map((movie, index) => (
                  <div 
                    key={`${movie.imdbID}-${index}`} 
                    className="animate-fade-in w-full" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MovieCard movie={movie} detail={data.movieDetails[movie.imdbID]} />
                  </div>
                ))}
              </div>
              {displayPagination && (
                <Pagination 
                  currentPage={currentPage} 
                  totalResults={hasYearRange ? validMovies.length : data.totalResults} 
                  searchParams={data.searchParams} 
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
