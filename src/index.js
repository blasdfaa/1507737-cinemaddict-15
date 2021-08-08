import { FILM_CARDS_COUNT, FILM_CARDS_COUNT_STEP, TOP_RATED_COUNT } from './utils/const.js';
import { getRandomIntegerInRange, render, RenderPosition } from './utils/utils.js';
import { generateFilmData } from './mock/film-card.js';
import { generateFilmsFilter } from './view/film-filter.js';
import { generateCommentsData } from './mock/comment.js';
import FilmCardView from './view/film-card.js';
import FilmControlsView from './view/film-controls.js';
import UserProfileView from './view/user-profile.js';
import FilmPopupView from './view/film-popup.js';
import FilmListRatedView from './view/film-list-rated.js';
import FilmListCommentedView from './view/film-list-commented.js';
import FilmListView from './view/film-list.js';
import MenuView from './view/menu-list.js';
import ShowMoreButtonView from './view/show-more.js';
import FooterStats from './view/footer-stats.js';
import CommentListView from './view/film-comment.js';
import SortFilmListView from './view/sort-films.js';
import NewCommentView from './view/film-comment-add.js';
import EmptyListView from './view/empty-list.js';
import FilmsContainerView from './view/films-container.js';

const films = new Array(FILM_CARDS_COUNT).fill('').map(generateFilmData);
const ratedFilms = films
  .filter((film) => film.rating > TOP_RATED_COUNT)
  .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
  .slice(0, 2);

const commentedFilms = films
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);

const comments = new Array(getRandomIntegerInRange(3, 20)).fill('').map(generateCommentsData);

const filters = generateFilmsFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserProfileView().renderElement(), RenderPosition.BEFOREEND);
render(mainElement, new MenuView(filters).renderElement(), RenderPosition.BEFOREEND);

const menuListElement = document.querySelector('.main-navigation');
const sortFilmListComponent = new SortFilmListView();
render(menuListElement, sortFilmListComponent.renderElement(), RenderPosition.AFTEREND);

const filmsContainerComponent = new FilmsContainerView();
render(mainElement, filmsContainerComponent.renderElement(), RenderPosition.BEFOREEND);

const filmListComponent = new FilmListView(filters);
render(filmsContainerComponent.renderElement(), filmListComponent.renderElement(), RenderPosition.BEFOREEND);

const filmListRated = new FilmListRatedView();
const filmListCommented = new FilmListCommentedView();
render(filmsContainerComponent.renderElement(), filmListRated.renderElement(), RenderPosition.BEFOREEND);
render(filmsContainerComponent.renderElement(), filmListCommented.renderElement(), RenderPosition.BEFOREEND);


const filmPopupComponent = new FilmPopupView();
const renderFilmPopup = (filmData) => filmPopupComponent.renderElement(filmData);

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCardView(film);
  const filmControlsComponent = new FilmControlsView(film);
  const commentListComponent = new CommentListView(film, comments);
  const newCommentComponent = new NewCommentView();

  const showFilmPopup = (filmData) => {
    render(footerElement, renderFilmPopup(filmData), RenderPosition.AFTEREND);

    const filmDetailsContainer = filmPopupComponent.renderElement().querySelector('.film-details__inner');
    render(filmDetailsContainer, filmControlsComponent.renderElement(), RenderPosition.BEFOREEND);
    render(filmDetailsContainer, commentListComponent.renderElement(), RenderPosition.BEFOREEND);

    const filmCommentsWrapper = document.querySelector('.film-details__comments-wrap');
    render(filmCommentsWrapper, newCommentComponent.renderElement(), RenderPosition.BEFOREEND);

    const closePopupClickHandler = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      filmPopupComponent.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopupClickHandler();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    filmPopupComponent.renderElement()
      .querySelector('.film-details__close-btn').addEventListener('click', closePopupClickHandler);
  };

  const openPopupClickHandler = () => {
    filmPopupComponent.removeElement();
    showFilmPopup(film);
  };

  // ! Пока так, позже в классе сделаю один общий
  filmComponent.renderElement().querySelector('.film-card__poster')
    .addEventListener('click', openPopupClickHandler);
  filmComponent.renderElement().querySelector('.film-card__title')
    .addEventListener('click', openPopupClickHandler);
  filmComponent.renderElement().querySelector('.film-card__comments')
    .addEventListener('click', openPopupClickHandler);

  return render(container, filmComponent.renderElement(), RenderPosition.BEFOREEND);
};

const filmListInner = filmsContainerComponent.renderElement().querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_CARDS_COUNT_STEP); i++) {
  renderFilmCard(filmListInner, films[i]);
}

const filmListElement = mainElement.querySelector('.films-list');

if (films.length > FILM_CARDS_COUNT_STEP) {
  let renderedFilmsCount = FILM_CARDS_COUNT_STEP;

  render(filmListElement, new ShowMoreButtonView().renderElement(), RenderPosition.BEFOREEND);

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARDS_COUNT_STEP)
      .forEach((film) => renderFilmCard(filmListInner, film));

    renderedFilmsCount += FILM_CARDS_COUNT_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const filmListRatedInner = filmListRated.renderElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderFilmCard(filmListRatedInner, film);
});

const filmListCommentedInner = filmListCommented.renderElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderFilmCard(filmListCommentedInner, film);
});

render(footerElement, new FooterStats(films).renderElement(), RenderPosition.BEFOREEND);

if (!films.length) {
  sortFilmListComponent.removeElement();
  filmListRated.removeElement();
  filmListCommented.removeElement();
  filmListComponent.removeElement();
  render(filmsContainerComponent.renderElement(), new EmptyListView().renderElement(), RenderPosition.BEFOREEND);
}
