import { removeComponent, render, replace } from '../utils/render';
import { CardMode, RenderPosition, UpdateType, UserAction } from '../utils/const';
import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import CommentsModel from '../model/comments';

export const State = {
  UPDATING: 'UPDATING',
  ABORTING: 'ABORTING',
};

export default class FilmCard {
  constructor(filmContainer, changeData, changeMode, filterType, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterType = filterType;
    this._api = api;

    this._filmCardComponent = null;
    this._commentsList = null;

    this._switchViewedClickHadler = this._switchViewedClickHadler.bind(this);
    this._switchFavoriteClickHadler = this._switchFavoriteClickHadler.bind(this);
    this._switchWatchlistClickHadler = this._switchWatchlistClickHadler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._mode = CardMode.CLOSE;
    this.body = document.querySelector('body');
  }

  init(film, comments) {
    this._film = film;
    this._commentsModel = new CommentsModel();

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setFilmCardClickHandler(() => this._renderFilmPopup(film, comments));
    this._filmCardComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmCardComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmCardComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmCardComponent.renderElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    removeComponent(prevFilmCardComponent);
  }

  resetView() {
    if (this._mode !== CardMode.CLOSE) {
      this._hidePopup();
    }
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  getScrollPostiton() {
    return this.renderElement().scrollTop;
  }

  setScrollPosition(value) {
    this.renderElement().scrollTop = value;
  }

  setViewState(state) {
    if (this._mode === CardMode.CLOSE) {
      return;
    }

    const resetPopupState = () => {
      this._filmCardComponent.updateData({
        isDisabled: false,
        isUpdating: false,
      });
      this._filmPopupComponent.updateData({
        isDisabled: false,
        isUpdating: false,
      });
    };

    switch (state) {
      case State.UPDATING:
        this._filmCardComponent.updateData({
          isDisabled: true,
          isUpdating: true,
        });
        this._filmPopupComponent.updateData({
          isDisabled: true,
          isUpdating: true,
        });
        break;
      case State.ABORTING:
        this._filmCardComponent.shake(resetPopupState);
        this._filmPopupComponent.shake(resetPopupState);
        break;
    }
  }

  _getCommetsDataByFilmId(filmId) {
    return this._api.getCommentsList(filmId);
  }

  async _renderFilmPopup(film) {
    if (this._filmPopupComponent) {
      this._hidePopup();
    }

    if (this._commentsList === null) {
      this._commentsList = await this._getCommetsDataByFilmId(film);
    }

    this._filmPopupComponent = new FilmPopupView(film, this._commentsList);

    this._showPopup();
    this.body.classList.add('hide-overflow');

    this._filmPopupComponent.setClosePopupClickHandler(this._hidePopup);
    this._filmPopupComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmPopupComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmPopupComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);
    this._filmPopupComponent.setCommentDeleteClickHandler(this._commentDeleteClickHandler);
    this._filmPopupComponent.setCommentSubmitHandler(this._commentSubmitHandler);
  }

  _hidePopup() {
    removeComponent(this._filmPopupComponent);
    document.removeEventListener('keydown', this._closePopupEscKeyHandler);
    this.body.classList.remove('hide-overflow');
    this._mode = CardMode.CLOSE;
  }

  _showPopup() {
    render(this.body, this._filmPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._closePopupEscKeyHandler);
    this._changeMode();
    this._mode = CardMode.OPEN;
  }

  _closePopupEscKeyHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._filmPopupComponent.renderElement().querySelector('.film-details__inner').reset();
      this._hidePopup();
    }
  }

  _switchViewedClickHadler() {
    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'History';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(UserAction.UPDATE_FILM, currentFilterType ? UpdateType.PATCH : UpdateType.MINOR, {
      ...this._film,
      isViewed: !this._film.isViewed,
      wathingDate: this._film.isViewed ? new Date() : null,
    });
  }

  _switchFavoriteClickHadler() {
    const currentFilterType = this._filterType === 'all movies' || this._filterType !== 'favorites';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(UserAction.UPDATE_FILM, currentFilterType ? UpdateType.PATCH : UpdateType.MINOR, {
      ...this._film,
      isFavorite: !this._film.isFavorite,
    });
  }

  _switchWatchlistClickHadler() {
    const currentFilterType = this._filterType === 'all movies' || this._filterType !== 'watchlist';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(UserAction.UPDATE_FILM, currentFilterType ? UpdateType.PATCH : UpdateType.MINOR, {
      ...this._film,
      isWatchlist: !this._film.isWatchlist,
    });
  }

  _commentDeleteClickHandler(id) {
    // const scroll = this.getScrollPostiton();

    this._commentsModel.deleteComment(id);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this._film,
      comments: this._commentsModel.getComments(),
    });

    this._renderFilmPopup(this._film, this._commentsModel.getComments());
    // this.setScrollPosition(scroll);
  }

  _commentSubmitHandler(data) {
    const scroll = this.getScrollPostiton();

    if (!data.emotion && !data.comment) {
      return;
    }

    const newComment = {
      id: this._commentsModel.getComments().length,
      author: 'Boris Britva',
      comment: data.commentText,
      emoji: data.emotion,
      date: new Date(),
    };

    this._commentsModel.addComment(newComment);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this._film,
      commentsCount: this._commentsModel.getComments().length,
      comments: this._commentsModel.getComments(),
    });

    this._renderFilmPopup(this._film, this._commentsModel.getComments());
    this.setScrollPosition(scroll);
  }
}
