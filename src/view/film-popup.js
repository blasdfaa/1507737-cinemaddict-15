import { createElement, getDurationTime, getFormatDate, getListFromArr } from '../utils/utils.js';

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

export default class FilmPopup {
  constructor() {
    this._element = null;
  }

  getTemplate(film) {
    document.querySelector('body').classList.add('hide-overflow');

    return filmPopupTemplate(film);
  }

  renderElement(film) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(film));
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    this._element = null;
  }
}

