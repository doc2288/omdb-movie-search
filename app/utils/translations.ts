export type Language = 'en' | 'uk' | 'no' | 'es';

export interface Translations {
  [key: string]: {
    en: string;
    uk: string;
    no: string;
    es: string;
  };
}

export const translations: Translations = {
  // Header
  'app.title': {
    en: '🎬 CineSearch',
    uk: '🎬 CineSearch',
    no: '🎬 CineSearch',
    es: '🎬 CineSearch',
  },
  'app.subtitle': {
    en: 'Discover movies, series and episodes from the world\'s largest database',
    uk: 'Відкривайте фільми, серіали та епізоди з найбільшої бази даних у світі',
    no: 'Oppdag filmer, serier og episoder fra verdens største database',
    es: 'Descubre películas, series y episodios de la base de datos más grande del mundo',
  },

  // Search
  'search.placeholder': {
    en: 'Enter movie title, director, actor...',
    uk: 'Введіть назву фільму, режисера, актора...',
    no: 'Skriv inn filmtittel, regissør, skuespiller...',
    es: 'Introduce el título de la película, director, actor...',
  },
  'search.button': {
    en: 'Search',
    uk: 'Пошук',
    no: 'Søk',
    es: 'Buscar',
  },
  'search.searching': {
    en: 'Searching...',
    uk: 'Пошук...',
    no: 'Søker...',
    es: 'Buscando...',
  },
  'search.advancedFilters': {
    en: 'Advanced Filters',
    uk: 'Розширені фільтри',
    no: 'Avanserte filtre',
    es: 'Filtros avanzados',
  },
  'search.filters': {
    en: 'Filters',
    uk: 'Фільтри',
    no: 'Filtre',
    es: 'Filtros',
  },
  'search.active': {
    en: 'Active',
    uk: 'Активні',
    no: 'Aktiv',
    es: 'Activo',
  },
  'search.clearFilters': {
    en: 'Clear filters',
    uk: 'Очистити фільтри',
    no: 'Tøm filtre',
    es: 'Limpiar filtros',
  },
  'search.contentType': {
    en: '🎬 Content Type',
    uk: '🎬 Тип контенту',
    no: '🎬 Innholdstype',
    es: '🎬 Tipo de contenido',
  },
  'search.allTypes': {
    en: 'All Types',
    uk: 'Всі типи',
    no: 'Alle typer',
    es: 'Todos los tipos',
  },
  'search.movies': {
    en: 'Movies',
    uk: 'Фільми',
    no: 'Filmer',
    es: 'Películas',
  },
  'search.tvSeries': {
    en: 'TV Series',
    uk: 'ТВ серіали',
    no: 'TV-serier',
    es: 'Series de TV',
  },
  'search.episodes': {
    en: 'Episodes',
    uk: 'Епізоди',
    no: 'Episoder',
    es: 'Episodios',
  },
  'search.releaseYear': {
    en: '📅 Release Year',
    uk: '📅 Рік випуску',
    no: '📅 Utgivelsesår',
    es: '📅 Año de lanzamiento',
  },
  'search.yearFrom': {
    en: '📅 Year From',
    uk: '📅 Рік від',
    no: '📅 År fra',
    es: '📅 Año desde',
  },
  'search.yearTo': {
    en: '📅 Year To',
    uk: '📅 Рік до',
    no: '📅 År til',
    es: '📅 Año hasta',
  },
  'search.anyYear': {
    en: '✨ Any Year',
    uk: '✨ Будь-який рік',
    no: '✨ Hvilket som helst år',
    es: '✨ Cualquier año',
  },
  'search.yearRangeError': {
    en: 'Year "from" must be less than or equal to "to"',
    uk: 'Рік "від" повинен бути менше або дорівнювати "до"',
    no: 'År "fra" må være mindre enn eller lik "til"',
    es: 'El año "desde" debe ser menor o igual que "hasta"',
  },
  'search.genre': {
    en: '🎭 Genre',
    uk: '🎭 Жанр',
    no: '🎭 Sjanger',
    es: '🎭 Género',
  },
  'search.anyGenre': {
    en: '🌎 Any Genre',
    uk: '🌎 Будь-який жанр',
    no: '🌎 Hvilken som helst sjanger',
    es: '🌎 Cualquier género',
  },
  'search.genres.action': {
    en: 'Action',
    uk: 'Бойовик',
    no: 'Action',
    es: 'Acción',
  },
  'search.genres.adventure': {
    en: 'Adventure',
    uk: 'Пригоди',
    no: 'Eventyr',
    es: 'Aventura',
  },
  'search.genres.animation': {
    en: 'Animation',
    uk: 'Анімація',
    no: 'Animasjon',
    es: 'Animación',
  },
  'search.genres.biography': {
    en: 'Biography',
    uk: 'Біографія',
    no: 'Biografi',
    es: 'Biografía',
  },
  'search.genres.comedy': {
    en: 'Comedy',
    uk: 'Комедія',
    no: 'Komedie',
    es: 'Comedia',
  },
  'search.genres.crime': {
    en: 'Crime',
    uk: 'Кримінал',
    no: 'Kriminal',
    es: 'Crimen',
  },
  'search.genres.documentary': {
    en: 'Documentary',
    uk: 'Документальний',
    no: 'Dokumentar',
    es: 'Documental',
  },
  'search.genres.drama': {
    en: 'Drama',
    uk: 'Драма',
    no: 'Drama',
    es: 'Drama',
  },
  'search.genres.family': {
    en: 'Family',
    uk: 'Сімейний',
    no: 'Familie',
    es: 'Familia',
  },
  'search.genres.fantasy': {
    en: 'Fantasy',
    uk: 'Фантастика',
    no: 'Fantasy',
    es: 'Fantasía',
  },
  'search.genres.horror': {
    en: 'Horror',
    uk: 'Жахи',
    no: 'Skrekk',
    es: 'Terror',
  },
  'search.genres.music': {
    en: 'Music',
    uk: 'Музика',
    no: 'Musikk',
    es: 'Música',
  },
  'search.genres.mystery': {
    en: 'Mystery',
    uk: 'Детектив',
    no: 'Mysterium',
    es: 'Misterio',
  },
  'search.genres.romance': {
    en: 'Romance',
    uk: 'Романтика',
    no: 'Romantikk',
    es: 'Romance',
  },
  'search.genres.sciFi': {
    en: 'Sci-Fi',
    uk: 'Наукова фантастика',
    no: 'Sci-Fi',
    es: 'Ciencia ficción',
  },
  'search.genres.sport': {
    en: 'Sport',
    uk: 'Спорт',
    no: 'Sport',
    es: 'Deporte',
  },
  'search.genres.thriller': {
    en: 'Thriller',
    uk: 'Трилер',
    no: 'Thriller',
    es: 'Suspense',
  },
  'search.genres.war': {
    en: 'War',
    uk: 'Військовий',
    no: 'Krig',
    es: 'Guerra',
  },
  'search.genres.western': {
    en: 'Western',
    uk: 'Вестерн',
    no: 'Western',
    es: 'Occidental',
  },
  'search.searchGenre': {
    en: 'Search genre...',
    uk: 'Пошук жанру...',
    no: 'Søk sjanger...',
    es: 'Buscar género...',
  },
  'search.noGenresFound': {
    en: 'No genres found',
    uk: 'Жанрів не знайдено',
    no: 'Ingen sjangere funnet',
    es: 'No se encontraron géneros',
  },
  'search.popularSearches': {
    en: '🔥 Popular Searches',
    uk: '🔥 Популярні пошуки',
    no: '🔥 Populære søk',
    es: '🔥 Búsquedas populares',
  },

  // Results
  'results.found': {
    en: 'Found',
    uk: 'Знайдено',
    no: 'Fant',
    es: 'Encontrado',
  },
  'results.results': {
    en: 'results with posters',
    uk: 'результатів з постерами',
    no: 'resultater med plakater',
    es: 'resultados con carteles',
  },
  'results.for': {
    en: 'for',
    uk: 'для',
    no: 'for',
    es: 'para',
  },
  'results.hidden': {
    en: 'hidden without posters',
    uk: 'приховано без постерів',
    no: 'skjult uten plakater',
    es: 'oculto sin carteles',
  },
  'results.showingPopular': {
    en: 'Showing popular movies. Use the search above to find specific movies.',
    uk: 'Показано популярні фільми. Використовуйте пошук вище, щоб знайти конкретні фільми.',
    no: 'Viser populære filmer. Bruk søket over for å finne spesifikke filmer.',
    es: 'Mostrando películas populares. Utilice la búsqueda de arriba para encontrar películas específicas.',
  },
  'results.noResults': {
    en: 'No Results Found',
    uk: 'Результатів не знайдено',
    no: 'Ingen resultater funnet',
    es: 'No se han encontrado resultados',
  },
  'results.tryChanging': {
    en: 'Try changing your search terms or filters',
    uk: 'Спробуйте змінити умови пошуку або фільтри',
    no: 'Prøv å endre søkeordene eller filtrene',
    es: 'Intenta cambiar tus términos de búsqueda o filtros',
  },
  'results.error': {
    en: 'Search Error',
    uk: 'Помилка пошуку',
    no: 'Søkefeil',
    es: 'Error de búsqueda',
  },
  'results.tryAgain': {
    en: 'Try Again',
    uk: 'Спробувати знову',
    no: 'Prøv igjen',
    es: 'Intentar de nuevo',
  },

  // Movie Card
  'movie.details': {
    en: '📖 Details',
    uk: '📖 Деталі',
    no: '📖 Detaljer',
    es: '📖 Detalles',
  },
  'movie.close': {
    en: 'Close',
    uk: 'Закрити',
    no: 'Lukk',
    es: 'Cerrar',
  },
  'movie.plot': {
    en: 'Plot',
    uk: 'Сюжет',
    no: 'Handling',
    es: 'Trama',
  },
  'movie.genre': {
    en: 'Genre',
    uk: 'Жанр',
    no: 'Sjanger',
    es: 'Género',
  },
  'movie.director': {
    en: 'Director',
    uk: 'Режисер',
    no: 'Regissør',
    es: 'Director',
  },
  'movie.releaseDate': {
    en: 'Release Date',
    uk: 'Дата випуску',
    no: 'Utgivelsesdato',
    es: 'Fecha de lanzamiento',
  },
  'movie.country': {
    en: 'Country',
    uk: 'Країна',
    no: 'Land',
    es: 'País',
  },
  'movie.cast': {
    en: 'Cast',
    uk: 'В ролях',
    no: 'Rollebesetning',
    es: 'Elenco',
  },
  'movie.series': {
    en: 'Series',
    uk: 'Серіал',
    no: 'Serie',
    es: 'Serie',
  },
  'movie.seasons': {
    en: 'Seasons:',
    uk: 'Сезонів:',
    no: 'Sesonger:',
    es: 'Temporadas:',
  },
  'movie.episodesInSeason': {
    en: 'Episodes in season 1:',
    uk: 'Серій у 1 сезоні:',
    no: 'Episoder i sesong 1:',
    es: 'Episodios en la temporada 1:',
  },
  'movie.loadingEpisodes': {
    en: 'Loading episode information...',
    uk: 'Завантаження інформації про серії...',
    no: 'Laster episodeinformasjon...',
    es: 'Cargando información del episodio...',
  },
  'movie.openImdb': {
    en: 'Open on IMDb',
    uk: 'Відкрити в IMDb',
    no: 'Åpne på IMDb',
    es: 'Abrir en IMDb',
  },
  'movie.season': {
    en: 'season',
    uk: 'сезон',
    no: 'sesong',
    es: 'temporada',
  },
  'movie.seasons2': {
    en: 'seasons',
    uk: 'сезони',
    no: 'sesonger',
    es: 'temporadas',
  },
  'movie.seasons3': {
    en: 'seasons',
    uk: 'сезонів',
    no: 'sesonger',
    es: 'temporadas',
  },
  'movie.infoUnavailable': {
    en: 'Information unavailable',
    uk: 'Інформація недоступна',
    no: 'Informasjon utilgjengelig',
    es: 'Información no disponible',
  },
  'movie.watchOnline': {
    en: 'Watch online',
    uk: 'Дивитися онлайн',
    no: 'Se på nett',
    es: 'Ver en línea',
  },
  'movie.loadingStream': {
    en: 'Loading player...',
    uk: 'Завантаження плеєра...',
    no: 'Laster avspilleren...',
    es: 'Cargando reproductor...',
  },
  'movie.noStream': {
    en: 'Streaming links are currently unavailable.',
    uk: 'Потокові посилання наразі недоступні.',
    no: 'Strømmelenker er for øyeblikket utilgjengelige.',
    es: 'Los enlaces de transmisión no están disponibles actualmente.',
  },
  'movie.streamError': {
    en: 'Failed to load stream',
    uk: 'Не вдалося завантажити потік',
    no: 'Kunne ikke laste strømmen',
    es: 'Error al cargar la transmisión',
  },

  // Pagination
  'pagination.page': {
    en: 'Page',
    uk: 'Сторінка',
    no: 'Side',
    es: 'Página',
  },
  'pagination.of': {
    en: 'of',
    uk: 'з',
    no: 'av',
    es: 'de',
  },
  'pagination.pages': {
    en: 'pages',
    uk: 'сторінок',
    no: 'sider',
    es: 'páginas',
  },
  'pagination.results': {
    en: 'results',
    uk: 'результатів',
    no: 'resultater',
    es: 'resultados',
  },
  'pagination.previous': {
    en: 'Previous',
    uk: 'Попередня',
    no: 'Forrige',
    es: 'Anterior',
  },
  'pagination.next': {
    en: 'Next',
    uk: 'Наступна',
    no: 'Neste',
    es: 'Siguiente',
  },
  'pagination.start': {
    en: 'Start',
    uk: 'Початок',
    no: 'Start',
    es: 'Comienzo',
  },
  'pagination.end': {
    en: 'End',
    uk: 'Кінець',
    no: 'Slutt',
    es: 'Fin',
  },
  'pagination.complete': {
    en: 'complete',
    uk: 'завершено',
    no: 'fullført',
    es: 'completo',
  },

  // Sort
  'sort.sortBy': {
    en: 'Sort by',
    uk: 'Сортувати за',
    no: 'Sorter etter',
    es: 'Ordenar por',
  },
  'sort.default': {
    en: 'Default',
    uk: 'За замовчуванням',
    no: 'Standard',
    es: 'Defecto',
  },
  'sort.ratingDesc': {
    en: 'Rating (High to Low)',
    uk: 'Рейтинг (Високий до Низького)',
    no: 'Rangering (Høy til Lav)',
    es: 'Calificación (de mayor a menor)',
  },
  'sort.ratingAsc': {
    en: 'Rating (Low to High)',
    uk: 'Рейтинг (Низький до Високого)',
    no: 'Rangering (Lav til Høy)',
    es: 'Calificación (de menor a mayor)',
  },
  'sort.yearDesc': {
    en: 'Year (Newest First)',
    uk: 'Рік (Новіші спочатку)',
    no: 'År (Nyeste først)',
    es: 'Año (más reciente primero)',
  },
  'sort.yearAsc': {
    en: 'Year (Oldest First)',
    uk: 'Рік (Старіші спочатку)',
    no: 'År (Eldste først)',
    es: 'Año (más antiguo primero)',
  },
  'sort.titleAsc': {
    en: 'Title (A-Z)',
    uk: 'Назва (А-Я)',
    no: 'Tittel (A-Å)',
    es: 'Título (A-Z)',
  },
  'sort.titleDesc': {
    en: 'Title (Z-A)',
    uk: 'Назва (Я-А)',
    no: 'Tittel (Å-A)',
    es: 'Título (Z-A)',
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

