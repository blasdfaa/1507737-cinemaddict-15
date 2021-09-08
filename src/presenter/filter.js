import FilterView from '../view/filter';
import { removeComponent, render, replace } from '../utils/render';
import { FilterType, RenderPosition, UpdateType } from '../utils/const';
import { filter } from '../utils/filter';
import UserProfileView from '../view/user-profile';

export default class Filter {
  constructor(headerContainer, filterContainer, filterModel, filmModel) {
    this._headerContainer = headerContainer;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmModel = filmModel;

    this._filterComponent = null;
    this._profileComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._filmModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const prevProfileComponent = this._profileComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._profileComponent = new UserProfileView(this._getWatchedFilmsCount());
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null && prevProfileComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      render(this._headerContainer, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    replace(this._profileComponent, prevProfileComponent);
    removeComponent(prevFilterComponent);
    removeComponent(prevProfileComponent);
  }

  _modelEventHandler(updateType) {
    if (updateType === UpdateType.INIT) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    }

    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getWatchedFilmsCount() {
    return this._getFilters().find((item) => item.value === 'History').count;
  }

  _getFilters() {
    const films = this._filmModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        value: 'All',
      },
      {
        type: FilterType.WATCHLIST,
        value: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        value: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        value: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
