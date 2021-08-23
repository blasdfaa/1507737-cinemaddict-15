import { getListFromArr } from '../utils/common.js';
import { getDurationTime, getFormatDate } from '../utils/date';
import SmartView from './smart';

const createCommentItemTemplate = (commentsData = {}) => {
  const { author, date, emoji, text } = commentsData;

  return `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
        </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">
            ${getFormatDate(date, 'YYYY/MM/DD HH:MM')}
          </span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

const filmPopupTemplate = (data, commentsItems) => {
  const {
    title,
    poster,
    description,
    date,
    rating,
    details,
    genres,
    inWatchlist,
    isViewed,
    isFavorite,
    comments,
    isEmoji,
    emojiName,
  } = data;

  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  const getGenresList = (filmGenres) =>
    filmGenres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const watchlistClass = inWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const viewedClass = isViewed
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClass = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  const commentItemsTemplate = commentsItems.map((comment) => createCommentItemTemplate(comment)).join('');

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
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${viewedClass}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">
            Add to favorites
          </button>
        </section>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              Comments <span class="film-details__comments-count">${comments.length}</span>
            </h3>
            ${commentItemsTemplate.length ? `<ul class="film-details__comments-list">${commentItemsTemplate}</ul>` : ''}

            <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${isEmoji ? `<img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden"
                     name="comment-emoji"
                     type="radio"
                     id="emoji-smile"
                     value="smile"
                     ${emojiName === 'smile' ? 'checked' : ''}
                     >
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden"
                     name="comment-emoji"
                     type="radio"
                     id="emoji-sleeping"
                     value="sleeping"
                     ${emojiName === 'sleeping' ? 'checked' : ''}
                     >
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden"
                     name="comment-emoji"
                     type="radio"
                     id="emoji-puke"
                     value="puke"
                     ${emojiName === 'puke' ? 'checked' : ''}
                     >
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden"
                     name="comment-emoji"
                     type="radio"
                     id="emoji-angry"
                     value="angry"
                     ${emojiName === 'angry' ? 'checked' : ''}
                     >
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();

    this._data = FilmPopup.parseFilmToData(film);
    this._comments = comments;

    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentEmojiChangeHandler = this._commentEmojiChangeHandler.bind(this);
    this._viewedClickHadler = this._viewedClickHadler.bind(this);
    this._favoriteClickHadler = this._favoriteClickHadler.bind(this);
    this._watchlistClickHadler = this._watchlistClickHadler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return { ...film, isEmoji: false, emojiName: null, isCommented: false, commentText: '' };
  }

  static parseDataToFilm(data) {
    data = { ...data };

    if (!data.isEmoji) {
      data.emojiName = '';
    }

    if (!data.isCommented) {
      data.commentText = '';
    }

    delete data.isEmoji;
    delete data.isCommented;

    return data;
  }

  reset(film) {
    this.updateData(FilmPopup.parseDataToFilm(film));
  }

  getTemplate() {
    return filmPopupTemplate(this._data, this._comments);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.click);
    this.setCommentSubmitHandler(this._callback.commentSubmit);
    this.setViewedClickHadler(this._callback.viewedClick);
    this.setWatchlistClickHadler(this._callback.watchlistClick);
    this.setFavoriteClickHadler(this._callback.favoriteClick);
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClosePopupClickHandler(callback) {
    this.renderElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupClickHandler);
    this._callback.click = callback;
  }

  _viewedClickHadler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      isViewed: !this._data.isViewed,
      scrollPosition: this.renderElement().scrollTop,
    });

    this._callback.viewedClick();
    this.renderElement().scrollTop = this._data.scrollPosition;

  }

  _favoriteClickHadler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      isFavorite: !this._data.isFavorite,
      scrollPosition: this.renderElement().scrollTop,
    });

    this._callback.favoriteClick();
    this.renderElement().scrollTop = this._data.scrollPosition;
  }

  _watchlistClickHadler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      inWatchlist: !this._data.inWatchlist,
      scrollPosition: this.renderElement().scrollTop,
    });

    this._callback.watchlistClick();
    this.renderElement().scrollTop = this._data.scrollPosition;
  }

  _commentInputHandler(evt) {
    this.updateData({ ...this._data, commentText: evt.target.value }, true);
  }

  _commentEmojiChangeHandler(evt) {
    evt.preventDefault();
    if (this._data.emojiName === evt.target.value) {
      return;
    }

    if (evt.target.tagName === 'INPUT') {
      this.updateData({
        ...this._data,
        isEmoji: true,
        emojiName: evt.target.value,
        scrollPosition: this.renderElement().scrollTop,
      });

      this.renderElement().querySelector('.film-details__comment-input').value = this._data.commentText;
      this.renderElement().scrollTop = this._data.scrollPosition;
    }
  }

  _commentSubmitHandler(evt) {
    evt.preventDefault();
    if (evt.ctrlKey && evt.key === 'Enter') {
      this._callback.commentSubmit(this._data);
    }
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.renderElement()
      .querySelector('.film-details__inner')
      .addEventListener('submit', this._commentSubmitHandler);
  }

  setViewedClickHadler(callback) {
    this._callback.viewedClick = callback;
    this.renderElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._viewedClickHadler);
  }

  setFavoriteClickHadler(callback) {
    this._callback.favoriteClick = callback;
    this.renderElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteClickHadler);
  }

  setWatchlistClickHadler(callback) {
    this._callback.watchlistClick = callback;
    this.renderElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._watchlistClickHadler);
  }

  _setInnerHandlers() {
    this.renderElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
    this.renderElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._commentEmojiChangeHandler);
  }
}
