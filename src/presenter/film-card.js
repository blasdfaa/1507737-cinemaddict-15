import { removeComponent, render, replace } from '../utils/render';
import { RenderPosition } from '../utils/const';
import FilmCardView from '../view/film-card';
import FilmControlsView from '../view/film-controls';
import CommentListView from '../view/film-comment';
import NewCommentView from '../view/film-comment-add';
import FilmPopupView from '../view/film-popup';

export default class FilmCard {
  constructor(filmContainer, filmPopupContainer, changeData) {
    this._filmContainer = filmContainer;
    this._filmPopupContainer = filmPopupContainer;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._switchViewedClickHadler = this._switchViewedClickHadler.bind(this);
    this._switchFavoriteClickHadler = this._switchFavoriteClickHadler.bind(this);
    this._switchWatchlistClickHadler = this._switchWatchlistClickHadler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmControlsComponent = new FilmControlsView(film);
    this._filmPopupComponent = new FilmPopupView(film);
    this._commentListComponent = new CommentListView(film, comments);
    this._newCommentComponent = new NewCommentView();

    this._filmCardComponent.setFilmCardClickHandler(() => {
      document.addEventListener('keydown', this._closePopupEscKeyHandler);
      this._renderFilmPopup();
    });
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

  destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmPopupComponent);
  }

  _removeFilmPopup() {
    document.querySelector('body').classList.remove('hide-overflow');
    removeComponent(this._filmPopupComponent);
  }

  _renderFilmPopup() {
    render(this._filmPopupContainer, this._filmPopupComponent, RenderPosition.AFTEREND);

    const filmDetailsContainer = this._filmPopupComponent.renderElement().querySelector('.film-details__inner');
    render(filmDetailsContainer, this._filmControlsComponent, RenderPosition.BEFOREEND);
    render(filmDetailsContainer, this._commentListComponent, RenderPosition.BEFOREEND);

    const filmCommentsWrapper = this._commentListComponent.renderElement().querySelector('.film-details__comments-wrap');
    render(filmCommentsWrapper, this._newCommentComponent, RenderPosition.BEFOREEND);

    this._filmPopupComponent.setClosePopupClickHandler(() => {
      this._removeFilmPopup();
    });

    document.querySelector('body').classList.add('hide-overflow');
  }

  _closePopupEscKeyHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmPopup();
    }
  }

  _switchViewedClickHadler() {
    this._changeData({ ...this._film, isViewed: !this._film.isViewed });
  }

  _switchFavoriteClickHadler() {
    this._changeData({ ...this._film, isFavorite: !this._film.isFavorite });
  }

  _switchWatchlistClickHadler() {
    this._changeData({ ...this._film, inWatchlist: !this._film.inWatchlist });
  }
}
