import AbstractView from './abstract';

const createMenuItemTemplate = (filters) => {
  const { name, count } = filters;

  const checkFilmCount = (filmCount) =>
    filmCount >= 0
      ? `<span class="main-navigation__item-count">${filmCount}</span>`
      : '';

  return (
    `<a href="#${name}" class="main-navigation__item">
      ${name}
      <!-- Не показывать счетчик фильмов у пункта "All movies" когда фильмов 0 -->
      ${name === 'All movies' ? '' : checkFilmCount(count)}
    </a>`
  );
};

const createMenuTemplate = (menuItems) => {
  const menuItemsTemplate = menuItems.map((item) => createMenuItemTemplate(item)).join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${menuItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}
