import { filmCardTemplate } from './view/film-card.js';
import { filmDetailsTemplate } from './view/film-details.js';
import { filmListExtraTemplate } from './view/film-list-extra.js';
import { filmListTemplate } from './view/film-list.js';
import { menuListTemplate } from './view/menu-list.js';
import { showMoreButtonTemplate } from './view/show-more.js';
import { profileTemplate } from './view/user-profile.js';

const FILM_CARDS_COUNT = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const render = (place, template, container) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (cardsCount, container) => {
  for (let i = 0; i < cardsCount; i++) {
    render('beforeend', filmCardTemplate(), container);
  }
};

render('beforeend', profileTemplate(), headerElement);
render('beforeend', menuListTemplate(), mainElement);
render('beforeend', filmListTemplate(), mainElement);

const filmsContainer = mainElement.querySelector('.films');
render('beforeend', filmListExtraTemplate(), filmsContainer);
render('beforeend', filmListExtraTemplate(), filmsContainer);

const filmListContainer = mainElement.querySelector('.films-list__container');

renderFilmCards(FILM_CARDS_COUNT, filmListContainer);

const filmListElement = mainElement.querySelector('.films-list');
render('beforeend', showMoreButtonTemplate(), filmListElement);

const filmExtraListContainer = [...filmsContainer.querySelectorAll('.films-list--extra')];

filmExtraListContainer.forEach((item) => {
  const container = item.querySelector('.films-list__container');
  renderFilmCards(EXTRA_FILM_CARDS_COUNT, container);
});

// popup
render('afterend', filmDetailsTemplate(), footerElement);
