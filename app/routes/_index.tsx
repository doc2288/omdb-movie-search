import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { searchMovies, filterMoviesByGenre, getMovieDetail } from '~/utils/omdb';
import type { OMDBSearchItem, OMDBMovieDetail, SearchParams } from '~/types/omdb';
import SearchBar from '~/components/SearchBar';
import MovieCard from '~/components/MovieCard';
import Pagination from '~/components/Pagination';
import ThemeToggle from '~/components/ThemeToggle';

export const meta: MetaFunction = () => {
  return [
    { title: 'OMDb Movie Search - Find Movies, Series and Episodes' },
    { name: 'description', content: 'Search and discover movies, series and episodes using the OMDb database with advanced filtering options.' },
  ];
};

interface LoaderData {
  movies: OMDBSearchItem[];
  movieDetails: Record<string, OMDBMovieDetail>;
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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams: SearchParams = {
    s: url.searchParams.get('s') || undefined,
    type: url.searchParams.get('type') as 'movie' | 'series' | 'episode' | undefined,
    y: url.searchParams.get('y') || undefined,
    page: url.searchParams.get('page') || '1',
    genre: url.searchParams.get('genre') || undefined,
  };

  try {
    let searchQuery = searchParams.s;
    let isRandomResults = false;

    if (!searchQuery) {
      const randomIndex = Math.floor(Math.random() * POPULAR_QUERIES.length);
      searchQuery = POPULAR_QUERIES[randomIndex];
      isRandomResults = true;
    }

    const searchResponse = await searchMovies({
      ...searchParams,
      s: searchQuery,
    });

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
          
          const movieDetailsPromises = movies.map(movie => 
            getMovieDetail(movie.imdbID)
          );
          const detailedMovies = await Promise.all(movieDetailsPromises);
          
          const movieDetails: Record<string, OMDBMovieDetail> = {};
          detailedMovies.forEach((detail, index) => {
            if (detail) {
              movieDetails[movies[index].imdbID] = detail;
            }
          });
          
          return json<LoaderData>({
            movies,
            movieDetails,
            totalResults: parseInt(fallbackResponse.totalResults || '0'),
            currentPage: parseInt(searchParams.page || '1'),
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
        currentPage: parseInt(searchParams.page || '1'),
        searchParams,
        error: searchResponse.Error || 'No results found',
        isRandomResults,
      }, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    const movies = searchResponse.Search || [];
    let movieDetails: Record<string, OMDBMovieDetail> = {};
    let filteredMovies = movies;

    const movieDetailsPromises = movies.map(movie => 
      getMovieDetail(movie.imdbID)
    );
    const detailedMovies = await Promise.all(movieDetailsPromises);
    
    detailedMovies.forEach((detail, index) => {
      if (detail) {
        movieDetails[movies[index].imdbID] = detail;
      }
    });

    if (searchParams.genre && movies.length > 0) {
      filteredMovies = movies.filter(movie => {
        const detail = movieDetails[movie.imdbID];
        return detail && detail.Genre && 
               detail.Genre.toLowerCase().includes(searchParams.genre!.toLowerCase());
      });
    }

    return json<LoaderData>({
      movies: filteredMovies,
      movieDetails,
      totalResults: parseInt(searchResponse.totalResults || '0'),
      currentPage: parseInt(searchParams.page || '1'),
      searchParams: isRandomResults ? { ...searchParams, s: undefined } : searchParams,
      isRandomResults,
    }, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return json<LoaderData>({
      movies: [],
      movieDetails: {},
      totalResults: 0,
      currentPage: 1,
      searchParams,
      error: 'Failed to search movies. Please try again.',
    });
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  const handleFormSubmit = () => {
    setIsLoading(true);
  };

  const validMovies = data.movies.filter(movie => 
    movie.Poster && movie.Poster !== 'N/A'
  );

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">🎬 CineSearch</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary">Discover movies, series and episodes from the world's largest database</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center">
            <ThemeToggle />
          </div>
        </header>
        
        <SearchBar defaultValues={data.searchParams} onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        <main className="mt-8" aria-live="polite">
          {data.error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/40 rounded-full">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Search Error</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">{data.error}</p>
                <Form method="get" className="inline">
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">Try Again</button>
                </Form>
              </div>
            </div>
          ) : validMovies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-dark-text-tertiary">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">No Results Found</h3>
                <p>Try changing your search terms or filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                {data.isRandomResults ? (
                  <p className="text-gray-600 dark:text-dark-text-secondary">Showing popular movies. Use the search above to find specific movies.</p>
                ) : (
                  <p className="text-gray-600 dark:text-dark-text-secondary">Found <span className="font-semibold text-blue-600 dark:text-blue-400">{validMovies.length}</span> results with posters{data.searchParams.s && (<span> for "<span className="font-semibold text-purple-600 dark:text-purple-400">{data.searchParams.s}</span>"</span>)}{validMovies.length !== data.movies.length && (<span className="text-gray-400 dark:text-dark-text-tertiary text-sm ml-2">({data.movies.length - validMovies.length} hidden without posters)</span>)}</p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {validMovies.map((movie, index) => (
                  <div key={movie.imdbID} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <MovieCard movie={movie} detail={data.movieDetails[movie.imdbID]} />
                  </div>
                ))}
              </div>
              {!data.isRandomResults && data.totalResults > 10 && (
                <Pagination currentPage={data.currentPage} totalResults={data.totalResults} searchParams={data.searchParams} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
