import { useState, useEffect } from 'react';
import type { OMDBSearchItem, OMDBMovieDetail } from '~/types/omdb';
import Modal from '~/components/Modal';

interface MovieCardProps {
  movie: OMDBSearchItem;
  detail?: OMDBMovieDetail; // optional preloaded
}

async function fetchDetail(id: string): Promise<OMDBMovieDetail | null> {
  try {
    const res = await fetch(`/api/omdb?i=${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as OMDBMovieDetail;
  } catch {
    return null;
  }
}

export default function MovieCard({ movie, detail: initialDetail }: MovieCardProps) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<OMDBMovieDetail | null>(initialDetail ?? null);

  const poster = movie.Poster && movie.Poster !== 'N/A' && !imageError ? movie.Poster : null;

  // Lazy-load full details on open
  useEffect(() => {
    let ignore = false;
    if (open && !detail) {
      setLoading(true);
      fetchDetail(movie.imdbID).then((d) => {
        if (!ignore) setDetail(d);
      }).finally(() => !ignore && setLoading(false));
    }
    return () => { ignore = true; };
  }, [open, detail, movie.imdbID]);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg-card transition-shadow hover:shadow-lg">
      {/* Hover overlay hint */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
        aria-label={`Open details for ${movie.Title}`}
      >
        <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          {poster ? (
            <img src={poster} alt={`${movie.Title} poster`} className="absolute inset-0 h-full w-full object-cover" onError={() => setImageError(true)} loading="lazy" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="line-clamp-2 text-lg font-bold text-white drop-shadow">{movie.Title}</h3>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/90">
              <span className="rounded-full bg-white/15 px-2 py-0.5 backdrop-blur">{movie.Year}</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 capitalize backdrop-blur">{movie.Type}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Netflix-like modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="relative overflow-hidden rounded-2xl">
          {/* Hero header */}
          <div className="relative h-56 w-full md:h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"/>
            {poster ? (
              <img src={poster} alt={`${movie.Title} poster`} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gray-700" />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow">{movie.Title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/90">
                  <span className="rounded bg-white/20 px-2 py-0.5">{movie.Year}</span>
                  <span className="rounded bg-white/20 px-2 py-0.5 capitalize">{movie.Type}</span>
                  {detail?.Runtime && detail.Runtime !== 'N/A' && <span className="rounded bg-white/20 px-2 py-0.5">{detail.Runtime}</span>}
                  {detail?.imdbRating && detail.imdbRating !== 'N/A' && <span className="rounded bg-yellow-500/90 px-2 py-0.5 text-black">⭐ {detail.imdbRating}</span>}
                </div>
              </div>
              <a href={`https://www.imdb.com/title/${movie.imdbID}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400">Open IMDb</a>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-[1fr_280px] md:p-6">
            <div>
              {loading && <div className="mb-3 h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-dark-bg-tertiary"/>}
              {detail?.Plot && detail.Plot !== 'N/A' && (
                <p className="mb-4 text-base leading-relaxed text-gray-800 dark:text-dark-text-primary">{detail.Plot}</p>
              )}
              {detail?.Genre && detail.Genre !== 'N/A' && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {detail.Genre.split(', ').map(g => (
                    <span key={g} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300">{g}</span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-dark-text-secondary">
                {detail?.Director && detail.Director !== 'N/A' && <span><strong>Director:</strong> {detail.Director}</span>}
                {detail?.Actors && detail.Actors !== 'N/A' && <span><strong>Cast:</strong> {detail.Actors}</span>}
                {detail?.Released && detail.Released !== 'N/A' && <span><strong>Released:</strong> {detail.Released}</span>}
              </div>
            </div>
            <div className="space-y-3">
              {detail?.Awards && detail.Awards !== 'N/A' && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-dark-bg-tertiary">
                  <div className="mb-1 text-xs text-gray-500 dark:text-dark-text-tertiary">Awards</div>
                  <div className="font-medium text-gray-900 dark:text-dark-text-primary">{detail.Awards}</div>
                </div>
              )}
              {detail?.BoxOffice && detail.BoxOffice !== 'N/A' && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-dark-bg-tertiary">
                  <div className="mb-1 text-xs text-gray-500 dark:text-dark-text-tertiary">Box Office</div>
                  <div className="font-medium text-gray-900 dark:text-dark-text-primary">{detail.BoxOffice}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </article>
  );
}
