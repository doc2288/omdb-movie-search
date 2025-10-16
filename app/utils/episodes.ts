import type { OMDBMovieDetail } from '~/types/omdb';
import { retryWithBackoff } from '~/utils/cache';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY!;

// Fetch number of episodes for a series by summing all seasons
export const getTotalEpisodes = async (imdbID: string, totalSeasonsStr?: string): Promise<number | null> => {
  try {
    // If totalSeasons is unknown, fetch series root to get it
    let totalSeasons = totalSeasonsStr ? parseInt(totalSeasonsStr, 10) : NaN;

    if (!totalSeasons || Number.isNaN(totalSeasons)) {
      const params = new URLSearchParams({ apikey: API_KEY, i: imdbID });
      const url = `${OMDB_BASE_URL}?${params.toString()}`;
      const root = await retryWithBackoff(async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as OMDBMovieDetail;
      });
      if (!root || root.Response === 'False' || !root.totalSeasons || root.totalSeasons === 'N/A') return null;
      totalSeasons = parseInt(root.totalSeasons, 10);
    }

    let total = 0;
    for (let season = 1; season <= totalSeasons; season++) {
      const sp = new URLSearchParams({ apikey: API_KEY, i: imdbID, Season: String(season) });
      const surl = `${OMDB_BASE_URL}?${sp.toString()}`;
      const data = await retryWithBackoff(async () => {
        const res = await fetch(surl);
        if (!res.ok) throw new Error(String(res.status));
        return await res.json();
      });

      // OMDb returns { Episodes: [{Episode: '1', ...}, ...] }
      if (data && Array.isArray(data.Episodes)) {
        total += data.Episodes.length;
      }
    }

    return total;
  } catch (e) {
    console.error('Failed to get total episodes for', imdbID, e);
    return null;
  }
};
