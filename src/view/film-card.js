import AbstractView from './abstract';
import { sliceDescription } from '../utils/common.js';
import { getDurationTime, getFormatDate } from '../utils/date';

const filmCardTemplate = (film) => {
  const {
    title,
    poster,
    description,
    date,
    genres,
    rating,
    comments,
    inWatchlist,
    isFavorite,
    isViewed,
  } = film;

  const setRatingClass = () => {
    if (rating < 4) {
      return 'film-card__rating--poor';
    } else if (rating > 4 && rating < 6) {
      return 'film-card__rating--average';
    }

    return 'film-card__rating--good';
  };

  const watchlistClass = inWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const favoriteClass = isFavorite
    ? 'film-card__controls-item--favorite  film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const viewedClass = isViewed
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating ${setRatingClass()}">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormatDate(date.releaseDate, 'YYYY')}</span>
        <span class="film-card__duration">${getDurationTime(date.runtime, 'minute')}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src=${poster} alt="${title}" class="film-card__poster">
      <p class="film-card__description">${sliceDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${watchlistClass}" type="button">Add to watchlist </button>
        <button class="film-card__controls-item ${viewedClass}" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${favoriteClass}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._viewedClickHadler = this._viewedClickHadler.bind(this);
    this._favoriteClickHadler = this._favoriteClickHadler.bind(this);
    this._watchlistClickHadler = this._watchlistClickHadler.bind(this);
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
  }

  getTemplate() {
    return filmCardTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    const target = evt.target;
    if (target.matches('.film-card__poster')
      || target.matches('.film-card__title')
      || target.matches('.film-card__comments')) {
      this._callback.click();
    }
  }

  _viewedClickHadler(evt) {
    evt.preventDefault();
    this._callback.viewedClick();
  }

  _favoriteClickHadler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHadler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setFilmCardClickHandler(callback) {
    this._callback.click = callback;
    this.renderElement().addEventListener('click', this._filmCardClickHandler);
  }

  setViewedClickHadler(callback) {
    this._callback.viewedClick = callback;
    this.renderElement()
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._viewedClickHadler);
  }

  setFavoriteClickHadler(callback) {
    this._callback.favoriteClick = callback;
    this.renderElement()
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHadler);
  }

  setWatchlistClickHadler(callback) {
    this._callback.watchlistClick = callback;
    this.renderElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHadler);
  }
}
