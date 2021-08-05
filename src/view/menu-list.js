const createMenuItemTemplate = (filters) => {
  const { name, count } = filters;

  const checkFilmCount = (filmCount) =>
    filmCount > 0
      ?`<span class="main-navigation__item-count">${filmCount}</span>`
      : '';

  return (
    `<a href="#${name}" class="main-navigation__item">
      ${name}
      ${checkFilmCount(count)}
    </a>`
  );
};

export const createMenuTemplate = (menuItems) => {
  const menuItemsTemplate = menuItems.map((item) => createMenuItemTemplate(item)).join('');

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
    ${menuItemsTemplate}
    </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>
 `;
};
