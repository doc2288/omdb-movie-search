import { LRUCache } from 'lru-cache';
import type { MovieDetail } from '~/types/movie-api';

const movieDetailsCache = new LRUCache<string, MovieDetail>({
  max: 500,
  ttl: 10 * 60 * 1000,
});

export const getCachedMovieDetail = (imdbID: string): MovieDetail | undefined => {
  return movieDetailsCache.get(imdbID);
};

export const setCachedMovieDetail = (imdbID: string, detail: MovieDetail): void => {
  movieDetailsCache.set(imdbID, detail);
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries - 1) {
        break;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  if (lastError) {
    throw lastError;
  }
  
  throw new Error('Retry failed: unknown error');
};