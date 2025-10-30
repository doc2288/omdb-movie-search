import { useState } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  const poster = movie.Poster && movie.Poster !== 'N/A' && !imageError ? movie.Poster : null;

  return (
    <div className="bg-white dark:bg-dark-bg-card rounded-xl shadow-card-light dark:shadow-card-dark overflow-hidden hover:shadow-lg dark:hover:shadow-dark-lg transition-all duration-300 border border-gray-200 dark:border-dark-border group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-72 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center p-4">
              <svg className="mx-auto h-16 w-16 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {movie.Title}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-current border-opacity-20">
                  {movie.Type === 'movie' ? '🎬' : movie.Type === 'series' ? '📺' : '🎭'} {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                </span>
                <div className="flex items-center text-gray-600 dark:text-dark-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">{movie.Year}</span>
                </div>
              </div>
            </div>
          </div>

          {detail && (
            <div className="space-y-4 border-t border-gray-200 dark:border-dark-border pt-4">
              {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                <div className="flex items-center bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg">
                  <span className="text-xl mr-2">⭐</span>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary">IMDb Rating</div>
                    <div className="font-bold text-lg text-green-600 dark:text-green-400">{detail.imdbRating}<span className="text-sm font-normal">/10</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {detail && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
              >
                {showDetails ? 'Hide Details' : 'Show More Details'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
