import { getListFromArr } from '../utils/common';
import { getDurationTime, getFormatDate, getRelativeTimeFromDate } from '../utils/date';
import he from 'he';
import SmartView from './smart';
import { emojiList } from '../utils/const';

const createCommentItemTemplate = (commentsData = {}) => {
  const { id, author, date, emotion, comment } = commentsData;

  return `<li class="film-details__comment" data-comment-id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
      <div>
        <p class="film-details__comment-text">${he.escape(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">
            ${getRelativeTimeFromDate(date)}
          </span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
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
    localComment: { commentText, emotion },
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

  const commentItemsTemplate = commentsItems
    .map((comment) => createCommentItemTemplate(comment))
    .join('');

  const createCommentsTitle = (commentsLength) =>
    commentsLength
      ? `<h3 class="film-details__comments-title">
          Comments <span class="film-details__comments-count">${commentsLength}</span>
        </h3>`
      : '';

  const createCommentsList = (commentsItem, itemTemplate) =>
    commentsItem.length
      ? `<ul class="film-details__comments-list">
          ${itemTemplate}
        </ul>`
      : '';

  const createEmojisPreview = (emojiName) =>
    emojiName ? `<img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">` : '';

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
            ${createCommentsTitle(comments.length)}
            ${createCommentsList(commentItemsTemplate, commentItemsTemplate)}
            <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${createEmojisPreview(emotion)}
            </div>

            <label class="film-details__comment-label">
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here" name="comment"
              >
                ${commentText ? commentText : ''}
              </textarea>
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

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._viewedClickHadler = this._viewedClickHadler.bind(this);
    this._favoriteClickHadler = this._favoriteClickHadler.bind(this);
    this._watchlistClickHadler = this._watchlistClickHadler.bind(this);
    this._viewedToggleHadler = this._viewedToggleHadler.bind(this);
    this._favoriteToggleHadler = this._favoriteToggleHadler.bind(this);
    this._watchlistToggleHadler = this._watchlistToggleHadler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return {
      ...film,
      isDisabled: false,
      isUpdating: false,
      localComment: {
        commentText: '',
        emotion: '',
      },
    };
  }

  static parseDataToFilm(data) {
    data = { ...data };

    delete data.isDisabled;
    delete data.isUpdating;

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
    this._setPresenterHandlers();
  }

  _getScrollPostiton() {
    return this.renderElement().scrollTop;
  }

  _setScrollPosition(value) {
    this.renderElement().scrollTop = value;
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _viewedClickHadler(evt) {
    evt.preventDefault();
    this._callback.viewedClick();
  }

  _viewedToggleHadler(evt) {
    evt.preventDefault();
    const scroll = this._getScrollPostiton();

    this.updateData({
      ...this._data,
      isViewed: !this._data.isViewed,
    });

    this._setScrollPosition(scroll);
  }

  _favoriteClickHadler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _favoriteToggleHadler(evt) {
    evt.preventDefault();
    const scroll = this._getScrollPostiton();

    this.updateData({
      ...this._data,
      isFavorite: !this._data.isFavorite,
    });

    this._setScrollPosition(scroll);
  }

  _watchlistClickHadler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchlistToggleHadler(evt) {
    evt.preventDefault();
    const scroll = this._getScrollPostiton();

    this.updateData({
      ...this._data,
      isWatchlist: !this._data.isWatchlist,
    });

    this._setScrollPosition(scroll);
  }

  _commentInputHandler(evt) {
    this.updateData(
      {
        ...this._data,
        localComment: {
          ...this._data.localComment,
          commentText: he.escape(evt.target.value),
        },
      },
      true,
    );
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();

    if (this._data.localComment.emotion === evt.target.value) {
      return;
    }

    if (evt.target.tagName === 'INPUT') {
      this.updateData({
        ...this._data,
        localComment: {
          ...this._data.localComment,
          emotion: evt.target.value,
        },
      });

      this.renderElement().querySelector('.film-details__comment-input').value =
        this._data.localComment.commentText;
    }
  }

  _commentSubmitHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'TEXTAREA') {
      return;
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      this._callback.commentSubmit(FilmPopup.parseDataToFilm(this._data));
      document.removeEventListener('keydown', this._commentSubmitHandler);
    }
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();
    const commentElement = evt.target.closest('.film-details__comment');

    this._callback.deleteComment(
      commentElement.dataset.commentId,
      FilmPopup.parseDataToFilm(this._data),
    );
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
      .querySelector('.film-details__comment-delete')
      .addEventListener('click', this._commentDeleteClickHandler);
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
    this.renderElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._viewedToggleHadler);
    this.renderElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteToggleHadler);
    this.renderElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._watchlistToggleHadler);
    this.renderElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
    this.renderElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emojiChangeHandler);
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
