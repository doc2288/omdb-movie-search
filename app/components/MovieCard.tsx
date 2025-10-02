import { useState } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

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
              <span className="text-xs">Нет изображения</span>
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
            
            {/* IMDb Link */}
            <div className="flex items-center">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-600 hover:text-yellow-800 transition-colors text-sm font-medium"
              >
                <span className="mr-1">🎭</span>
                Смотреть на IMDb
                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Basic Movie Details (always visible if available) */}
          {detail && (
            <div className="space-y-3 border-t pt-4 mt-4">
              {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">IMDb Рейтинг:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold text-gray-900">{detail.imdbRating}</span>
                    <span className="text-gray-500 text-sm ml-1">/10</span>
                  </div>
                </div>
              )}
              
              {detail.Genre && detail.Genre !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Жанры:</span>
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
              
              {detail.Runtime && detail.Runtime !== 'N/A' && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Длительность:</span>
                  <span className="ml-2 text-sm text-gray-600">{detail.Runtime}</span>
                </div>
              )}
              
              {/* Expandable Details */}
              {showDetails && (
                <div className="space-y-3 pt-3 border-t">
                  {detail.Director && detail.Director !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Режиссер:</span>
                      <span className="ml-2 text-sm text-gray-600">{detail.Director}</span>
                    </div>
                  )}
                  
                  {detail.Actors && detail.Actors !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Актеры:</span>
                      <span className="ml-2 text-sm text-gray-600">{detail.Actors}</span>
                    </div>
                  )}
                  
                  {detail.Plot && detail.Plot !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Описание:</span>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{detail.Plot}</p>
                    </div>
                  )}
                  
                  {detail.Released && detail.Released !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Дата выхода:</span>
                      <span className="ml-2 text-sm text-gray-600">{detail.Released}</span>
                    </div>
                  )}
                  
                  {detail.Country && detail.Country !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Страна:</span>
                      <span className="ml-2 text-sm text-gray-600">{detail.Country}</span>
                    </div>
                  )}
                  
                  {detail.Language && detail.Language !== 'N/A' && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Язык:</span>
                      <span className="ml-2 text-sm text-gray-600">{detail.Language}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Show/Hide Details Button */}
          {detail && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showDetails ? 'Скрыть детали' : 'Показать больше деталей'}
                <svg
                  className={`ml-1 h-4 w-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}