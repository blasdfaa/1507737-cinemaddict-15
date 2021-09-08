const filmFilterMap = {
  'All movies': (films) => films.filter((film) => film),
  'Watchlist': (films) => films
    .filter((film) => film.userDetails.isWatchlist).length,
  'History': (films) => films
    .filter((film) => film.userDetails.isViewed).length,
  'Favorites': (films) => films
    .filter((film) => film.userDetails.isFavorite).length,
};

export const generateFilmsFilter = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
