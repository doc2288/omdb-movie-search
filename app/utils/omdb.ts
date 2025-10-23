import type { OMDBSearchResponse, OMDBMovieDetail, SearchParams } from '~/types/omdb';
import { getCachedMovieDetail, setCachedMovieDetail, retryWithBackoff } from '~/utils/cache';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;

if (!API_KEY) {
  throw new Error('OMDB_API_KEY is required');
}

export const searchMovies = async (params: SearchParams): Promise<OMDBSearchResponse> => {
  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    s: params.s || 'movie',
    page: params.page || '1',
  });

  if (params.type) {
    searchParams.append('type', params.type);
  }

  if (params.y) {
    searchParams.append('y', params.y);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OMDBSearchResponse = await response.json();
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  });
};

export const getMovieDetail = async (imdbID: string): Promise<OMDBMovieDetail | null> => {
  const cached = getCachedMovieDetail(imdbID);
  if (cached) {
    return cached;
  }

  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID,
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: OMDBMovieDetail = await response.json();
        return result;
      } finally {
        clearTimeout(timeoutId);
      }
    });

    if (data.Response === 'True') {
      setCachedMovieDetail(imdbID, data);
      return data;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch movie detail for ${imdbID}:`, error);
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