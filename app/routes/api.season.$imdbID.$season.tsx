import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { getSeriesSeason } from '~/utils/omdb';

export async function loader({ params }: LoaderFunctionArgs) {
  const { imdbID, season } = params;

  if (!imdbID || !season) {
    return json({ error: 'Missing imdbID or season parameter' }, { status: 400 });
  }

  const seasonNum = parseInt(season, 10);
  if (isNaN(seasonNum) || seasonNum < 1) {
    return json({ error: 'Invalid season number' }, { status: 400 });
  }

  try {
    const seasonData = await getSeriesSeason(imdbID, seasonNum);
    
    if (!seasonData) {
      return json({ error: 'Season not found' }, { status: 404 });
    }

    return json(seasonData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching season:', error);
    return json({ error: 'Failed to fetch season data' }, { status: 500 });
  }
}

