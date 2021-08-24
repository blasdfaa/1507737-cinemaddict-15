import { EXTRA_FILM_CARDS_COUNT, FILM_CARDS_COUNT_STEP, RenderPosition, SortType, TOP_RATED_COUNT } from '../utils/const';
import { removeComponent, render } from '../utils/render';
import { updateItem } from '../utils/common';
import { sortByDate, sortByRating } from '../utils/sort';
import UserProfileView from '../view/user-profile';
import EmptyListView from '../view/empty-list';
import FilmsContainerView from '../view/films-container';
import FilmListView from '../view/film-list';
import FooterStats from '../view/footer-stats';
import MenuView from '../view/menu-list';
import SortFilmListView from '../view/sort-films';
import FilmListRatedView from '../view/film-list-rated';
import FilmListCommentedView from '../view/film-list-commented';
import ShowMoreButtonView from '../view/show-more';
import FilmCardPresenter from '../presenter/film-card';

export default class Films {
  constructor(headerContainer, mainContainer, footerContainer, filters) {
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;

    this._renderedTaskCount = FILM_CARDS_COUNT_STEP;
    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();

    this._userProfileComponent = new UserProfileView();
    this._menuNavigationComponent = new MenuView(filters);
    this._sortFilmListComponent = new SortFilmListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmListComponent = new FilmListView();
    this._filmListRatedComponent = new FilmListRatedView();
    this._filmListCommentedComponent = new FilmListCommentedView();
    this._emptyListComponent = new EmptyListView();
    this._filmStatsComponent = new FooterStats();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._filmCardChangeHadler = this._filmCardChangeHadler.bind(this);
    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);
  }

  init(dataFilms, dataComments) {
    this._dataFilms = [...dataFilms];
    this._defaultDataFilms = [...dataFilms];
    this._ratedFilmData = [...dataFilms]
      .filter((film) => film.rating > TOP_RATED_COUNT)
      .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
      .slice(0, 2);
    this._commentedFilmData = [...dataFilms]
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_FILM_CARDS_COUNT);

    this._dataComments = [...dataComments];

    this._renderUserProfile();
    this._renderNavigationMenu();
    this._renderSortFilmList();

    this._renderFilmsContainer();
    this._renderFilmsList();
    this._renderFilmsListRated();
    this._renderFilmsListCommented();
    this._renderFilms();

    this._renderShowMoreButton();
    this._renderDataFilmsCounter();
  }

  // Метод для обновления данных
  _filmCardChangeHadler(updatedFilm) {
    this._dataFilms = updateItem(this._dataFilms, updatedFilm);
    this._defaultDataFilms = updateItem(this._defaultDataFilms, updatedFilm);

    const initFilmCardPresenter = (presenters) => {
      if (presenters.has(updatedFilm.id)) {
        presenters.get(updatedFilm.id).init(updatedFilm, this._getComments(updatedFilm.id));
      }
    };

    initFilmCardPresenter(this._filmCardPresenter);
    initFilmCardPresenter(this._ratedFilmCardPresenter);
    initFilmCardPresenter(this._commentedFilmCardPresenter);
  }

  // Метод для смены модов карточки фильма
  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  // Метод для сортировки фильмов
  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._dataFilms.sort(sortByDate);
        break;
      case SortType.RATING:
        this._dataFilms.sort(sortByRating);
        break;
      default:
        this._dataFilms = [...this._defaultDataFilms];
    }

    this._currentSortType = sortType;
  }

  // Обработчик для кнопок сортировки фильмов
  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearMainFilmList();
    this._renderMainFilmCards();
  }

  _getComments(id) {
    let comments;
    this._dataComments.forEach((comment) => {
      if (comment.has(id)) {
        comments = comment.get(id);
      }
    });

    return comments;
  }

  // Метод для рендера профиля юзера
  _renderUserProfile() {
    render(this._headerContainer, this._userProfileComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера списка меню
  _renderNavigationMenu() {
    render(this._mainContainer, this._menuNavigationComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера списка с сортировкой фильмов
  _renderSortFilmList() {
    render(this._mainContainer, this._sortFilmListComponent, RenderPosition.BEFOREEND);
    this._sortFilmListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  // Метод для рендера контейнра с классом "films"
  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера основного списка фильмов
  _renderFilmsList() {
    render(this._filmsContainerComponent, this._filmListComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера списка фильмов с наивысшим рейтингом
  _renderFilmsListRated() {
    render(this._filmsContainerComponent, this._filmListRatedComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера списка фильмов с большим количеством комментариев
  _renderFilmsListCommented() {
    render(this._filmsContainerComponent, this._filmListCommentedComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера одной карточки фильма
  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler, this._cardModeChangeHandler);
    mainFilmCardPresenter.init(film, this._getComments(film.id));
    filmCardPresenter.set(film.id, mainFilmCardPresenter);
  }

  // Метод для рендера нескольких карточек (от, до)
  _renderFilmCards(container, filmsData, from, to, filmCardPresenter) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  // Метод для рендера сообщение об отсутствии фильмов в базе данных
  _renderEmptyFilmsMessage() {
    removeComponent(this._sortFilmListComponent);
    removeComponent(this._filmListComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
    removeComponent(this._showMoreButtonComponent);
    render(this._filmsContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера кнопки "Загрузить еще"
  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  // Обработчик для кнопки "Загрузить еще"
  _showMoreFilmsClickHandler() {
    this._renderFilmCards(
      this._mainFilmListInner,
      this._dataFilms,
      this._renderedTaskCount,
      this._renderedTaskCount + FILM_CARDS_COUNT_STEP,
      this._filmCardPresenter,
    );
    this._renderedTaskCount += FILM_CARDS_COUNT_STEP;

    if (this._renderedTaskCount >= this._dataFilms.length) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  // Метод для рендера счетчика колличества фильмов в базе данных
  _renderDataFilmsCounter() {
    render(this._footerContainer, this._filmStatsComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера всех карточек
  _renderMainFilmCards() {
    this._mainFilmListInner = this._filmsContainerComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._mainFilmListInner,
      this._dataFilms,
      0, Math.min(this._dataFilms.length, FILM_CARDS_COUNT_STEP),
      this._filmCardPresenter,
    );

    if (this._dataFilms.length > FILM_CARDS_COUNT_STEP) {
      this._renderShowMoreButton();
    }
  }

  // Метод для рендера карточек с наивысшим рейтингом
  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._filmListRatedInner,
      this._ratedFilmData,
      0,
      EXTRA_FILM_CARDS_COUNT,
      this._ratedFilmCardPresenter,
    );
  }

  // Метод для рендера карточек с большим количеством комментариев
  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._filmListCommentedInner,
      this._commentedFilmData,
      0,
      EXTRA_FILM_CARDS_COUNT,
      this._commentedFilmCardPresenter,
    );
  }

  // Метод для очистки мапов
  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  // Метод для очистки карточек фильмов
  _clearFilmList() {
    this._clearCardPresenter(this._filmCardPresenter);
    this._clearCardPresenter(this._ratedFilmCardPresenter);
    this._clearCardPresenter(this._commentedFilmCardPresenter);
    this._renderedTaskCount = FILM_CARDS_COUNT_STEP;

    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
  }

  _clearMainFilmList() {
    this._clearCardPresenter(this._filmCardPresenter);
    this._renderedTaskCount = FILM_CARDS_COUNT_STEP;
    removeComponent(this._showMoreButtonComponent);
  }

  // Метод для инициализации (начала работы) модуля
  _renderFilms() {
    if (!this._dataFilms.length) {
      this._renderEmptyFilmsMessage();
      return;
    }

    this._renderMainFilmCards();
    this._renderRatedFilmCards();
    this._renderCommentedFilmCards();
  }
}
