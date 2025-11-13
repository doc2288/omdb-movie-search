export type Language = 'en' | 'uk' | 'no';

export interface Translations {
  [key: string]: {
    en: string;
    uk: string;
    no: string;
  };
}

export const translations: Translations = {
  // Header
  'app.title': {
    en: '🎬 CineSearch',
    uk: '🎬 CineSearch',
    no: '🎬 CineSearch',
  },
  'app.subtitle': {
    en: 'Discover movies, series and episodes from the world\'s largest database',
    uk: 'Відкривайте фільми, серіали та епізоди з найбільшої бази даних у світі',
    no: 'Oppdag filmer, serier og episoder fra verdens største database',
  },
  
  // Search
  'search.placeholder': {
    en: 'Enter movie title, director, actor...',
    uk: 'Введіть назву фільму, режисера, актора...',
    no: 'Skriv inn filmtittel, regissør, skuespiller...',
  },
  'search.button': {
    en: 'Search',
    uk: 'Пошук',
    no: 'Søk',
  },
  'search.searching': {
    en: 'Searching...',
    uk: 'Пошук...',
    no: 'Søker...',
  },
  'search.advancedFilters': {
    en: 'Advanced Filters',
    uk: 'Розширені фільтри',
    no: 'Avanserte filtre',
  },
  'search.active': {
    en: 'Active',
    uk: 'Активні',
    no: 'Aktiv',
  },
  'search.clearFilters': {
    en: 'Clear filters',
    uk: 'Очистити фільтри',
    no: 'Tøm filtre',
  },
  'search.contentType': {
    en: '🎬 Content Type',
    uk: '🎬 Тип контенту',
    no: '🎬 Innholdstype',
  },
  'search.allTypes': {
    en: 'All Types',
    uk: 'Всі типи',
    no: 'Alle typer',
  },
  'search.movies': {
    en: 'Movies',
    uk: 'Фільми',
    no: 'Filmer',
  },
  'search.tvSeries': {
    en: 'TV Series',
    uk: 'ТВ серіали',
    no: 'TV-serier',
  },
  'search.episodes': {
    en: 'Episodes',
    uk: 'Епізоди',
    no: 'Episoder',
  },
  'search.releaseYear': {
    en: '📅 Release Year',
    uk: '📅 Рік випуску',
    no: '📅 Utgivelsesår',
  },
  'search.anyYear': {
    en: '✨ Any Year',
    uk: '✨ Будь-який рік',
    no: '✨ Hvilket som helst år',
  },
  'search.genre': {
    en: '🎭 Genre',
    uk: '🎭 Жанр',
    no: '🎭 Sjanger',
  },
  'search.anyGenre': {
    en: '🌎 Any Genre',
    uk: '🌎 Будь-який жанр',
    no: '🌎 Hvilken som helst sjanger',
  },
  'search.popularSearches': {
    en: '🔥 Popular Searches',
    uk: '🔥 Популярні пошуки',
    no: '🔥 Populære søk',
  },
  
  // Results
  'results.found': {
    en: 'Found',
    uk: 'Знайдено',
    no: 'Fant',
  },
  'results.results': {
    en: 'results with posters',
    uk: 'результатів з постерами',
    no: 'resultater med plakater',
  },
  'results.for': {
    en: 'for',
    uk: 'для',
    no: 'for',
  },
  'results.hidden': {
    en: 'hidden without posters',
    uk: 'приховано без постерів',
    no: 'skjult uten plakater',
  },
  'results.showingPopular': {
    en: 'Showing popular movies. Use the search above to find specific movies.',
    uk: 'Показано популярні фільми. Використовуйте пошук вище, щоб знайти конкретні фільми.',
    no: 'Viser populære filmer. Bruk søket over for å finne spesifikke filmer.',
  },
  'results.noResults': {
    en: 'No Results Found',
    uk: 'Результатів не знайдено',
    no: 'Ingen resultater funnet',
  },
  'results.tryChanging': {
    en: 'Try changing your search terms or filters',
    uk: 'Спробуйте змінити умови пошуку або фільтри',
    no: 'Prøv å endre søkeordene eller filtrene',
  },
  'results.error': {
    en: 'Search Error',
    uk: 'Помилка пошуку',
    no: 'Søkefeil',
  },
  'results.tryAgain': {
    en: 'Try Again',
    uk: 'Спробувати знову',
    no: 'Prøv igjen',
  },
  
  // Movie Card
  'movie.details': {
    en: '📖 Details',
    uk: '📖 Деталі',
    no: '📖 Detaljer',
  },
  'movie.close': {
    en: 'Close',
    uk: 'Закрити',
    no: 'Lukk',
  },
  'movie.plot': {
    en: 'Plot',
    uk: 'Сюжет',
    no: 'Handling',
  },
  'movie.genre': {
    en: 'Genre',
    uk: 'Жанр',
    no: 'Sjanger',
  },
  'movie.director': {
    en: 'Director',
    uk: 'Режисер',
    no: 'Regissør',
  },
  'movie.releaseDate': {
    en: 'Release Date',
    uk: 'Дата випуску',
    no: 'Utgivelsesdato',
  },
  'movie.country': {
    en: 'Country',
    uk: 'Країна',
    no: 'Land',
  },
  'movie.cast': {
    en: 'Cast',
    uk: 'В ролях',
    no: 'Rollebesetning',
  },
  'movie.series': {
    en: 'Series',
    uk: 'Серіал',
    no: 'Serie',
  },
  'movie.seasons': {
    en: 'Seasons:',
    uk: 'Сезонів:',
    no: 'Sesonger:',
  },
  'movie.episodesInSeason': {
    en: 'Episodes in season 1:',
    uk: 'Серій у 1 сезоні:',
    no: 'Episoder i sesong 1:',
  },
  'movie.loadingEpisodes': {
    en: 'Loading episode information...',
    uk: 'Завантаження інформації про серії...',
    no: 'Laster episodeinformasjon...',
  },
  'movie.openImdb': {
    en: 'Open on IMDb',
    uk: 'Відкрити в IMDb',
    no: 'Åpne på IMDb',
  },
  'movie.season': {
    en: 'season',
    uk: 'сезон',
    no: 'sesong',
  },
  'movie.seasons2': {
    en: 'seasons',
    uk: 'сезони',
    no: 'sesonger',
  },
  'movie.seasons3': {
    en: 'seasons',
    uk: 'сезонів',
    no: 'sesonger',
  },
  'movie.infoUnavailable': {
    en: 'Information unavailable',
    uk: 'Інформація недоступна',
    no: 'Informasjon utilgjengelig',
  },
  
  // Pagination
  'pagination.page': {
    en: 'Page',
    uk: 'Сторінка',
    no: 'Side',
  },
  'pagination.of': {
    en: 'of',
    uk: 'з',
    no: 'av',
  },
  'pagination.pages': {
    en: 'pages',
    uk: 'сторінок',
    no: 'sider',
  },
  'pagination.results': {
    en: 'results',
    uk: 'результатів',
    no: 'resultater',
  },
  'pagination.previous': {
    en: 'Previous',
    uk: 'Попередня',
    no: 'Forrige',
  },
  'pagination.next': {
    en: 'Next',
    uk: 'Наступна',
    no: 'Neste',
  },
  'pagination.start': {
    en: 'Start',
    uk: 'Початок',
    no: 'Start',
  },
  'pagination.end': {
    en: 'End',
    uk: 'Кінець',
    no: 'Slutt',
  },
  'pagination.complete': {
    en: 'complete',
    uk: 'завершено',
    no: 'fullført',
  },
};

export const getTranslation = (key: string, language: Language): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[language] || translation.en;
};

