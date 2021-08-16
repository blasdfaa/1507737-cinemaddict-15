import AbstractView from './abstract';
import { getListFromArr } from '../utils/common.js';
import { getDurationTime, getFormatDate } from '../utils/date';
import { createElement } from '../utils/render';

const filmPopupTemplate = (film) => {
  const { title, poster, description, date, rating, details, genres } = film;

  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  const getGenresList = (filmGenres) => filmGenres.map(
    (genre) =>
      `<span class="film-details__genre">${genre}</span>`,
  ).join('');

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster} alt="${title}">

              <p class="film-details__age">${details.age}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${details.originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${details.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${getListFromArr(details.writers)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${getListFromArr(details.actors)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getFormatDate(date.release, 'DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getDurationTime(date.runtime, 'minute')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${details.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genresTitle}</td>
                  <td class="film-details__cell">${getGenresList(genres)}</tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopup extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
  }

  getTemplate() {
    return filmPopupTemplate(this._film);
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._film = null;
    super.removeElement();
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();

    this.removeElement();
    this._callback.click();
  }

  setClosePopupClickHandler(callback) {
    const closeButton = this.renderElement().querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this._closePopupClickHandler);

    this._callback.click = callback;
  }
}

