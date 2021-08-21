const filmFilterMap = {
  'All movies': (films) => films.filter((film) => film),
  'Watchlist': (films) => films
    .filter((film) => film.inWatchlist).length,
  'History': (films) => films
    .filter((film) => film.isViewed).length,
  'Favorites': (films) => films
    .filter((film) => film.isFavorite).length,
};

export const generateFilmsFilter = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
