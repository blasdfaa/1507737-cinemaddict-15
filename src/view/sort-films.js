import AbstractView from './abstract';
import { SortType } from '../utils/const';

const createSortFilmListTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortFilmList extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortFilmListTemplate();
  }

  _setCurrentActiveClass(target) {
    const sortButtons = this.renderElement().querySelectorAll('.sort__button');

    sortButtons.forEach((button) => button.classList.remove('sort__button--active'));
    target.classList.add('sort__button--active');
  }

  _sortTypeChangeHandler(evt) {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._setCurrentActiveClass(target);
    this._callback.sortTypeChange(target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.renderElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
