import AbstractView from './abstract';

const createMenuItemTemplate = (filters, currentFilterType) => {
  const { type, value, count } = filters;

  const checkFilmCount = (filmCount) =>
    filmCount >= 0 ? `<span class="main-navigation__item-count">${filmCount}</span>` : '';

  return `<a
      href="#${value}"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
      data-filter-type="${type}"
    >
      ${type}
      <!-- Не показывать счетчик фильмов у пункта "All movies" когда фильмов 0 -->
      ${type === 'All movies' ? '' : checkFilmCount(count)}
    </a>`;
};

const createMenuTemplate = (menuItems, currentFilterType) => {
  const menuItemsTemplate = menuItems
    .map((item) => createMenuItemTemplate(item, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${menuItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional
    ${'Stats' === currentFilterType ? 'main-navigation__item--active' : ''}"
      data-filter-type="Stats"
    >
      Stats
    </a>
  </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsScreenClickHandler = this._statsScreenClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(target.dataset.filterType);
  }

  _statsScreenClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.renderElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setStatsScreenClickHandler(callback) {
    this._callback.statsClick = callback;
    this.renderElement()
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this._statsScreenClickHandler);
  }
}
