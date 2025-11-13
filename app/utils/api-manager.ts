import type { MovieSearchResponse, MovieDetail, SearchParams } from '~/types/movie-api';
import { searchMovies as searchMoviesOMDB, getMovieDetail as getMovieDetailOMDB, isOMDBAvailable } from '~/utils/omdb';
import { searchMoviesHDRezka, getMovieDetailHDRezka, isHDRezkaAvailable } from '~/utils/hdrezka';

class ApiManager {
  private useHDRezka: boolean = false;

  constructor() {
    if (!isOMDBAvailable() && !isHDRezkaAvailable()) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No API providers configured. Please set OMDB_API_KEY or use HDRezka.');
      }
    }
    
    // Используем HDRezka как основной источник, если OMDb недоступен
    this.useHDRezka = !isOMDBAvailable() && isHDRezkaAvailable();
    
    if (this.useHDRezka && process.env.NODE_ENV === 'development') {
      console.log('Using HDRezka as primary API provider');
    }
  }

  async searchMovies(params: SearchParams): Promise<MovieSearchResponse> {
    // Приоритет: OMDb, затем HDRezka
    if (isOMDBAvailable() && !this.useHDRezka) {
      try {
        const result = await searchMoviesOMDB(params);
        // Если OMDb вернул ошибку "No results found", пробуем HDRezka
        if (result.Response === 'False' && isHDRezkaAvailable()) {
          if (process.env.NODE_ENV === 'development') {
            console.log('OMDB returned no results, trying HDRezka...');
          }
          const hdrezkaResult = await searchMoviesHDRezka(params);
          if (hdrezkaResult.Response === 'True') {
            return hdrezkaResult;
          }
        }
        return result;
      } catch (error) {
        // Если OMDb не работает, пробуем HDRezka
        if (isHDRezkaAvailable()) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('OMDB failed, switching to HDRezka:', error);
          }
          return await searchMoviesHDRezka(params);
        }
        throw error;
      }
    }

    if (isHDRezkaAvailable()) {
      return await searchMoviesHDRezka(params);
    }

    throw new Error('No API providers available');
  }

  async getMovieDetail(imdbID: string): Promise<MovieDetail | null> {
    // Если ID начинается с hdrezka-, используем HDRezka
    if (imdbID.startsWith('hdrezka-')) {
      return await getMovieDetailHDRezka(imdbID);
    }

    // Иначе пробуем OMDb
    if (isOMDBAvailable() && !this.useHDRezka) {
      try {
        const result = await getMovieDetailOMDB(imdbID);
        if (result) {
          return result;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('OMDB detail failed:', error);
        }
      }
    }

    return null;
  }

  // Check if any providers are configured
  hasProviders(): boolean {
    return isOMDBAvailable() || isHDRezkaAvailable();
  }
}

// Singleton instance
let apiManagerInstance: ApiManager | null = null;

export const getApiManager = (): ApiManager => {
  if (!apiManagerInstance) {
    apiManagerInstance = new ApiManager();
  }
  return apiManagerInstance;
};

// Export convenience functions
export const searchMovies = (params: SearchParams): Promise<MovieSearchResponse> => {
  return getApiManager().searchMovies(params);
};

export const getMovieDetail = (imdbID: string): Promise<MovieDetail | null> => {
  return getApiManager().getMovieDetail(imdbID);
};

