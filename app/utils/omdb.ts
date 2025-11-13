import type { OMDBSearchResponse, OMDBMovieDetail, OMDBSeriesSeason } from '~/types/omdb';
import type { SearchParams, MovieSearchResponse, MovieDetail } from '~/types/movie-api';
import { getCachedMovieDetail, setCachedMovieDetail, retryWithBackoff } from '~/utils/cache';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;

export const isOMDBAvailable = (): boolean => {
  return !!API_KEY;
};

export const searchMovies = async (params: SearchParams): Promise<MovieSearchResponse> => {
  if (!API_KEY) {
    throw new Error('OMDB_API_KEY is not configured');
  }

  const searchQuery = params.s?.trim() || 'movie';
  const page = params.page?.trim() || '1';
  
  // Validate page number
  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Invalid page number');
  }

  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    s: searchQuery,
    page: page.toString(),
  });

  if (params.type && ['movie', 'series', 'episode'].includes(params.type)) {
    searchParams.append('type', params.type);
  }

  if (params.y) {
    const year = params.y.trim();
    // Basic year validation (between 1888 and current year + 1)
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (!isNaN(yearNum) && yearNum >= 1888 && yearNum <= currentYear + 1) {
      searchParams.append('y', year);
    }
  }

  const url = `${OMDB_BASE_URL}?${searchParams.toString()}`;

  return retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        // Provide more informative error messages
        if (response.status === 401) {
          throw new Error('API key is invalid or expired. Please check your OMDb API key.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data: any = await response.json();
      
      // Validate response structure
      if (!data || typeof data.Response === 'undefined') {
        throw new Error('Invalid response from OMDb API');
      }
      
      // Check for API key errors in the response
      if (data.Response === 'False' && data.Error) {
        const errorMessage = data.Error.toLowerCase();
        if (
          errorMessage.includes('invalid') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('api key') ||
          errorMessage.includes('request limit')
        ) {
          throw new Error('API key is invalid or expired. Please check your OMDb API key.');
        }
      }
      
      // Return in unified format (OMDB format is already compatible)
      return {
        Response: data.Response,
        Search: data.Search,
        totalResults: data.totalResults,
        Error: data.Error,
      } as MovieSearchResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  });
};

export const getMovieDetail = async (imdbID: string): Promise<MovieDetail | null> => {
  if (!API_KEY) {
    return null;
  }

  if (!imdbID || typeof imdbID !== 'string' || imdbID.trim() === '') {
    console.warn('Invalid imdbID provided:', imdbID);
    return null;
  }

  const cached = getCachedMovieDetail(imdbID);
  if (cached) {
    return cached;
  }

  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID.trim(),
    plot: 'short',
  });

  const url = `${OMDB_BASE_URL}?${searchParams.toString()}`;

  try {
    const data = await retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          // Provide more informative error messages
          if (response.status === 401) {
            throw new Error('API key is invalid or expired. Please check your OMDb API key.');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const result: any = await response.json();
        
        if (result.Response === 'False') {
          console.warn(`OMDb API error for ${imdbID}:`, result.Error);
          return null;
        }
        
        // Return in unified format (OMDB format is already compatible)
        return result as MovieDetail;
      } finally {
        clearTimeout(timeoutId);
      }
    });

    if (data && data.Response === 'True') {
      setCachedMovieDetail(imdbID, data);
      return data;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch movie detail for ${imdbID}:`, error);
    return null;
  }
};

export const getSeriesSeason = async (imdbID: string, season: number): Promise<OMDBSeriesSeason | null> => {
  if (!API_KEY) {
    return null;
  }

  if (!imdbID || typeof imdbID !== 'string' || imdbID.trim() === '') {
    console.warn('Invalid imdbID provided:', imdbID);
    return null;
  }

  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID.trim(),
    Season: season.toString(),
  });

  const url = `${OMDB_BASE_URL}?${searchParams.toString()}`;

  try {
    const data = await retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          // Provide more informative error messages
          if (response.status === 401) {
            throw new Error('API key is invalid or expired. Please check your OMDb API key.');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const result: OMDBSeriesSeason = await response.json();
        
        if (result.Response === 'False') {
          console.warn(`OMDb API error for season ${season} of ${imdbID}:`, result.Error);
          return null;
        }
        
        return result;
      } finally {
        clearTimeout(timeoutId);
      }
    });

    return data;
  } catch (error) {
    console.error(`Failed to fetch season ${season} for ${imdbID}:`, error);
    return null;
  }
};

export const filterMoviesByGenre = async (
  movies: Array<{ imdbID: string }>,
  targetGenre: string
): Promise<Array<{ imdbID: string; detail: OMDBMovieDetail }>> => {
  const results = await Promise.allSettled(
    movies.map(async (movie) => {
      const detail = await getMovieDetail(movie.imdbID);
      return { imdbID: movie.imdbID, detail };
    })
  );

  return results
    .filter((result): result is PromiseFulfilledResult<{ imdbID: string; detail: OMDBMovieDetail }> => 
      result.status === 'fulfilled' && 
      result.value.detail !== null &&
      result.value.detail.Genre.toLowerCase().includes(targetGenre.toLowerCase())
    )
    .map(result => ({ 
      imdbID: result.value.imdbID, 
      detail: result.value.detail! 
    }));
};