import { removeComponent, render, replace } from '../utils/render';
import { CardMode, RenderPosition, UpdateType, UserAction } from '../utils/const';
import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import CommentsModel from '../model/comments';
import { isOnline } from '../utils/common';

export default class FilmCard {
  constructor(filmContainer, changeData, changeMode, filterType, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterType = filterType;
    this._api = api;

    this._filmPopupComponent = null;
    this._filmCardComponent = null;
    this._commentsModel = new CommentsModel();

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

  init(film) {
    this._film = film;

    this._api.getCommentsList(this._film).then((response) => {
      if (this._film.comments) {
        this._commentsModel.setComments(response);
      }
    }).catch(() => {
      this._commentsModel.setComments(null);
    });

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setFilmCardClickHandler(() => this._renderFilmPopup(
      film,
      this._commentsModel.getComments(),
    ));
    this._filmCardComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmCardComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmCardComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.renderElement().contains(prevFilmCardComponent.renderElement())) {
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

  _renderFilmPopup(film) {
    if (this._filmPopupComponent) {
      this._hidePopup();
    }

    if (this._filmPopupComponent !== null) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
      this._filmPopupComponent = null;
    }

    this._filmPopupComponent = new FilmPopupView(film, this._commentsModel.getComments());

    this._showPopup();
    this.body.classList.add('hide-overflow');
    this._filmPopupComponent.renderElement().scrollTo(0, this._scrollPosition);

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
    this._filmPopupComponent = null;
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
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'History';
    const isAlreadyViewed = this._film.isViewed;

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isViewed: !this._film.isViewed,
        wathingDate: isAlreadyViewed ? new Date() : null,
      },
    );
  }

  _switchFavoriteClickHadler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'Favorites';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isFavorite: !this._film.isFavorite,
      },
    );
  }

  _switchWatchlistClickHadler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'Watchlist';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isWatchlist: !this._film.isWatchlist,
      },
    );
  }

  _commentDeleteClickHandler(id, button, buttonList) {
    if (!isOnline()) {
      this._filmPopupComponent.shake();
      return;
    }

    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    button.textContent = 'Deleting...';
    buttonList.forEach((btn) => {
      btn.disabled = true;
    });

    this._api.deleteComment(id).then(() => {
      this._changeData(
        UserAction.UPDATE_POPUP,
        UpdateType.PATCH,
        this._film,
      );
    }).catch(() => {
      this._filmPopupComponent.shake();
      button.textContent = 'Delete';
      buttonList.forEach((btn) => {
        btn.disabled = false;
      });
    });
  }

  _commentSubmitHandler(data, input, emotionList) {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const newComment = {
      emotion: data.emotion,
      comment: data.commentText,
    };

    input.setAttribute('disabled', 'disabled');
    emotionList.forEach((emotionItem) => {
      emotionItem.disabled = true;
    });

    this._api.addComment(this._film, newComment).then((response) => {
      this._commentsModel.addComment(response);
    })
      .then(() => {
        this._changeData(
          UserAction.UPDATE_POPUP,
          UpdateType.PATCH,
          this._film,
        );
      })
      .catch(() => {
        input.removeAttribute('disabled');
        emotionList.forEach((emotionItem) => {
          emotionItem.disabled = false;
        });
        this._filmPopupComponent.shake();
      });
  }

  updateComments() {
    this._api.getCommentsList(this._film).then((response) => {
      this._commentsModel.setComments(response);
      this._renderFilmPopup(this._film, this._commentsModel.getComments());
      this._filmPopupComponent.renderElement().scrollTo(0, this._scrollPosition);
    });
  }

  rerenderPopup() {
    if (this._filmPopupComponent) {
      this._renderFilmPopup(this._film, this._commentsModel.getComments());
      this._filmPopupComponent.renderElement().scrollTo(0, this._scrollPosition);
    }
  }

  setShakeState() {
    if (this._filmPopupComponent) {
      this._filmPopupComponent.shake();
    } else {
      this._filmCardComponent.shake();
    }
  }
}
