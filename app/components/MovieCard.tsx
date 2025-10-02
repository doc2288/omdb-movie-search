import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fetcher = useFetcher();

  const handleExpandClick = () => {
    if (!detail && !isExpanded) {
      // Fetch movie details if not already available
      fetcher.load(`/api/movie/${movie.imdbID}`);
    }
    setIsExpanded(!isExpanded);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getPosterUrl = (posterUrl: string) => {
    if (posterUrl === 'N/A' || imageError) {
      return null;
    }
    return posterUrl;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'series':
        return '📺';
      case 'episode':
        return '📹';
      default:
        return '🎭';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-100 text-blue-800';
      case 'series':
        return 'bg-green-100 text-green-800';
      case 'episode':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Poster */}
        <div className="md:w-48 h-64 md:h-auto flex-shrink-0 bg-gray-200 flex items-center justify-center">
          {getPosterUrl(movie.Poster) ? (
            <img
              src={getPosterUrl(movie.Poster)!}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {movie.Title}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(movie.Type)}`}>
                  {getTypeIcon(movie.Type)} {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                </span>
                <span className="text-gray-600 font-medium">{movie.Year}</span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">IMDb ID:</span>
              <span className="ml-2 font-mono">{movie.imdbID}</span>
            </div>
          </div>

          {/* Detailed Info (if available) */}
          {detail && (
            <div className="space-y-3 border-t pt-4 mt-4">
              {detail.Genre && detail.Genre !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Genres:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detail.Genre.split(', ').map((genre) => (
                      <span
                        key={genre}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">IMDb Rating:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold text-gray-900">{detail.imdbRating}</span>
                    <span className="text-gray-500 text-sm ml-1">/10</span>
                  </div>
                </div>
              )}
              
              {detail.Runtime && detail.Runtime !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Runtime:</span>
                  <span className="ml-2 text-sm text-gray-600">{detail.Runtime}</span>
                </div>
              )}
              
              {detail.Director && detail.Director !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Director:</span>
                  <span className="ml-2 text-sm text-gray-600">{detail.Director}</span>
                </div>
              )}
              
              {detail.Plot && detail.Plot !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Plot:</span>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{detail.Plot}</p>
                </div>
              )}
            </div>
          )}

          {/* Expand/Collapse Button */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleExpandClick}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              disabled={fetcher.state === 'loading'}
            >
              {fetcher.state === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading details...
                </>
              ) : (
                <>
                  {isExpanded ? 'Show Less' : 'Show More Details'}
                  <svg
                    className={`ml-1 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}