import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import type { MovieSearchItem, MovieDetail } from '~/types/movie-api';
import type { OMDBSeriesSeason } from '~/types/omdb';
import { useLanguage } from '~/contexts/LanguageContext';
import VideoPlayer from '~/components/VideoPlayer';

interface MovieCardProps {
  movie: MovieSearchItem;
  detail?: MovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const { t, language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const seasonFetcher = useFetcher<OMDBSeriesSeason>();
  const streamFetcher = useFetcher<{ stream: Record<string, string> | null; error?: string }>();

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const hasValidPoster = useMemo(
    () => movie.Poster && movie.Poster !== 'N/A' && !imageError,
    [movie.Poster, imageError]
  );

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'episode': return '📹';
      default: return '🎭';
    }
  }, []);

  const getRatingColor = useCallback((rating: string) => {
    const num = parseFloat(rating);
    if (num >= 8.0) return 'from-green-500 to-emerald-600';
    if (num >= 7.0) return 'from-yellow-500 to-amber-600';
    if (num >= 6.0) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  }, []);

  const getRatingTextColor = useCallback((rating: string) => {
    const num = parseFloat(rating);
    if (num >= 8.0) return 'text-green-400';
    if (num >= 7.0) return 'text-yellow-400';
    if (num >= 6.0) return 'text-orange-400';
    return 'text-red-400';
  }, []);

  const handleToggleDetails = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setShowDetails(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowDetails(prev => !prev);
    }
  }, []);

  // Load first season info for series
  useEffect(() => {
    if (showDetails && movie.Type === 'series' && detail?.totalSeasons && seasonFetcher.state === 'idle' && !seasonFetcher.data) {
      const totalSeasons = parseInt(detail.totalSeasons, 10);
      if (!isNaN(totalSeasons) && totalSeasons > 0) {
        seasonFetcher.load(`/api/season/${movie.imdbID}/1`);
      }
    }
  }, [showDetails, movie.Type, movie.imdbID, detail?.totalSeasons, seasonFetcher]);

  useEffect(() => {
    if (
      showDetails &&
      movie.imdbID.startsWith('hdrezka-') &&
      streamFetcher.state === 'idle' &&
      typeof streamFetcher.data === 'undefined'
    ) {
      streamFetcher.load(`/api/stream/${encodeURIComponent(movie.imdbID)}`);
    }
  }, [showDetails, movie.imdbID, streamFetcher]);

  const rating = detail?.imdbRating && detail.imdbRating !== 'N/A' ? parseFloat(detail.imdbRating) : null;
  const streamData = streamFetcher.data?.stream ?? null;
  const streamError = streamFetcher.data?.error;
  const streamUrl = streamData
    ? streamData['1080p'] || streamData['720p'] || Object.values(streamData)[0]
    : undefined;

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div 
        className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:z-50 shadow-lg group-hover:shadow-2xl"
        role="button" 
        tabIndex={0} 
        aria-label={`View details for ${movie.Title}`} 
        onKeyDown={handleKeyDown}
      >
        {/* Poster Image or Placeholder */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800">
          {hasValidPoster ? (
            <img 
              src={movie.Poster} 
              alt={`${movie.Title} (${movie.Year}) poster`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              onError={handleImageError} 
              loading="lazy" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="text-4xl mb-2">{getTypeIcon(movie.Type)}</div>
              <div className="text-white dark:text-gray-200 font-semibold text-sm line-clamp-2">{movie.Title}</div>
              <div className="text-white/70 dark:text-gray-400 text-xs mt-1">{movie.Year}</div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top Badge - Rating or Type */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {rating ? (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md bg-gradient-to-r ${getRatingColor(detail!.imdbRating)} shadow-lg`}>
                <span className="text-white text-xs font-bold">★</span>
                <span className="text-white text-xs font-bold">{detail!.imdbRating}</span>
              </div>
            ) : (
              <div className="px-2.5 py-1.5 rounded-full backdrop-blur-md bg-black/40 dark:bg-white/10">
                <span className="text-white dark:text-gray-200 text-xs font-semibold">
                  {getTypeIcon(movie.Type)} {movie.Type.toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Year Badge */}
            <div className="px-2.5 py-1.5 rounded-full backdrop-blur-md bg-black/40 dark:bg-white/10">
              <span className="text-white dark:text-gray-200 text-xs font-semibold">{movie.Year}</span>
            </div>
          </div>

          {/* Bottom Info Panel */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
                {movie.Title}
              </h3>
              
              {/* Metadata */}
              <div className="flex items-center gap-2 flex-wrap">
                {rating && (
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-semibold ${getRatingTextColor(detail!.imdbRating)}`}>
                      ⭐ {detail!.imdbRating}
                    </span>
                  </div>
                )}
                <span className="text-white/80 text-xs">•</span>
                <span className="text-white/90 text-xs font-medium">
                  {getTypeIcon(movie.Type)} {movie.Type}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={handleToggleDetails}
                  className="flex-1 bg-white dark:bg-gray-100 text-gray-900 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-200 text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
                  aria-label={`Show details for ${movie.Title}`}
                >
                  {t('movie.details')}
                </button>
                {movie.imdbID.startsWith('hdrezka-') && detail?.Website ? (
                  <a 
                    href={detail.Website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
                    title="Открыть на HDRezka"
                    aria-label="Open on HDRezka"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </a>
                ) : (
                  <a 
                    href={`https://www.imdb.com/title/${movie.imdbID}/`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white p-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
                    title="Открыть в IMDb"
                    aria-label="Open on IMDb"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10zM5.5 7.5h1.5v9H5.5v-9zm2.5 0h1.5l1 3.5L11.5 7.5H13v9h-1.5V9.75L10.5 13h-1L8.5 9.75V16.5H7v-9zm6 0h1.5c1.5 0 2.5 1 2.5 2.5v4c0 1.5-1 2.5-2.5 2.5H13.5v-9zm1.5 1.5v6h.5c.5 0 1-.5 1-1v-4c0-.5-.5-1-1-1h-.5z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in" 
            onClick={() => setShowDetails(false)} 
            aria-hidden="true" 
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="card-detail-panel bg-white dark:bg-dark-bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in border border-gray-200/50 dark:border-dark-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Poster */}
              <div className="relative">
                {movie.Poster && movie.Poster !== 'N/A' && (
                  <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    <img 
                      src={movie.Poster} 
                      alt={`${movie.Title} poster`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-bg-card via-white/50 dark:via-dark-bg-card/50 to-transparent" />
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-dark-bg-tertiary/90 backdrop-blur-md hover:bg-white dark:hover:bg-dark-bg-secondary transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Close details"
                  type="button"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-dark-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Title Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary mb-2 leading-tight">
                        {movie.Title}
                      </h2>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-gray-600 dark:text-dark-text-secondary font-medium">{movie.Year}</span>
                        {movie.Type === 'series' && detail?.totalSeasons && (() => {
                          const seasons = parseInt(detail.totalSeasons, 10);
                          let seasonWord = t('movie.seasons3');
                          if (!isNaN(seasons)) {
                            const lastDigit = seasons % 10;
                            const lastTwoDigits = seasons % 100;
                            if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                              seasonWord = t('movie.seasons3');
                            } else if (lastDigit === 1) {
                              seasonWord = t('movie.season');
                            } else if (lastDigit >= 2 && lastDigit <= 4) {
                              seasonWord = t('movie.seasons2');
                            }
                          }
                          return (
                            <>
                              <span className="text-gray-400 dark:text-dark-text-tertiary">•</span>
                              <span className="text-gray-600 dark:text-dark-text-secondary font-medium">
                                {detail.totalSeasons} {seasonWord}
                              </span>
                            </>
                          );
                        })()}
                        {detail?.Runtime && detail.Runtime !== 'N/A' && (
                          <>
                            <span className="text-gray-400 dark:text-dark-text-tertiary">•</span>
                            <span className="text-gray-600 dark:text-dark-text-secondary">{detail.Runtime}</span>
                          </>
                        )}
                        {rating && (
                          <>
                            <span className="text-gray-400 dark:text-dark-text-tertiary">•</span>
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${getRatingColor(detail!.imdbRating)}`}>
                              <span className="text-white text-sm font-bold">★</span>
                              <span className="text-white text-sm font-bold">{detail!.imdbRating}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Plot */}
                {detail?.Plot && detail.Plot !== 'N/A' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
                      {t('movie.plot')}
                    </h3>
                    <p className="text-gray-700 dark:text-dark-text-secondary leading-relaxed">
                      {detail.Plot}
                    </p>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {detail?.Genre && detail.Genre !== 'N/A' && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
                        {t('movie.genre')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {detail.Genre.split(', ').map((genre, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {detail?.Director && detail.Director !== 'N/A' && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
                        {t('movie.director')}
                      </h4>
                      <p className="text-gray-900 dark:text-dark-text-primary font-medium">
                        {detail.Director}
                      </p>
                    </div>
                  )}

                  {detail?.Released && detail.Released !== 'N/A' && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
                        {t('movie.releaseDate')}
                      </h4>
                      <p className="text-gray-900 dark:text-dark-text-primary font-medium">
                        {detail.Released}
                      </p>
                    </div>
                  )}

                  {detail?.Country && detail.Country !== 'N/A' && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
                        {t('movie.country')}
                      </h4>
                      <p className="text-gray-900 dark:text-dark-text-primary font-medium">
                        {detail.Country}
                      </p>
                    </div>
                  )}

                  {/* Series Info - Seasons and Episodes */}
                  {(movie.Type === 'series' || detail?.Type === 'series') && (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50 col-span-1 sm:col-span-2">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span>📺</span>
                        <span>{t('movie.series')}</span>
                      </h4>
                      <div className="space-y-2">
                        {detail?.totalSeasons ? (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-dark-text-secondary text-sm font-medium">{t('movie.seasons')}</span>
                            <span className="text-gray-900 dark:text-dark-text-primary font-bold text-lg">
                              {detail.totalSeasons}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-dark-text-secondary text-sm font-medium">{t('movie.seasons')}</span>
                            <span className="text-gray-500 dark:text-dark-text-tertiary text-sm italic">
                              {t('movie.infoUnavailable')}
                            </span>
                          </div>
                        )}
                        {detail?.totalSeasons && (
                          <>
                            {seasonFetcher.state === 'loading' && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-tertiary">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('movie.loadingEpisodes')}
                              </div>
                            )}
                            {seasonFetcher.data && seasonFetcher.data.Episodes && (
                              <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-800/50">
                                <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                                  {t('movie.episodesInSeason')}
                                </span>
                                <span className="text-gray-900 dark:text-dark-text-primary font-bold">
                                  {seasonFetcher.data.Episodes.length}
                                </span>
                              </div>
                            )}
                            {seasonFetcher.state === 'idle' && seasonFetcher.data === undefined && detail.totalSeasons && (
                              <div className="text-xs text-gray-500 dark:text-dark-text-tertiary italic">
                                {t('movie.loadingEpisodes')}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {movie.imdbID.startsWith('hdrezka-') && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide">
                      {t('movie.watchOnline')}
                    </h3>
                    {streamFetcher.state === 'loading' && !streamFetcher.data && (
                      <div className="text-sm text-gray-500 dark:text-dark-text-tertiary">
                        {t('movie.loadingStream')}
                      </div>
                    )}
                    {streamError && (
                      <div className="text-sm text-red-500 dark:text-red-400">
                        {t('movie.streamError')} ({streamError})
                      </div>
                    )}
                    {streamUrl ? (
                      <VideoPlayer
                        url={streamUrl}
                        poster={detail?.Poster && detail.Poster !== 'N/A' ? detail.Poster : undefined}
                      />
                    ) : (
                      streamFetcher.state === 'idle' && streamFetcher.data && !streamFetcher.data.stream && !streamError && (
                        <div className="text-sm text-gray-500 dark:text-dark-text-tertiary">
                          {t('movie.noStream')}
                        </div>
                      )
                    )}
                    {streamData && Object.keys(streamData).length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(streamData).map(([quality, link]) => (
                          <a
                            key={quality}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-200 dark:bg-dark-bg-secondary hover:bg-gray-300 dark:hover:bg-dark-bg-tertiary transition-colors"
                          >
                            {quality}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cast */}
                {detail?.Actors && detail.Actors !== 'N/A' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
                      {t('movie.cast')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {detail.Actors.split(', ').map((actor, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-dark-bg-tertiary text-gray-700 dark:text-dark-text-secondary text-sm rounded-lg border border-gray-200 dark:border-dark-border"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <a
                    href={
                      movie.imdbID.startsWith('hdrezka-') && detail?.Website 
                        ? detail.Website 
                        : `https://www.imdb.com/title/${movie.imdbID}/`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                      movie.imdbID.startsWith('hdrezka-') && detail?.Website
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                    }`}
                  >
                    {movie.imdbID.startsWith('hdrezka-') && detail?.Website ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span>HDRezka</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10zM5.5 7.5h1.5v9H5.5v-9zm2.5 0h1.5l1 3.5L11.5 7.5H13v9h-1.5V9.75L10.5 13h-1L8.5 9.75V16.5H7v-9zm6 0h1.5c1.5 0 2.5 1 2.5 2.5v4c0 1.5-1 2.5-2.5 2.5H13.5v-9zm1.5 1.5v6h.5c.5 0 1-.5 1-1v-4c0-.5-.5-1-1-1h-.5z"/>
                        </svg>
                        <span>IMDb</span>
                      </>
                    )}
                  </a>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-dark-bg-tertiary hover:bg-gray-200 dark:hover:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-primary font-semibold rounded-xl transition-all duration-200 border border-gray-300 dark:border-dark-border hover:scale-105 active:scale-95"
                    type="button"
                  >
                    {t('movie.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
