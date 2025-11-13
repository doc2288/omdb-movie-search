import type { MovieSearchResponse, MovieDetail, SearchParams } from '~/types/movie-api';
import { load, type CheerioAPI } from 'cheerio';
import { getMovieDetail as getMovieDetailOMDB, isOMDBAvailable, searchMovies as searchMoviesOMDB } from '~/utils/omdb';

const DEFAULT_HDREZKA_BASE_URL = 'https://hdrezka.ag';

const getHdrezkaMirrors = (): string[] => {
  const defaults = [
    DEFAULT_HDREZKA_BASE_URL,
    'https://rezka.ag',
    'https://hdrezka.co',
    'https://hdrezka.cc',
    'https://hdrezka.me',
  ];

  const fromEnv = process.env.HDREZKA_BASE_URL
    ? process.env.HDREZKA_BASE_URL.split(',').map((mirror) => mirror.trim()).filter(Boolean)
    : [];

  const normalized = [...fromEnv, ...defaults]
    .map((url) => url.replace(/\/+$/, ''))
    .filter((url, index, self) => self.indexOf(url) === index);

  return normalized.length > 0 ? normalized : [DEFAULT_HDREZKA_BASE_URL];
};

const getAjaxSearchUrl = (baseUrl: string): string => `${baseUrl}/engine/ajax/search.php`;

const CATEGORY_SLUGS = new Set([
  'русские', 'украинские', 'зарубежные', 'российские', 'белорусские',
  'реальное-тв', 'телепередачи', 'тв-шоу', 'фильмы', 'сериалы',
  'новинки', 'топ', 'популярные', 'лучшие',
]);

const GENRE_NAMES = new Set([
  'фильмы', 'сериалы', 'мультфильмы', 'аниме', 'новинки', 'топ',
  'лучшие', 'популярные', 'вестерны', 'семейные', 'фэнтези',
  'биографические', 'боевики', 'комедии', 'драмы', 'ужасы',
  'триллеры', 'детективы', 'мелодрамы', 'приключения', 'фантастика',
  'исторические', 'военные', 'криминал', 'спорт', 'мюзиклы',
  'арт-хаус', 'артхаус', 'спортивные', 'музыкальные', 'документальные',
  'эротика', 'детские', 'путешествия', 'познавательные', 'театр',
  'концерт', 'стендап', 'короткометражные', 'короткометражка',
  'мультики', 'анимация', 'реалити', 'ток-шоу', 'новости',
  'русские', 'украинские', 'зарубежные', 'российские', 'белорусские',
  'реальное тв', 'реальное телевидение', 'телепередачи', 'тв-шоу',
  'телешоу', 'передачи', 'тв программы', 'телепрограммы',
  'лучшие новинки', 'новые фильмы', 'новые сериалы', 'все фильмы',
  'все сериалы', 'каталог', 'по жанрам', 'смотреть',
]);

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const isGenreTitle = (title: string): boolean => {
  if (!title || title.length < 2) return false;
  const titleLower = normalizeWhitespace(title).toLowerCase();

  if (
    GENRE_NAMES.has(titleLower) ||
    GENRE_NAMES.has(`${titleLower}ы`) ||
    GENRE_NAMES.has(`${titleLower}и`)
  ) {
    return true;
  }

  for (const genre of GENRE_NAMES) {
    if (genre.includes(' ') && titleLower === genre) {
      return true;
    }
  }

  return false;
};

const isCategoryUrl = (url: string): boolean => {
  if (!url) return false;
  const trimmed = url.replace(/^https?:\/\//, '');
  const segments = trimmed.split('/').filter(Boolean);
  const index = segments.findIndex((segment) => segment === 'films' || segment === 'series');
  if (index >= 0 && segments.length > index + 1) {
    const slug = segments[index + 1].toLowerCase().replace('.html', '');
    return CATEGORY_SLUGS.has(slug);
  }
  return false;
};

const makeAbsoluteUrl = (baseUrl: string, value?: string): string | undefined => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith('//')) {
    return `https:${value}`;
  }
  if (value.startsWith('/')) {
    return `${baseUrl}${value}`;
  }
  return `${baseUrl}/${value}`;
};

interface HDRezkaSearchResult {
  title: string;
  url: string;
  poster?: string;
  year?: string;
  type?: 'movie' | 'series';
}

const translitMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y',
  ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const transliterate = (value: string): string => {
  let result = '';
  for (const char of value) {
    const lower = char.toLowerCase();
    if (translitMap[lower]) {
      result += translitMap[lower];
    } else if (/[^\w\s]/.test(lower)) {
      result += lower;
    } else {
      result += lower;
    }
  }
  return result;
};

const createSearchForms = (value: string): string[] => {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!normalized) {
    return [];
  }
  const translit = normalizeWhitespace(transliterate(normalized));
  const forms = [normalized];
  if (translit && translit !== normalized) {
    forms.push(translit);
  }
  return [...new Set(forms)];
};

const collectResults = ($: CheerioAPI, baseUrl: string): HDRezkaSearchResult[] => {
  const results: HDRezkaSearchResult[] = [];

  let allLinks = $('a[href*="/films/"], a[href*="/series/"]');

  if (allLinks.length === 0) {
    allLinks = $('a[href*="films"], a[href*="series"]');
  }

  if (allLinks.length === 0) {
    $('.b-content__inline_item, .search-item, article, .item').each((_, element) => {
      const $item = $(element);
      const $link = $item
        .find('a[href*="/films/"], a[href*="/series/"], a[href*="films"], a[href*="series"]')
        .first();
      if ($link.length > 0) {
        allLinks = allLinks.add($link);
      }
    });
  }

  allLinks.each((_, element) => {
    const $link = $(element);
    const url = $link.attr('href');
    if (!url) return;

    if (isCategoryUrl(url)) {
      return;
    }

    if (
      url.includes('/genre/') ||
      url.includes('/category/') ||
      url.includes('/tag/') ||
      url.includes('?genre=') ||
      url.includes('?category=') ||
      url.includes('?tag=')
    ) {
      return;
    }

    if (url.match(/^\/films\/?$|^\/series\/?$/)) {
      return;
    }

    const urlParts = url.split('/').filter((p) => p.length > 0);
    const filmsIndex = urlParts.findIndex((part) => part === 'films' || part === 'series');
    if (filmsIndex < 0 || urlParts.length <= filmsIndex + 1) {
      return;
    }

    let title =
      normalizeWhitespace($link.text()) ||
      normalizeWhitespace($link.attr('title') || '') ||
      normalizeWhitespace($link.attr('alt') || '');

    if (!title || title.length < 2) {
      const $parent = $link.closest(
        '.b-content__inline_item, .search-item, article, .item, .result, .b-content__inline_item-link, .b-content__title'
      );
      if ($parent.length > 0) {
        title = normalizeWhitespace(
          $parent
            .find('.title, h3, h4, .name, .b-content__inline_item-link, .b-content__title, a')
            .first()
            .text() ||
            ''
        );
        if (!title) {
          const parentText = normalizeWhitespace($parent.text());
          title = parentText.split('\n')[0] || parentText.split(' ').slice(0, 5).join(' ');
        }
      }
    }

    if (!title || title.length < 2) {
      const lastPart = urlParts[urlParts.length - 1]?.replace('.html', '').replace(/-/g, ' ');
      if (lastPart && lastPart.length > 2) {
        title = normalizeWhitespace(lastPart);
      }
    }

    if (!title || title.length < 2) return;
    if (isGenreTitle(title)) return;
    if (title.length < 3 && !/\d/.test(title)) return;

    const fullUrl = makeAbsoluteUrl(baseUrl, url.startsWith('http') ? url : `${url.startsWith('/') ? '' : '/'}${url}`);
    if (!fullUrl) return;

    const linkText = `${$link.text()} ${$link.closest('.b-content__inline_item, .search-item, article').text()}`;
    const yearMatch = linkText.match(/\b(19|20)\d{2}\b/);

    const type: 'movie' | 'series' = url.includes('/series/') ? 'series' : 'movie';

    const $img = $link.closest('.b-content__inline_item, .search-item, article').find('img').first();
    const rawPoster =
      $img.attr('src') ||
      $img.attr('data-src') ||
      $img.attr('data-original');
    const poster = makeAbsoluteUrl(baseUrl, rawPoster);

    results.push({
      title: title.replace(/\s*\(\d{4}\)\s*$/, '').trim(),
      url: fullUrl,
      poster,
      year: yearMatch ? yearMatch[0] : undefined,
      type,
    });
  });

  return results;
};

const filterResultsByQuery = (
  results: HDRezkaSearchResult[],
  searchQuery: string
): HDRezkaSearchResult[] => {
  const queryForms = createSearchForms(searchQuery);
  if (queryForms.length === 0) {
    return [...results];
  }

  const queryWords = queryForms.flatMap((form) => form.split(/\s+/).filter(Boolean));

  const filtered = results.filter((item) => {
    const titleForms = createSearchForms(item.title);
    if (titleForms.length === 0) {
      return false;
    }
    if (titleForms.some((form) => queryForms.some((query) => form.includes(query) || query.includes(form)))) {
      return true;
    }
    return queryWords.some((word) => titleForms.some((form) => form.includes(word) || word.includes(form)));
  });

  return filtered.length > 0 ? filtered : results;
};

const filterResultsByType = (
  results: HDRezkaSearchResult[],
  type?: 'movie' | 'series' | 'episode'
): HDRezkaSearchResult[] => {
  if (!type || type === 'episode') {
    return results;
  }

  const filtered = results.filter((item) => item.type === type);
  return filtered.length > 0 ? filtered : results;
};

const dedupeResults = (results: HDRezkaSearchResult[]): HDRezkaSearchResult[] => {
  const seen = new Set<string>();
  return results.filter((item) => {
    if (!item.url || seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
};

const buildSearchResponse = (
  rawResults: HDRezkaSearchResult[],
  params: SearchParams,
  searchQuery: string
): MovieSearchResponse => {
  let results = filterResultsByQuery(rawResults, searchQuery);
  results = filterResultsByType(results, params.type);
  results = dedupeResults(results);

  if (process.env.NODE_ENV === 'development') {
    console.log('HDRezka: Parsed', results.length, 'unique results for query:', searchQuery);
  }

  if (results.length === 0) {
    return {
      Response: 'False',
      Error: 'No results found on HDRezka',
    };
  }

  const searchItems = results.slice(0, 20).map((item, index) => {
    const urlParts = item.url.split('/');
    const slug = urlParts[urlParts.length - 1]?.replace('.html', '') || `item-${index}`;
    const hdrezkaId = `hdrezka-${index}-${slug}|${encodeURIComponent(item.url)}`;

    return {
      Title: item.title,
      Year: item.year || 'N/A',
      imdbID: hdrezkaId,
      Type: item.type || 'movie',
      Poster: item.poster && item.poster.startsWith('http') ? item.poster : 'N/A',
    };
  });

  return {
    Response: 'True',
    Search: searchItems,
    totalResults: results.length.toString(),
  };
};

const fetchAjaxSearch = async (baseUrl: string, searchQuery: string): Promise<string | null> => {
  try {
    const response = await fetch(getAjaxSearchUrl(baseUrl), {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': baseUrl,
        'Referer': baseUrl,
      },
      body: new URLSearchParams({ q: searchQuery, t: 'all' }).toString(),
    });

    if (!response.ok) {
      return null;
    }

    const raw = await response.text();
    if (!raw) {
      return null;
    }

    try {
      const data = JSON.parse(raw);
      if (typeof data === 'string') {
        return data;
      }
      const html =
        (data && (data.html || data.message || data.result || data.response)) ||
        (Array.isArray(data?.list) ? data.list.join('') : null);
      if (typeof html === 'string' && html.trim().length > 0) {
        return html;
      }
    } catch (error) {
      // not JSON, fallback to raw HTML snippet
      if (process.env.NODE_ENV === 'development') {
        console.warn('HDRezka AJAX search returned non-JSON response');
      }
      return raw;
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('HDRezka AJAX search error for base', baseUrl, error);
    }
    return null;
  }
};

const searchMoviesOnBase = async (
  baseUrl: string,
  params: SearchParams,
  searchQuery: string
): Promise<MovieSearchResponse> => {
  const searchUrl = `${baseUrl}/?do=search&subaction=search&q=${encodeURIComponent(searchQuery)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': baseUrl,
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - HDRezka is too slow');
    }
    throw error;
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  let results = collectResults(load(html), baseUrl);

  if (!results.length) {
    const ajaxHtml = await fetchAjaxSearch(baseUrl, searchQuery);
    if (ajaxHtml) {
      results = collectResults(load(ajaxHtml), baseUrl);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('HDRezka: Parsed', results.length, 'results before filtering (base:', baseUrl, ')');
  }

  return buildSearchResponse(results, params, searchQuery);
};

export const isHDRezkaAvailable = (): boolean => {
  return true;
};

export const searchMoviesHDRezka = async (
  params: SearchParams
): Promise<MovieSearchResponse> => {
  const searchQuery = params.s?.trim();
  if (!searchQuery) {
    return {
      Response: 'False',
      Error: 'Search query is required',
    };
  }

  const mirrors = getHdrezkaMirrors();
  let lastError: Error | null = null;
  let lastResponse: MovieSearchResponse | null = null;

  for (const baseUrl of mirrors) {
    try {
      const response = await searchMoviesOnBase(baseUrl, params, searchQuery);
      if (response.Response === 'True' && response.Search && response.Search.length > 0) {
        return response;
      }
      if (!lastResponse) {
        lastResponse = response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (process.env.NODE_ENV === 'development') {
        console.warn(`HDRezka: search failed on ${baseUrl}`, error);
      }
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  return {
    Response: 'False',
    Error: lastError?.message || 'No results found on HDRezka',
  };
};

export const getMovieDetailHDRezka = async (
  hdrezkaId: string
): Promise<MovieDetail | null> => {
  try {
    const mirrors = getHdrezkaMirrors();
    let detailUrl: string | undefined;

    if (hdrezkaId.includes('|')) {
      const urlPart = hdrezkaId.split('|')[1];
      detailUrl = decodeURIComponent(urlPart);
    } else {
      const parts = hdrezkaId.replace('hdrezka-', '').split('-');
      const slug = parts.slice(1).join('-');

      if (!slug || slug === 'undefined') {
        return null;
      }

      const base = mirrors[0] || DEFAULT_HDREZKA_BASE_URL;
      if (slug.includes('series') || slug.includes('serial')) {
        detailUrl = `${base}/series/${slug.replace(/^(series|serial)[-_]?/, '')}.html`;
      } else {
        detailUrl = `${base}/films/${slug}.html`;
      }
    }

    if (!detailUrl) {
      return null;
    }

    if (!/^https?:\/\//.test(detailUrl)) {
      const base = getHdrezkaMirrors()[0] || DEFAULT_HDREZKA_BASE_URL;
      detailUrl = `${base}/${detailUrl.replace(/^\/+/, '')}`;
    }

    if (!/rezka|hdrezka/i.test(detailUrl)) {
      return null;
    }

    const domainMatch = detailUrl.match(/^https?:\/\/[^/]+/);
    const baseForHeaders = domainMatch ? domainMatch[0] : getHdrezkaMirrors()[0] || DEFAULT_HDREZKA_BASE_URL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(detailUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': baseForHeaders,
          'Origin': baseForHeaders,
        },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('HDRezka detail request timeout');
        }
        return null;
      }
      throw error;
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = load(html);

    const title = normalizeWhitespace($('.b-post__title h1').text() || $('h1').first().text() || '');
    if (!title) {
      return null;
    }

    let imdbExternalId: string | null = null;
    $('a[href*="imdb.com/title/tt"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const match = href.match(/tt\d{5,}/i);
        if (match) {
          imdbExternalId = match[0];
          return false;
        }
      }
      return undefined;
    });

    let poster =
      $('.b-sidecover img, .poster img, .b-content__poster img').first().attr('src') ||
      $('.b-sidecover img, .poster img, .b-content__poster img').first().attr('data-src') ||
      $('.b-sidecover img, .poster img, .b-content__poster img').first().attr('data-original');

    if (!poster) {
      poster =
        $('.b-sidecover img, aside img, .sidebar img').first().attr('src') ||
        $('.b-sidecover img, aside img, .sidebar img').first().attr('data-src');
    }

    if (!poster) {
      $('img').each((_, img) => {
        const $img = $(img);
        const alt = ($img.attr('alt') || '').toLowerCase();
        const src = $img.attr('src') || $img.attr('data-src');
        if (src && (alt.includes('постер') || alt.includes('poster') || alt.includes('обложка'))) {
          poster = src;
          return false;
        }
      });
    }

    const posterUrl = makeAbsoluteUrl(baseForHeaders, poster) || 'N/A';

    const info: Record<string, string> = {};
    $('.b-post__info tr').each((_, element) => {
      const $row = $(element);
      const key = normalizeWhitespace($row.find('td').first().text()).replace(':', '');
      const value = normalizeWhitespace($row.find('td').last().text());
      if (key && value) {
        info[key.toLowerCase()] = value;
      }
    });

    const plot = normalizeWhitespace($('.b-post__description_text').text()) || 'N/A';

    const yearMatch = title.match(/\s\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : info['год'] || 'N/A';

    const typeText = $('.b-post__info').text().toLowerCase();
    const type = typeText.includes('сериал') ? 'series' : 'movie';

    const tryFetchOmdbDetail = async (): Promise<MovieDetail | null> => {
      if (!isOMDBAvailable()) {
        return null;
      }

      if (imdbExternalId) {
        try {
          const omdbById = await getMovieDetailOMDB(imdbExternalId);
          if (omdbById) {
            return omdbById;
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('HDRezka: failed to obtain OMDb detail by ID for', imdbExternalId, error);
          }
        }
      }

      try {
        const searchParams: SearchParams = {
          s: title,
          type: type === 'series' ? 'series' : 'movie',
          y: year !== 'N/A' ? year : undefined,
        };
        const searchResponse = await searchMoviesOMDB(searchParams);
        if (searchResponse.Response === 'True' && searchResponse.Search?.length) {
          const exactMatch = searchResponse.Search.find((item) => {
            const normalizedItemTitle = normalizeWhitespace(item.Title).toLowerCase();
            const normalizedTitle = normalizeWhitespace(title).toLowerCase();
            return normalizedItemTitle === normalizedTitle;
          }) || searchResponse.Search[0];

          if (exactMatch?.imdbID) {
            try {
              const omdbBySearchId = await getMovieDetailOMDB(exactMatch.imdbID);
              if (omdbBySearchId) {
                return omdbBySearchId;
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('HDRezka: failed to obtain OMDb detail by search for', title, error);
              }
            }
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('HDRezka: failed to search OMDb for', title, error);
        }
      }

      return null;
    };

    const omdbDetail = await tryFetchOmdbDetail();

    if (omdbDetail) {
      const merged: MovieDetail = {
        ...omdbDetail,
        imdbID: hdrezkaId,
        Website: detailUrl,
        Poster:
          omdbDetail.Poster && omdbDetail.Poster !== 'N/A'
            ? omdbDetail.Poster
            : posterUrl,
      };

      if (!merged.Plot || merged.Plot === 'N/A') {
        merged.Plot = plot;
      }

      if (!merged.Genre || merged.Genre === 'N/A') {
        merged.Genre = info['жанр'] || info['жанры'] || 'N/A';
      }

      if (!merged.Language || merged.Language === 'N/A') {
        const genres = info['жанр'] || info['жанры'];
        merged.Language = genres ? normalizeWhitespace(genres) : 'N/A';
      }

      return merged;
    }

    const detail: MovieDetail = {
      Title: title.replace(/\s\(\d{4}\)/, '').trim(),
      Year: year,
      Rated: info['рейтинг'] || 'N/A',
      Released: info['дата выхода'] || info['релиз'] || 'N/A',
      Runtime: info['время'] || info['длительность'] || 'N/A',
      Genre: info['жанр'] || info['жанры'] || 'N/A',
      Director: info['режиссер'] || info['режиссёр'] || 'N/A',
      Writer: info['сценарист'] || info['сценаристы'] || 'N/A',
      Actors: info['актеры'] || info['актёры'] || 'N/A',
      Plot: plot,
      Language: info['язык'] || 'ru',
      Country: info['страна'] || 'N/A',
      Awards: 'N/A',
      Poster: posterUrl,
      Ratings: [],
      Metascore: 'N/A',
      imdbRating: info['рейтинг'] || 'N/A',
      imdbVotes: 'N/A',
      imdbID: hdrezkaId,
      Type: type,
      DVD: 'N/A',
      BoxOffice: 'N/A',
      Production: 'N/A',
      Website: detailUrl,
      Response: 'True',
    };

    return detail;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('HDRezka detail error:', error);
    }
    return null;
  }
};

export const getStreamHDRezka = async (
  hdrezkaId: string,
  season?: string,
  episode?: string
): Promise<Record<string, string> | null> => {
  try {
    const parts = hdrezkaId.replace('hdrezka-', '').split('-');
    const slug = parts.slice(1).join('-');

    if (!slug || slug === 'undefined') {
      return null;
    }

    const baseUrl = getHdrezkaMirrors()[0] || DEFAULT_HDREZKA_BASE_URL;
    const detailUrl = `${baseUrl}/films/${slug}.html`;

    const response = await fetch(detailUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      },
    });

    if (!response.ok) {
      return null;
    }

    // Возвращаем заглушку – реальное получение потоков требует дополнительной логики
    return {
      '720p': detailUrl,
      '1080p': detailUrl,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('HDRezka stream error:', error);
    }
    return null;
  }
};

