import { removeComponent, render, replace } from '../utils/render';
import { RenderPosition } from '../utils/const';
import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';

export default class FilmCard {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
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
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film, comments);
    this._popup = this._filmPopupComponent.renderElement();

    this.body = document.body;

    this._filmCardComponent.setFilmCardClickHandler(() => {
      this._renderFilmPopup();
      document.addEventListener('keydown', this._closePopupEscKeyHandler);
    });
    this._filmCardComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmCardComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmCardComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    this._filmPopupComponent.setClosePopupClickHandler(() => {
      this._removeFilmPopup();
    });
    this._filmPopupComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmPopupComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmPopupComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmCardComponent.renderElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this.body.contains(prevFilmPopupComponent.renderElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    removeComponent(prevFilmCardComponent);
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  _removeFilmPopup() {
    this.body.removeChild(this._popup);
    this.body.classList.remove('hide-overflow');
  }

  _renderFilmPopup() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }

    this.body.appendChild(this._popup);
    this.body.classList.add('hide-overflow');
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
