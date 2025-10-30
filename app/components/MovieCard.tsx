import { useState } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';
import Modal from '~/components/Modal';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail;
}

export default function MovieCard({ movie, detail }: MovieCardProps) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const poster = movie.Poster && movie.Poster !== 'N/A' && !imageError ? movie.Poster : null;

  return (
    <article className="bg-white dark:bg-dark-bg-card rounded-xl shadow-card-light dark:shadow-card-dark overflow-hidden transition hover:shadow-lg border border-gray-200 dark:border-dark-border">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
        aria-label={`Open details for ${movie.Title}`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-72 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
            {poster ? (
              <img src={poster} alt={`${movie.Title} poster`} className="w-full h-full object-cover" onError={() => setImageError(true)} loading="lazy" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">{movie.Title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">{movie.Type}</span>
              <span className="font-semibold">{movie.Year}</span>
            </div>
          </div>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
            {poster ? (
              <img src={poster} alt={`${movie.Title} poster`} className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-dark-text-primary mb-2">{movie.Title}</h2>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-dark-bg-tertiary">{movie.Year}</span>
              <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">{movie.Type}</span>
              {detail?.Runtime && detail.Runtime !== 'N/A' && (
                <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-dark-bg-tertiary">{detail.Runtime}</span>
              )}
              {detail?.imdbRating && detail.imdbRating !== 'N/A' && (
                <span className="rounded-md bg-yellow-100 px-2 py-1 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">⭐ {detail.imdbRating}</span>
              )}
            </div>
            {detail?.Genre && detail.Genre !== 'N/A' && (
              <div className="mb-3 flex flex-wrap gap-2">
                {detail.Genre.split(', ').map(g => (
                  <span key={g} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300">{g}</span>
                ))}
              </div>
            )}
            {detail?.Plot && detail.Plot !== 'N/A' && (
              <p className="mb-4 text-base leading-relaxed text-gray-800 dark:text-dark-text-primary">{detail.Plot}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-dark-text-secondary">
              {detail?.Director && detail.Director !== 'N/A' && <span><strong>Director:</strong> {detail.Director}</span>}
              {detail?.Actors && detail.Actors !== 'N/A' && <span><strong>Cast:</strong> {detail.Actors}</span>}
              {detail?.Released && detail.Released !== 'N/A' && <span><strong>Released:</strong> {detail.Released}</span>}
            </div>
            <div className="mt-6 flex gap-3">
              <a href={`https://www.imdb.com/title/${movie.imdbID}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600">Open IMDb</a>
              <button onClick={() => setOpen(false)} className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">Close</button>
            </div>
          </div>
        </div>
      </Modal>
    </article>
  );
}
