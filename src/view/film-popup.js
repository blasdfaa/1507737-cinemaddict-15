import { getListFromArr, isOnline } from '../utils/common';
import { getDurationTime, getFormatDate, getRelativeTimeFromDate } from '../utils/date';
import he from 'he';
import SmartView from './smart';
import { emojiList } from '../utils/const';

const createCommentItemTemplate = (commentsData = {}) => {
  const { id, author, date, emotion, comment } = commentsData;

  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">
            ${getRelativeTimeFromDate(date)}
          </span>
          <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createEmojiItemTemplate = (selectEmoji, emotion) =>
  `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${selectEmoji === emotion ? 'checked' : ''}
   >
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>
  `;

const generateEmojiList = (selectedEmoji, emotionArr) =>
  emotionArr.map((emoji) => createEmojiItemTemplate(selectedEmoji, emoji)).join('');

const filmPopupTemplate = (data, commentsItems) => {
  const {
    comments,
    commentText,
    emotion,
    title,
    alternativeTitle,
    description,
    poster,
    filmRating,
    ageRating,
    genres,
    director,
    writers,
    actors,
    runtime,
    releaseDate,
    releaseCountry,
    isFavorite,
    isWatchlist,
    isViewed,
    isDisabled,
    isUpdating,
  } = data;

  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  const getGenresList = (filmGenres) =>
    filmGenres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const watchlistClass = isWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const viewedClass = isViewed
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClass = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  const commentItemsTemplate = commentsItems ?
    commentsItems.map((comment) => createCommentItemTemplate(comment)).join('')
    : '';

  const createCommentsList = (commentsItem, itemTemplate) =>
    commentsItem.length
      ? `<ul class="film-details__comments-list">
          ${itemTemplate}
        </ul>`
      : '';

  const createEmojisPreview = (emojiName) =>
    emojiName ? `<img src="./images/emoji/${emojiName}.png" width="55" height="55" alt="emoji">` : '';

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${getListFromArr(writers)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${getListFromArr(actors)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getFormatDate(releaseDate, 'DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getDurationTime(runtime, 'minute')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
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
          <button
            type="button"
            class="film-details__control-button ${watchlistClass}"
            id="watchlist"
            name="watchlist"
            ${isDisabled || isUpdating ? 'disabled' : ''}
          >
            ${isUpdating ? 'Updating...' : 'Add to watchlist'}
            </button>
          <button
            type="button"
            class="film-details__control-button ${viewedClass}"
            id="watched"
            name="watched"
            ${isDisabled || isUpdating ? 'disabled' : ''}
          >
            ${isUpdating ? 'Updating...' : 'Already watched'}
          </button>
          <button
            type="button"
            class="film-details__control-button ${favoriteClass}"
            id="favorite"
            name="favorite"
            ${isDisabled || isUpdating ? 'disabled' : ''}
          >
            ${isUpdating ? 'Updating...' : 'Add to favorites'}
          </button>
        </section>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              Comments <span class="film-details__comments-count">${comments.length}</span>
            </h3>
            ${createCommentsList(commentItemsTemplate, commentItemsTemplate)}
            <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${createEmojisPreview(emotion)}
            </div>

            <label class="film-details__comment-label">
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
              >${commentText ? commentText : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${generateEmojiList(emotion, emojiList)}
            </div>
          </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();

    this._data = FilmPopup.parseFilmToData(film);
    this._comments = comments;

    this._scrollPopupHandler = this._scrollPopupHandler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._viewedClickHadler = this._viewedClickHadler.bind(this);
    this._favoriteClickHadler = this._favoriteClickHadler.bind(this);
    this._watchlistClickHadler = this._watchlistClickHadler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return {
      ...film,
      scrollPosition: 0,
    };
  }

  getTemplate() {
    return filmPopupTemplate(this._data, this._comments);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setPresenterHandlers();
  }

  getScrollPosition() {
    return this._data.scrollPosition;
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _viewedClickHadler(evt) {
    evt.preventDefault();
    this._callback.viewedClick(this._data);
  }

  _favoriteClickHadler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(this._data);
  }

  _watchlistClickHadler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(this._data);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: he.escape(evt.target.value),
    }, true);
  }

  _emojiChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value,
    });

    this.renderElement().scrollTo(0, this._data.scrollPosition);
  }

  _scrollPopupHandler(evt) {
    this.updateData({
      scrollPosition: evt.target.scrollTop,
    }, true);
  }

  _commentSubmitHandler(evt) {
    if (evt.key === 'Enter' && evt.metaKey || evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (!isOnline()) {
        this.shake();
        return;
      }

      if (!this._data.commentText || !this._data.emotion) {
        this.shake();
        return;
      }

      const input = this.renderElement().querySelector('.film-details__comment-input');
      const emotionList = this.renderElement().querySelectorAll('.film-details__emoji-item');

      this._callback.commentSubmit(this._data, input, emotionList);
      document.removeEventListener('keydown', this._commentSubmitHandler);
    }
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();

    if (!isOnline()) {
      this.shake();
      return;
    }

    const buttons = this.renderElement().querySelectorAll('.film-details__comment-delete');
    this._callback.deleteComment(evt.target.dataset.commentId, evt.target, buttons);
  }

  setClosePopupClickHandler(callback) {
    this._callback.click = callback;
    this.renderElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupClickHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.deleteComment = callback;
    this.renderElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach(
        (comment) =>
          comment.addEventListener('click', this._commentDeleteClickHandler));
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    document.addEventListener('keydown', this._commentSubmitHandler);
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
    if (this.renderElement().querySelector('.film-details__comment-input')) {
      this.renderElement()
        .querySelector('.film-details__comment-input')
        .addEventListener('input', this._commentInputHandler);
      this.renderElement()
        .querySelector('.film-details__emoji-list')
        .addEventListener('click', this._emojiChangeHandler);
    }

    this.renderElement()
      .addEventListener('scroll', this._scrollPopupHandler);
  }

  _setPresenterHandlers() {
    this.setClosePopupClickHandler(this._callback.click);
    this.setViewedClickHadler(this._callback.viewedClick);
    this.setWatchlistClickHadler(this._callback.watchlistClick);
    this.setFavoriteClickHadler(this._callback.favoriteClick);
    this.setCommentDeleteClickHandler(this._callback.deleteComment);
    this.setCommentSubmitHandler(this._callback.commentSubmit);
  }
}
