import AbstractObserver from '../utils/abstract-observer';
import { EXTRA_FILM_CARDS_COUNT, TOP_RATED_COUNT } from '../utils/const';

export default class Films extends AbstractObserver {
  constructor() {
    super();

    this._films = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(updateType, films) {
    this._films = [...films];

    this._notify(updateType);
  }

  getRatedFilms() {
    return [...this._films]
      .filter((film) => film.filmRating > TOP_RATED_COUNT)
      .sort((a, b) => (b.filmRating > a.filmRating ? 1 : -1))
      .slice(0, EXTRA_FILM_CARDS_COUNT);
  }

  getCommentedFilms() {
    return [...this._films]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_FILM_CARDS_COUNT);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      return;
    }

    this._films = [...this._films.slice(0, index), update, ...this._films.slice(index + 1)];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = {
      ...film,
      title: film['film_info'].title,
      alternativeTitle: film['film_info']['alternative_title'],
      description: film['film_info'].description,
      poster: film['film_info'].poster,
      filmRating: film['film_info']['total_rating'],
      ageRating: film['film_info']['age_rating'],
      genres: [...film['film_info'].genre],
      director: film['film_info'].director,
      writers: [...film['film_info'].writers],
      actors: [...film['film_info'].actors],
      runtime: film['film_info'].runtime,
      releaseDate:
        film['film_info'].release.date !== null
          ? new Date(film['film_info'].release.date)
          : film['film_info'].release.date,
      releaseCountry: film['film_info'].release['release_country'],
      isFavorite: film['user_details']['favorite'],
      isWatchlist: film['user_details']['watchlist'],
      isViewed: film['user_details']['already_watched'],
      watchingDate:
        film['user_details']['watching_date'] !== null
          ? new Date(film['user_details']['watching_date'])
          : film['user_details']['watching_date'],
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        title: film.title,
        ['alternative_title']: film.alternativeTitle,
        description: film.description,
        poster: film.poster,
        ['total_rating']: film.filmRating,
        ['age_rating']: film.ageRating,
        genre: [...film.genres],
        director: film.director,
        writers: [...film.writers],
        actors: [...film.actors],
        runtime: film.runtime,
        release: {
          date: film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
          ['release_country']: film.releaseCountry,
        },
      },
      ['user_details']: {
        favorite: film.isFavorite,
        watchlist: film.isWatchlist,
        ['already_watched']: film.isViewed,
        ['watching_date']: film.watchingDate instanceof Date ? film.watchingDate.toISOString() : null,
      },
    };

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.poster;
    delete adaptedFilm.filmRating;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.genres;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.runtime;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.releaseCountry;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isViewed;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }
}
