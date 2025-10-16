import { useEffect, useState } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';
import { getTotalEpisodes } from '~/utils/episodes';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [episodesCount, setEpisodesCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadEpisodes() {
      if (movie.Type === 'series') {
        const total = await getTotalEpisodes(movie.imdbID, detail?.totalSeasons);
        if (mounted) setEpisodesCount(total);
      }
    }
    loadEpisodes();
    return () => { mounted = false; };
  }, [movie.imdbID, movie.Type, detail?.totalSeasons]);

  const handleImageError = () => setImageError(true);

  const getPosterUrl = (posterUrl: string) => (posterUrl === 'N/A' || imageError ? null : posterUrl);

  const getTypeIcon = (type: string) => (type === 'movie' ? '🎬' : type === 'series' ? '📺' : type === 'episode' ? '📹' : '🎭');

  const getTypeColor = (type: string) => (
    type === 'movie'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      : type === 'series'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : type === 'episode'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  );

  const getRatingColor = (rating: string) => {
    const n = parseFloat(rating);
    if (n >= 8) return 'text-green-600 dark:text-green-400';
    if (n >= 7) return 'text-yellow-600 dark:text-yellow-400';
    if (n >= 6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // Если клик пришел из области, помеченной как no-imdb-click, игнорируем переход
    const target = e.target as HTMLElement;
    if (target && target.closest('[data-no-imdb-click="true"]')) return;
    window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank', 'noopener,noreferrer');
        }
      }}
      className="cursor-pointer bg-white dark:bg-dark-bg-card rounded-xl shadow-card-light dark:shadow-card-dark overflow-hidden hover:shadow-lg dark:hover:shadow-dark-lg transition-all duration-300 border border-gray-200 dark:border-dark-border group focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex flex-col md:flex-row">
        {/* Poster */}
        <div className="md:w-48 h-72 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
          {getPosterUrl(movie.Poster) ? (
            <div className="relative w-full h-full group">
              <img src={getPosterUrl(movie.Poster)!} alt={`${movie.Title} poster`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={handleImageError} loading="lazy" />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center p-4">
              <svg className="mx-auto h-16 w-16 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{movie.Title}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(movie.Type)} border border-current border-opacity-20`}>{getTypeIcon(movie.Type)} {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</span>
                <div className="flex items-center text-gray-600 dark:text-dark-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="font-semibold">{movie.Year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ID + Series meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-dark-text-tertiary">
              <span className="font-medium">ID:</span>
              <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{movie.imdbID}</span>
            </div>

            {movie.Type === 'series' && (
              <div className="flex items-center gap-2" data-no-imdb-click="true">
                {detail?.totalSeasons && detail.totalSeasons !== 'N/A' && (
                  <div className="inline-flex items-center text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                    Seasons: {detail.totalSeasons}
                  </div>
                )}
                {episodesCount !== null && (
                  <div className="inline-flex items-center text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
                    Episodes: {episodesCount}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Movie Details */}
          {detail && (
            <div className="space-y-4 border-t border-gray-200 dark:border-dark-border pt-4" data-no-imdb-click="true" onClickCapture={(e)=>e.stopPropagation()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                  <div className="flex items-center bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">⭐</span>
                      <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary">IMDb Rating</div>
                        <div className={`font-bold text-lg ${getRatingColor(detail.imdbRating)}`}>{detail.imdbRating}<span className="text-sm font-normal">/10</span></div>
                      </div>
                    </div>
                  </div>
                )}
                {detail.Runtime && detail.Runtime !== 'N/A' && (
                  <div className="flex items-center bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">⏰</span>
                      <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary">Runtime</div>
                        <div className="font-semibold text-gray-900 dark:text-dark-text-primary">{detail.Runtime}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {detail.Genre && detail.Genre !== 'N/A' && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary mb-2 flex items-center"><span className="mr-1">🎭</span>Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {detail.Genre.split(', ').map((genre) => (
                      <span key={genre} className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800/50">{genre}</span>
                    ))}
                  </div>
                </div>
              )}

              {showDetails && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-dark-border animate-slide-up">
                  {detail.Director && detail.Director !== 'N/A' && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary flex items-center mb-1"><span className="mr-1">🎬</span> Director</span>
                      <span className="text-gray-900 dark:text-dark-text-primary font-medium">{detail.Director}</span>
                    </div>
                  )}
                  {detail.Actors && detail.Actors !== 'N/A' && (
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-4 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary flex items-center mb-1"><span className="mr-1">🎭</span> Cast</span>
                      <span className="text-gray-900 dark:text-dark-text-primary">{detail.Actors}</span>
                    </div>
                  )}
                  {detail.Plot && detail.Plot !== 'N/A' && (
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900/20 p-4 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700 dark:text-dark-text-secondary flex items-center mb-2"><span className="mr-1">📖</span> Plot</span>
                      <p className="text-gray-900 dark:text-dark-text-primary leading-relaxed">{detail.Plot}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {detail.Released && detail.Released !== 'N/A' && (
                      <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg"><span className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary block mb-1">Released</span><span className="text-gray-900 dark:text-dark-text-primary font-medium">{detail.Released}</span></div>
                    )}
                    {detail.Country && detail.Country !== 'N/A' && (
                      <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg"><span className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary block mb-1">Country</span><span className="text-gray-900 dark:text-dark-text-primary font-medium">{detail.Country}</span></div>
                    )}
                    {detail.Language && detail.Language !== 'N/A' && (
                      <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg"><span className="text-xs font-medium text-gray-500 dark:text-dark-text-tertiary block mb-1">Language</span><span className="text-gray-900 dark:text-dark-text-primary font-medium">{detail.Language}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {detail && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border" data-no-imdb-click="true" onClickCapture={(e)=>e.stopPropagation()}>
              <button
                type="button"
                role="button"
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 group/btn"
              >
                {showDetails ? 'Hide Details' : 'Show More Details'}
                <svg className={`ml-2 h-4 w-4 transform transition-all duration-300 group-hover/btn:translate-x-0.5 ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
