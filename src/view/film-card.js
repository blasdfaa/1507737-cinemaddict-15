import { createElement, getDurationTime, getFormatDate, sliceDescription } from '../utils/utils.js';

const filmCardTemplate = (film) => {
  const { title, poster, description, date, genres, rating, comments, userInfo } = film;

  const setRatingClass = () => {
    if (rating < 4) {
      return 'film-card__rating--poor';
    } else if (rating > 4 && rating < 6) {
      return 'film-card__rating--average';
    }

    return 'film-card__rating--good';
  };

  const watchlistClass = userInfo.inWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const favoriteClass = userInfo.isFavorite
    ? 'film-card__controls-item--favorite  film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const viewedClass = userInfo.isViewed
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

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return filmCardTemplate(this._film);
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
