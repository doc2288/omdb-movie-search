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
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadEpisodes() {
      if (movie.Type === 'series') {
        setIsLoadingEpisodes(true);
        try {
          const total = await getTotalEpisodes(movie.imdbID, detail?.totalSeasons);
          if (mounted) setEpisodesCount(total);
        } catch (error) {
          console.warn('Failed to load episodes count:', error);
        } finally {
          if (mounted) setIsLoadingEpisodes(false);
        }
      }
    }
    loadEpisodes();
    return () => { mounted = false; };
  }, [movie.imdbID, movie.Type, detail?.totalSeasons]);

  const handleImageError = () => {
    setImageError(true);
  };

  const openImdb = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openImdb(e);
    }
  };

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  const getPosterUrl = (posterUrl: string) => {
    return posterUrl === 'N/A' || imageError ? null : posterUrl;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'episode': return '📹';
      default: return '🎭';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'series':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'episode':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRatingColor = (rating: string) => {
    const n = parseFloat(rating);
    if (n >= 8) return 'text-green-600 dark:text-green-400';
    if (n >= 7) return 'text-yellow-600 dark:text-yellow-400';
    if (n >= 6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
        {/* Poster */}
        <div 
          className="md:w-48 h-72 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          onClick={openImdb}
          onKeyDown={handleKeyDown}
          role="button" 
          tabIndex={0}
          aria-label={`View ${movie.Title} on IMDb`}
        >
          {getPosterUrl(movie.Poster) ? (
            <div className="relative w-full h-full group">
              <img 
                src={getPosterUrl(movie.Poster)!} 
                alt={`${movie.Title} poster`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                onError={handleImageError} 
                loading="lazy" 
              />
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
          {/* Title and basic info */}
          <div className="mb-4">
            <button
              type="button"
              onClick={openImdb}
              className="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 -m-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label={`View ${movie.Title} on IMDb`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {movie.Title}
              </h3>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(movie.Type)}`}>
                {getTypeIcon(movie.Type)} {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
              </span>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">{movie.Year}</span>
              </div>
            </div>
          </div>

          {/* Basic movie info */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">ID:</span>
              <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{movie.imdbID}</span>
            </div>

            {movie.Type === 'series' && (
              <>
                {detail?.totalSeasons && detail.totalSeasons !== 'N/A' && (
                  <div className="inline-flex items-center text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                    Seasons: {detail.totalSeasons}
                  </div>
                )}
                {isLoadingEpisodes && (
                  <div className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                    <svg className="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </div>
                )}
                {episodesCount !== null && !isLoadingEpisodes && (
                  <div className="inline-flex items-center text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                    </svg>
                    Episodes: {episodesCount}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Movie Details */}
          {detail && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="text-xl mr-2">⭐</span>
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">IMDb Rating</div>
                      <div className={`font-bold text-lg ${getRatingColor(detail.imdbRating)}`}>
                        {detail.imdbRating}<span className="text-sm font-normal">/10</span>
                      </div>
                    </div>
                  </div>
                )}
                {detail.Runtime && detail.Runtime !== 'N/A' && (
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="text-xl mr-2">⏰</span>
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Runtime</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{detail.Runtime}</div>
                    </div>
                  </div>
                )}
              </div>

              {detail.Genre && detail.Genre !== 'N/A' && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span className="mr-1">🎭</span>Genres
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.Genre.split(', ').map((genre) => (
                      <span 
                        key={genre} 
                        className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {showDetails && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  {detail.Director && detail.Director !== 'N/A' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-1">
                        <span className="mr-1">🎬</span> Director
                      </div>
                      <div className="text-gray-900 dark:text-white font-medium">{detail.Director}</div>
                    </div>
                  )}
                  {detail.Actors && detail.Actors !== 'N/A' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-1">
                        <span className="mr-1">🎭</span> Cast
                      </div>
                      <div className="text-gray-900 dark:text-white">{detail.Actors}</div>
                    </div>
                  )}
                  {detail.Plot && detail.Plot !== 'N/A' && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-2">
                        <span className="mr-1">📖</span> Plot
                      </div>
                      <p className="text-gray-900 dark:text-white leading-relaxed">{detail.Plot}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Show Details Button */}
          {detail && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button 
                type="button" 
                onClick={toggleDetails}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={showDetails}
              >
                <span>{showDetails ? 'Hide Details' : 'Show More Details'}</span>
                <svg 
                  className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                    showDetails ? 'rotate-180' : ''
                  }`} 
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
    </article>
  );
}