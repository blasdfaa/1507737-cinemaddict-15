import { FILM_CARDS_COUNT } from './utils/const.js';
import { generateFilmData } from './mock/film-card.js';
import { generateFilmsFilter } from './view/film-filter.js';
import { generateCommentsData } from './mock/comment.js';
import Films from './presenter/films';

const films = new Array(FILM_CARDS_COUNT).fill('').map(generateFilmData);
const comments = films.map((film) => generateCommentsData(film));
const filters = generateFilmsFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

new Films(headerElement, mainElement, footerElement, filters).init(films, comments);
