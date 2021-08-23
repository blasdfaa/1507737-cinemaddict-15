import { removeComponent, render, replace } from '../utils/render';
import { CardMode, RenderPosition } from '../utils/const';
import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';

export default class FilmCard {
  constructor(filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;

    this._switchViewedClickHadler = this._switchViewedClickHadler.bind(this);
    this._switchFavoriteClickHadler = this._switchFavoriteClickHadler.bind(this);
    this._switchWatchlistClickHadler = this._switchWatchlistClickHadler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._mode = CardMode.CLOSE;
    this.body = document.querySelector('body');
  }

  init(film, comments) {
    this._film = film;

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

  _renderFilmPopup(film, comments) {
    if (this._filmPopupComponent) {
      this._hidePopup();
    }

    this._filmPopupComponent = new FilmPopupView(film, comments);
    this._showPopup();
    this.body.classList.add('hide-overflow');

    this._filmPopupComponent.setClosePopupClickHandler(this._hidePopup);
    this._filmPopupComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmPopupComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmPopupComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);
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
    this._changeData({ ...this._film, isViewed: !this._film.isViewed });

    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
    }
  }

  _switchFavoriteClickHadler() {
    this._changeData({ ...this._film, isFavorite: !this._film.isFavorite });

    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
    }
  }

  _switchWatchlistClickHadler() {
    this._changeData({ ...this._film, inWatchlist: !this._film.inWatchlist });

    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
    }
  }
}
