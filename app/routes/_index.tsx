import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { searchMovies, filterMoviesByGenre } from '~/utils/omdb';
import type { OMDBSearchItem, OMDBMovieDetail, SearchParams } from '~/types/omdb';
import SearchBar from '~/components/SearchBar';
import MovieCard from '~/components/MovieCard';
import Pagination from '~/components/Pagination';

export const meta: MetaFunction = () => {
  return [
    { title: 'OMDb Movie Search - Find Movies, Series & Episodes' },
    { name: 'description', content: 'Search and discover movies, TV series, and episodes using the OMDb database with advanced filtering options.' },
  ];
};

interface LoaderData {
  movies: OMDBSearchItem[];
  movieDetails: Record<string, OMDBMovieDetail>;
  totalResults: number;
  currentPage: number;
  searchParams: SearchParams;
  error?: string;
}

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
    // If no search term, provide a default
    if (!searchParams.s) {
      searchParams.s = 'movie';
    }

    const searchResponse = await searchMovies(searchParams);

    if (searchResponse.Response === 'False') {
      return json<LoaderData>({
        movies: [],
        movieDetails: {},
        totalResults: 0,
        currentPage: parseInt(searchParams.page || '1'),
        searchParams,
        error: searchResponse.Error || 'No results found',
      }, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    const movies = searchResponse.Search || [];
    let movieDetails: Record<string, OMDBMovieDetail> = {};
    let filteredMovies = movies;

    // If genre filter is applied, fetch details and filter
    if (searchParams.genre && movies.length > 0) {
      const genreFilteredResults = await filterMoviesByGenre(movies, searchParams.genre);
      filteredMovies = genreFilteredResults.map(result => ({
        Title: result.detail.Title,
        Year: result.detail.Year,
        imdbID: result.detail.imdbID,
        Type: result.detail.Type as 'movie' | 'series' | 'episode',
        Poster: result.detail.Poster,
      }));
      
      // Store the details for display
      genreFilteredResults.forEach(result => {
        movieDetails[result.imdbID] = result.detail;
      });
    }

    return json<LoaderData>({
      movies: filteredMovies,
      movieDetails,
      totalResults: parseInt(searchResponse.totalResults || '0'),
      currentPage: parseInt(searchParams.page || '1'),
      searchParams,
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

  // Handle loading state during navigation
  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  const handleFormSubmit = () => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎬 Movie Search
          </h1>
          <p className="text-gray-600">
            Discover movies, TV series, and episodes from the OMDb database
          </p>
        </header>

        <SearchBar
          defaultValues={data.searchParams}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />

        <main className="mt-8" aria-live="polite">
          {data.error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Search Error</h3>
                <p className="text-red-600 mb-4">{data.error}</p>
                <Form method="get" className="inline">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </Form>
              </div>
            </div>
          ) : data.movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Found <span className="font-semibold">{data.totalResults.toLocaleString()}</span> results
                  {data.searchParams.s && (
                    <span> for "<span className="font-semibold">{data.searchParams.s}</span>"</span>
                  )}
                </p>
              </div>

              <div className="grid gap-6 md:gap-8 mb-8">
                {data.movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    detail={data.movieDetails[movie.imdbID]}
                  />
                ))}
              </div>

              {data.totalResults > 10 && (
                <Pagination
                  currentPage={data.currentPage}
                  totalResults={data.totalResults}
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