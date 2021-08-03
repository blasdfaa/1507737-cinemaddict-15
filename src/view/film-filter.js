const filmFilterMap = {
  'All movies': (films) => films.filter((film) => film),
  'Watchlist': (films) => films
    .filter((film) => film.userInfo.inWatchlist).length,
  'History': (films) => films
    .filter((film) => film.userInfo.isViewed).length,
  'Favorites': (films) => films
    .filter((film) => film.userInfo.isFavorite).length,
};

export const generateFilmsFilter = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
