import { useState } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const poster = movie.Poster && movie.Poster !== 'N/A' && !imageError ? movie.Poster : null;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg-card transition-shadow hover:shadow-lg">
      {/* Clickable area */}
      <a href={`https://www.imdb.com/title/${movie.imdbID}/`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-[1]" aria-label={`${movie.Title} on IMDb`} />

      {/* Media */}
      <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        {poster ? (
          <img
            src={poster}
            alt={`${movie.Title} poster`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute left-2 top-2 z-10 flex gap-1">
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur">{movie.Year}</span>
          <span className="rounded-full bg-blue-600/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur capitalize">{movie.Type}</span>
        </div>

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Title over image */}
        <h3 className="absolute inset-x-3 bottom-3 z-10 line-clamp-2 text-lg font-bold text-white drop-shadow-sm">
          {movie.Title}
        </h3>
      </div>

      {/* Meta + actions */}
      <div className="p-3">
        {detail && (
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-gray-600 dark:text-dark-text-tertiary">
            {detail.imdbRating && detail.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-1 rounded-md bg-gray-50 p-2 dark:bg-dark-bg-tertiary">
                <span>⭐</span>
                <span className="font-semibold">{detail.imdbRating}</span>
              </div>
            )}
            {detail.Runtime && detail.Runtime !== 'N/A' && (
              <div className="flex items-center gap-1 rounded-md bg-gray-50 p-2 dark:bg-dark-bg-tertiary">
                <span>⏱</span>
                <span className="font-semibold">{detail.Runtime}</span>
              </div>
            )}
            {detail.Rated && detail.Rated !== 'N/A' && (
              <div className="flex items-center gap-1 rounded-md bg-gray-50 p-2 dark:bg-dark-bg-tertiary">
                <span>🔞</span>
                <span className="font-semibold">{detail.Rated}</span>
              </div>
            )}
          </div>
        )}

        {/* Expandable panel */}
        {detail && (
          <div className="mt-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setExpanded(!expanded); }}
              className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              {expanded ? 'Hide details' : 'More details'}
              <svg className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded && (
              <div className="mt-3 space-y-3 rounded-lg border border-gray-200 p-3 dark:border-dark-border">
                {detail.Genre && detail.Genre !== 'N/A' && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {detail.Genre.split(', ').map((g) => (
                      <span key={g} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {detail.Plot && detail.Plot !== 'N/A' && (
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-dark-text-primary">{detail.Plot}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {detail.Director && detail.Director !== 'N/A' && (
                    <div className="rounded-md bg-gray-50 p-2 dark:bg-dark-bg-tertiary">
                      <div className="text-[10px] text-gray-500 dark:text-dark-text-tertiary">Director</div>
                      <div className="font-medium text-gray-900 dark:text-dark-text-primary">{detail.Director}</div>
                    </div>
                  )}
                  {detail.Actors && detail.Actors !== 'N/A' && (
                    <div className="rounded-md bg-gray-50 p-2 dark:bg-dark-bg-tertiary">
                      <div className="text-[10px] text-gray-500 dark:text-dark-text-tertiary">Cast</div>
                      <div className="font-medium text-gray-900 dark:text-dark-text-primary">{detail.Actors}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
