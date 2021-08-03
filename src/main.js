import { generateFilmData } from './mock/film-card.js';
import { filmCardTemplate } from './view/film-card.js';
import { filmCommentTemplate } from './view/film-comment.js';
import { filmControlsTemplate } from './view/film-controls.js';
import { filmPopupTemplate } from './view/film-popup.js';
import { filmListRatedTemplate } from './view/film-list-rated.js';
import { filmListCommentedTemplate } from './view/film-list-commented.js';
import { filmListTemplate } from './view/film-list.js';
import { createMenuTemplate } from './view/menu-list.js';
import { showMoreButtonTemplate } from './view/show-more.js';
import { profileTemplate } from './view/user-profile.js';
import { getRandomIntegerInRange } from './utils/utils.js';
import { generateCommentsData } from './mock/comment.js';
import { createCommentTemplate } from './view/film-comment-add.js';
import { FILM_CARDS_COUNT, FILM_CARDS_COUNT_STEP, TOP_RATED_COUNT } from './utils/const.js';
import { generateFilmsFilter } from './view/film-filter.js';

const films = new Array(FILM_CARDS_COUNT).fill(null).map(generateFilmData);
const ratedFilms = films
  .filter((film) => film.rating > TOP_RATED_COUNT)
  .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
  .slice(0, 2);

const commntedFilms = films
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);

const comments = new Array(getRandomIntegerInRange(3, 20)).fill(null).map(generateCommentsData);

const filters = generateFilmsFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const render = (place, template, container) => {
  container.insertAdjacentHTML(place, template);
};

render('beforeend', profileTemplate(), headerElement);
render('beforeend', createMenuTemplate(filters), mainElement);
render('beforeend', filmListTemplate(), mainElement);

const filmsContainer = mainElement.querySelector('.films');
render('beforeend', filmListRatedTemplate(), filmsContainer);
render('beforeend', filmListCommentedTemplate(), filmsContainer);

const filmListContainer = mainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_CARDS_COUNT_STEP); i++) {
  render('beforeend', filmCardTemplate(films[i]), filmListContainer);
}

const filmListElement = mainElement.querySelector('.films-list');

if (films.length > FILM_CARDS_COUNT_STEP) {
  let renderedFilmsCount = FILM_CARDS_COUNT_STEP;

  render('beforeend', showMoreButtonTemplate(), filmListElement);

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARDS_COUNT_STEP)
      .forEach((film) => render('beforeend', filmCardTemplate(film), filmListContainer));

    renderedFilmsCount += FILM_CARDS_COUNT_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const filmExtraListContainer = [...filmsContainer.querySelectorAll('.films-list--extra')];

ratedFilms.forEach((film) => {
  const container = filmExtraListContainer[0].querySelector('.films-list__container');
  render('beforeend', filmCardTemplate(film), container);
});

commntedFilms.forEach((film) => {
  const container = filmExtraListContainer[1].querySelector('.films-list__container');
  render('beforeend', filmCardTemplate(film), container);
});

// popup
render('afterend', filmPopupTemplate(films[0]), footerElement);

const filmDetailsContainer = document.querySelector('.film-details__inner');

render('beforeend', filmControlsTemplate(films[0]), filmDetailsContainer);

render('beforeend', filmCommentTemplate(films[0], comments), filmDetailsContainer);

const filmCommentsWrapper = document.querySelector('.film-details__comments-wrap');

render('beforeend', createCommentTemplate(), filmCommentsWrapper);
