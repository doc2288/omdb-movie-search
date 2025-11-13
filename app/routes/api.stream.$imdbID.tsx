import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { getStreamHDRezka } from '~/utils/hdrezka';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const encodedId = params.imdbID;

  if (!encodedId) {
    return json({ error: 'Missing imdbID parameter' }, { status: 400 });
  }

  const imdbID = decodeURIComponent(encodedId);

  try {
    const stream = await getStreamHDRezka(imdbID);

    if (!stream) {
      return json({ stream: null }, { status: 404 });
    }

    return json({ stream });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load stream';
    return json({ error: message }, { status: 500 });
  }
};
