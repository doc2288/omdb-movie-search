// Unified types for different movie APIs
export interface MovieSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieSearchResponse {
  Search?: MovieSearchItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  totalSeasons?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export type ApiProvider = 'omdb' | 'hdrezka';

export interface ApiClient {
  name: ApiProvider;
  searchMovies(params: SearchParams): Promise<MovieSearchResponse>;
  getMovieDetail(imdbID: string): Promise<MovieDetail | null>;
  isAvailable(): boolean;
}

export interface SearchParams {
  s?: string;
  type?: 'movie' | 'series' | 'episode';
  y?: string;
  yearFrom?: string;
  yearTo?: string;
  page?: string;
  genre?: string;
  sort?: string;
}

