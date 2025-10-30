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

  const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;
  if (!hasValidPoster) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'episode': return '📹';
      default: return '🎭';
    }
  };

  const getRatingColor = (rating: string) => {
    const num = parseFloat(rating);
    if (num >= 8.0) return 'text-green-400';
    if (num >= 7.0) return 'text-yellow-400';
    if (num >= 6.0) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="group relative">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-out group-hover:scale-105 group-hover:z-50">
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* полупрозрачный бокс поверх постера */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 card-overlay" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="overlay-title text-lg mb-2 line-clamp-2">{movie.Title}</h3>
          <div className="flex items-center gap-2 mb-2 overlay-text">
            <span className="text-xs bg-white/10 px-2 py-1 rounded">
              {getTypeIcon(movie.Type)} {movie.Type.toUpperCase()}
            </span>
            <span className="text-sm text-gray-300">{movie.Year}</span>
          </div>
          {detail && detail.imdbRating && detail.imdbRating !== 'N/A' && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-400">★</span>
              <span className={`font-semibold ${getRatingColor(detail.imdbRating)}`}>{detail.imdbRating}</span>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
              className="flex-1 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              ▶ Подробнее
            </button>
            <a
              href={`https://www.imdb.com/title/${movie.imdbID}/`}
              target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="bg-gray-600/80 hover:bg-gray-500/80 text-white p-2 rounded transition-colors" title="Открыть в IMDb"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10zM5.5 7.5h1.5v9H5.5v-9zm2.5 0h1.5l1 3.5L11.5 7.5H13v9h-1.5V9.75L10.5 13h-1L8.5 9.75V16.5H7v-9zm6 0h1.5c1.5 0 2.5 1 2.5 2.5v4c0 1.5-1 2.5-2.5 2.5H13.5v-9zm1.5 1.5v6h.5c.5 0 1-.5 1-1v-4c0-.5-.5-1-1-1h-.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* панель подробностей теперь темная, без белого фона */}
      {showDetails && (
        <div className="absolute top-full left-0 right-0 mt-2 card-panel text-white p-4 rounded-lg z-50 min-w-[300px] animate-fade-in">
          <div className="space-y-3">
            <div>
              <h4 className="overlay-title text-lg mb-1">{movie.Title}</h4>
              <p className="text-gray-300 text-sm">{movie.Year}</p>
            </div>
            {detail && (
              <>
                {detail.Plot && detail.Plot !== 'N/A' && (
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">{detail.Plot}</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs overlay-text">
                  {detail.Runtime && detail.Runtime !== 'N/A' && (
                    <div><span className="text-gray-400">Длительность:</span><p className="text-white font-medium">{detail.Runtime}</p></div>
                  )}
                  {detail.Genre && detail.Genre !== 'N/A' && (
                    <div><span className="text-gray-400">Жанр:</span><p className="text-white font-medium">{detail.Genre.split(', ').slice(0, 2).join(', ')}</p></div>
                  )}
                  {detail.Director && detail.Director !== 'N/A' && (
                    <div><span className="text-gray-400">Режиссёр:</span><p className="text-white font-medium">{detail.Director}</p></div>
                  )}
                  {detail.Released && detail.Released !== 'N/A' && (
                    <div><span className="text-gray-400">Выпуск:</span><p className="text-white font-medium">{detail.Released}</p></div>
                  )}
                </div>
                {detail.Actors && detail.Actors !== 'N/A' && (
                  <div>
                    <span className="text-gray-400 text-xs">В ролях:</span>
                    <p className="text-white text-sm font-medium mt-1">{detail.Actors.split(', ').slice(0, 3).join(', ')}</p>
                  </div>
                )}
              </>
            )}
            <button onClick={() => setShowDetails(false)} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
