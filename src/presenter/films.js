import { FILM_CARDS_COUNT_STEP, FilterType, Pages, RenderPosition, SortType, StatsFilterType, UpdateType, UserAction } from '../utils/const';
import { removeComponent, render } from '../utils/render';
import { sortByDate, sortByRating } from '../utils/sort';
import { filter } from '../utils/filter';
import EmptyListView from '../view/empty-list';
import FooterStats from '../view/footer-stats';
import FilmListRatedView from '../view/film-list-rated';
import FilmListCommentedView from '../view/film-list-commented';
import FilmCardPresenter from '../presenter/film-card';
import SortFilmListView from '../view/sort-films';
import ShowMoreButtonView from '../view/show-more';
import PreloaderView from '../view/preloader';
import FilmSectionView from '../view/film-section';
import FilmListContainerView from '../view/film-list-container';
import FilmListView from '../view/film-list';
import { filterStatsByWatchingDate, getUserRating } from '../utils/user';
import StatsScreenView from '../view/statistic';

export default class Films {
  constructor(headerContainer, mainContainer, footerContainer, filmsModel, filterModel, api) {
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = FILM_CARDS_COUNT_STEP;
    this._currentScreen = Pages.FILMS;
    this._currentStatsFilter = StatsFilterType.ALL;

    this._isLoading = true;
    this._api = api;

    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();

    this._filmsSection = new FilmSectionView();
    this._filmsList = new FilmListView();
    this._filmsListContainer = new FilmListContainerView();
    this._footerStatsComponent = new FooterStats();
    this._loadingComponent = new PreloaderView();

    this._sortFilmListComponent = null;
    this._showMoreButtonComponent = null;
    this._emptyListComponent = null;
    this._filmListRatedContainer = null;
    this._filmListRatedComponent = null;
    this._filmListCommentedContainer = null;
    this._filmListCommentedComponent = null;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);

    this._statsFilterChangeHandler = this._statsFilterChangeHandler.bind(this);
  }

  init() {
    this._renderFilmsSection();

    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  // Метод для получения данных из модели
  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    this._currentProfileRating = getUserRating(filter[FilterType.HISTORY](films).length);

    if (this._filterType === FilterType.STATS) {
      this._currentScreen = Pages.STATS;
      return filtredFilms;
    }

    this._currentScreen = Pages.FILMS;

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _viewActionHandler(actionType, updateType, update, callback, errCallback) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .then(callback)
          .catch(errCallback);
    }
  }

  // Метод для инициализации презентеров
  _initFilmCardPresenter(presenters, data) {
    if (presenters.has(data.id)) {
      presenters.get(data.id).init(data, data.comments);
    }
  }

  // Метод для обновления модели
  _modelEventHandler(updateType, data) {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);

    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });
        this._renderFilmsSection();
        break;
      case UpdateType.PATCH:
        this._initFilmCardPresenter(this._filmCardPresenter, data);
        this._initFilmCardPresenter(this._ratedFilmCardPresenter, data);
        this._initFilmCardPresenter(this._commentedFilmCardPresenter, data);
        break;
      case UpdateType.MINOR:
        this._clearFilmList({ resetFilmCounter: true });
        this._renderFilmsSection();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });

        switch (this._currentScreen) {
          case Pages.FILMS:
            this._renderFilmsSection();
            break;
          case Pages.STATS:
            this._currentStatsFilter = StatsFilterType.ALL;
            this._renderStatsScreen(filtredFilms);
            break;
        }
        break;
    }
  }

  // Метод для смены модов карточки фильма
  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  // Обработчик для кнопок сортировки фильмов
  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({ resetFilmCounter: true });
    this._renderFilmsSection();
  }

  // Метод для рендера экрана статистики
  _renderStatsScreen(films) {
    this._statsComponent = new StatsScreenView(
      this._currentProfileRating,
      this._currentStatsFilter,
      films,
    );

    this._statsComponent.setFilterTypeChangeHandler(this._statsFilterChangeHandler);
    render(this._mainContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }

  // Обработчик для смены фильтров статистики
  _statsFilterChangeHandler(value) {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);
    this._currentStatsFilter = value;

    removeComponent(this._statsComponent);

    switch (this._currentStatsFilter) {
      case StatsFilterType.ALL:
        this._renderStatsScreen(filtredFilms);
        break;
      case StatsFilterType.TODAY:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'd'));
        break;
      case StatsFilterType.WEEK:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'w'));
        break;
      case StatsFilterType.MONTH:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'M'));
        break;
      case StatsFilterType.YEAR:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'y'));
        break;
    }
  }

  // Метод для ренедера прелоадера
  _renderLoading() {
    render(this._filmsSection, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера списка с кнопками сортировки фильмов
  _renderSortFilmList() {
    if (this._sortFilmListComponent !== null) {
      this._sortFilmListComponent = null;
    }

    this._sortFilmListComponent = new SortFilmListView(this._currentSortType);

    if (this._getFilms().length) {
      render(this._mainContainer, this._sortFilmListComponent, RenderPosition.BEFOREEND);
      this._sortFilmListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    }
  }

  // Метод для рендера всех фильмов
  _renderAllFilms() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderEmptyFilmsMessage();
      return;
    }

    render(this._filmsSection, this._filmsList, RenderPosition.AFTERBEGIN);
    render(this._filmsList, this._filmsListContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(
      this._filmsListContainer,
      films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)),
      this._filmCardPresenter,
    );

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  // Метод для рендера фильмов с наивысшим рейтингом
  _renderRatedFilms() {
    if (this._filmListRatedComponent !== null && this._filmListRatedContainer !== null) {
      removeComponent(this._filmListRatedComponent);
      removeComponent(this._filmListRatedContainer);
      this._filmListRatedContainer = null;
      this._filmListRatedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getRatedFilms()];

    if (films[0].filmRating === 0) {
      return;
    }

    this._filmListRatedContainer = new FilmListContainerView();
    this._filmListRatedComponent = new FilmListRatedView();

    render(this._filmsSection, this._filmListRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmListRatedComponent, this._filmListRatedContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(this._filmListRatedContainer, films, this._ratedFilmCardPresenter);
  }

  // Метод для рендера фильмов с большим количеством комментариев
  _renderCommentedFilms() {
    if (this._filmListCommentedContainer !== null && this._filmListCommentedComponent !== null) {
      removeComponent(this._filmListCommentedComponent);
      removeComponent(this._filmListCommentedContainer);
      this._filmListCommentedContainer = null;
      this._filmListCommentedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getCommentedFilms()];

    if (films[0].comments.length === 0) {
      return;
    }

    this._filmListCommentedContainer = new FilmListContainerView();
    this._filmListCommentedComponent = new FilmListCommentedView();

    render(this._filmsSection, this._filmListCommentedComponent, RenderPosition.BEFOREEND);
    render(
      this._filmListCommentedComponent,
      this._filmListCommentedContainer,
      RenderPosition.BEFOREEND,
    );

    this._renderFilmCards(
      this._filmListCommentedContainer,
      films,
      this._commentedFilmCardPresenter,
    );
  }

  // Метод для рендера одной карточки фильма
  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(
      container,
      this._viewActionHandler,
      this._cardModeChangeHandler,
      this._filterType,
      this._api,
    );

    filmCardPresenter.set(film.id, mainFilmCardPresenter);
    mainFilmCardPresenter.init(film, film.comments);
  }

  // Метод для рендера нескольких карточек
  _renderFilmCards(container, films, filmCardPresenter) {
    films.forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  // Метод для рендера сообщения об отсутствии фильмов в базе данных
  _renderEmptyFilmsMessage() {
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    this._emptyListComponent = new EmptyListView(this._filterType);
    render(this._filmsList, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  // Метод для рендера кнопки "Загрузить еще"
  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  // Обработчик для кнопки "Загрузить еще"
  _showMoreFilmsClickHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(
      filmsCount,
      this._renderedFilmsCount + FILM_CARDS_COUNT_STEP,
    );
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmCards(this._filmsListContainer, films, this._filmCardPresenter);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  // Метод для рендера счетчика колличества фильмов в базе данных
  _renderDataFilmsCounter() {
    render(this._footerContainer, this._footerStatsComponent, RenderPosition.BEFOREEND);
  }

  // Метод для очистки мапов
  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  // Метод для очистки карточек фильмов
  _clearFilmList({ resetFilmCounter = false, resetSortType = false } = {}) {
    const filmsCount = this._getFilms().length;

    this._clearCardPresenter(this._filmCardPresenter);
    this._clearCardPresenter(this._ratedFilmCardPresenter);
    this._clearCardPresenter(this._commentedFilmCardPresenter);

    if (this._statsComponent) {
      removeComponent(this._statsComponent);
    }

    removeComponent(this._sortFilmListComponent);

    if (this._emptyListComponent) {
      removeComponent(this._emptyListComponent);
    }

    removeComponent(this._loadingComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    if (resetFilmCounter) {
      this._renderedFilmsCount = FILM_CARDS_COUNT_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // Метод для рендера полного списка карточек
  _renderFilmsSection() {
    if (this._isLoading) {
      render(this._mainContainer, this._filmsSection, RenderPosition.BEFOREEND);
      this._renderLoading();
      return;
    }

    this._renderSortFilmList();

    render(this._mainContainer, this._filmsSection, RenderPosition.BEFOREEND);

    this._renderAllFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }
}
