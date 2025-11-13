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
  'search.filters': {
    en: 'Filters',
    uk: 'Фільтри',
    no: 'Filtre',
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
  'search.yearFrom': {
    en: '📅 Year From',
    uk: '📅 Рік від',
    no: '📅 År fra',
  },
  'search.yearTo': {
    en: '📅 Year To',
    uk: '📅 Рік до',
    no: '📅 År til',
  },
  'search.anyYear': {
    en: '✨ Any Year',
    uk: '✨ Будь-який рік',
    no: '✨ Hvilket som helst år',
  },
  'search.yearRangeError': {
    en: 'Year "from" must be less than or equal to "to"',
    uk: 'Рік "від" повинен бути менше або дорівнювати "до"',
    no: 'År "fra" må være mindre enn eller lik "til"',
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
  'search.genres.action': {
    en: 'Action',
    uk: 'Бойовик',
    no: 'Action',
  },
  'search.genres.adventure': {
    en: 'Adventure',
    uk: 'Пригоди',
    no: 'Eventyr',
  },
  'search.genres.animation': {
    en: 'Animation',
    uk: 'Анімація',
    no: 'Animasjon',
  },
  'search.genres.biography': {
    en: 'Biography',
    uk: 'Біографія',
    no: 'Biografi',
  },
  'search.genres.comedy': {
    en: 'Comedy',
    uk: 'Комедія',
    no: 'Komedie',
  },
  'search.genres.crime': {
    en: 'Crime',
    uk: 'Кримінал',
    no: 'Kriminal',
  },
  'search.genres.documentary': {
    en: 'Documentary',
    uk: 'Документальний',
    no: 'Dokumentar',
  },
  'search.genres.drama': {
    en: 'Drama',
    uk: 'Драма',
    no: 'Drama',
  },
  'search.genres.family': {
    en: 'Family',
    uk: 'Сімейний',
    no: 'Familie',
  },
  'search.genres.fantasy': {
    en: 'Fantasy',
    uk: 'Фантастика',
    no: 'Fantasy',
  },
  'search.genres.horror': {
    en: 'Horror',
    uk: 'Жахи',
    no: 'Skrekk',
  },
  'search.genres.music': {
    en: 'Music',
    uk: 'Музика',
    no: 'Musikk',
  },
  'search.genres.mystery': {
    en: 'Mystery',
    uk: 'Детектив',
    no: 'Mysterium',
  },
  'search.genres.romance': {
    en: 'Romance',
    uk: 'Романтика',
    no: 'Romantikk',
  },
  'search.genres.sciFi': {
    en: 'Sci-Fi',
    uk: 'Наукова фантастика',
    no: 'Sci-Fi',
  },
  'search.genres.sport': {
    en: 'Sport',
    uk: 'Спорт',
    no: 'Sport',
  },
  'search.genres.thriller': {
    en: 'Thriller',
    uk: 'Трилер',
    no: 'Thriller',
  },
  'search.genres.war': {
    en: 'War',
    uk: 'Військовий',
    no: 'Krig',
  },
  'search.genres.western': {
    en: 'Western',
    uk: 'Вестерн',
    no: 'Western',
  },
  'search.searchGenre': {
    en: 'Search genre...',
    uk: 'Пошук жанру...',
    no: 'Søk sjanger...',
  },
  'search.noGenresFound': {
    en: 'No genres found',
    uk: 'Жанрів не знайдено',
    no: 'Ingen sjangere funnet',
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
  'movie.watchOnline': {
    en: 'Watch online',
    uk: 'Дивитися онлайн',
    no: 'Se på nett',
  },
  'movie.loadingStream': {
    en: 'Loading player...',
    uk: 'Завантаження плеєра...',
    no: 'Laster avspilleren...',
  },
  'movie.noStream': {
    en: 'Streaming links are currently unavailable.',
    uk: 'Потокові посилання наразі недоступні.',
    no: 'Strømmelenker er for øyeblikket utilgjengelige.',
  },
  'movie.streamError': {
    en: 'Failed to load stream',
    uk: 'Не вдалося завантажити потік',
    no: 'Kunne ikke laste strømmen',
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
  
  // Sort
  'sort.sortBy': {
    en: 'Sort by',
    uk: 'Сортувати за',
    no: 'Sorter etter',
  },
  'sort.default': {
    en: 'Default',
    uk: 'За замовчуванням',
    no: 'Standard',
  },
  'sort.ratingDesc': {
    en: 'Rating (High to Low)',
    uk: 'Рейтинг (Високий до Низького)',
    no: 'Rangering (Høy til Lav)',
  },
  'sort.ratingAsc': {
    en: 'Rating (Low to High)',
    uk: 'Рейтинг (Низький до Високого)',
    no: 'Rangering (Lav til Høy)',
  },
  'sort.yearDesc': {
    en: 'Year (Newest First)',
    uk: 'Рік (Новіші спочатку)',
    no: 'År (Nyeste først)',
  },
  'sort.yearAsc': {
    en: 'Year (Oldest First)',
    uk: 'Рік (Старіші спочатку)',
    no: 'År (Eldste først)',
  },
  'sort.titleAsc': {
    en: 'Title (A-Z)',
    uk: 'Назва (А-Я)',
    no: 'Tittel (A-Å)',
  },
  'sort.titleDesc': {
    en: 'Title (Z-A)',
    uk: 'Назва (Я-А)',
    no: 'Tittel (Å-A)',
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

