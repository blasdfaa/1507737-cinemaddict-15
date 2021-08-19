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
    this._ratedFilmData = updateItem(this._ratedFilmData, updatedFilm);
    this._commentedFilmData = updateItem(this._commentedFilmData, updatedFilm);
    // this._dataComments = updateItem(this._dataComments, updatedComments);

    // В init пока не обновляю комменты, чтобы не выкидывать ошибку при переключении контролов попапа
    this._filmCardPresenter.get(updatedFilm.id).init(updatedFilm, []);
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
    this._clearFilmList();
    this._renderMainFilmCards();
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
  _renderFilmCard(container, film, comments) {
    const filmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler);

    filmCardPresenter.init(film, comments);
    this._filmCardPresenter.set(film.id, filmCardPresenter);
  }

  // Метод для рендера нескольких карточек (от, до)
  _renderFilmCards(container, filmsData, from, to) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, this._dataComments));
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
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, this._renderedTaskCount, this._renderedTaskCount + FILM_CARDS_COUNT_STEP);
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
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, 0, Math.min(this._dataFilms.length, FILM_CARDS_COUNT_STEP));

    if (this._dataFilms.length > FILM_CARDS_COUNT_STEP) {
      this._renderShowMoreButton();
    }
  }

  // Метод для рендера карточек с наивысшим рейтингом
  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListRatedInner, this._ratedFilmData, 0, EXTRA_FILM_CARDS_COUNT);
  }

  // Метод для рендера карточек с большим количеством комментариев
  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListCommentedInner, this._commentedFilmData, 0, EXTRA_FILM_CARDS_COUNT);
  }

  // Метод для очистки карточек фильмов
  _clearFilmList() {
    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();
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
