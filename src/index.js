import { FILM_CARDS_COUNT, FILM_CARDS_COUNT_STEP, RenderPosition, TOP_RATED_COUNT } from './utils/const.js';
import { getRandomIntegerInRange } from './utils/common.js';
import { generateFilmData } from './mock/film-card.js';
import { generateFilmsFilter } from './view/film-filter.js';
import { generateCommentsData } from './mock/comment.js';
import { removeComponent, render } from './utils/render';
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

render(headerElement, new UserProfileView(), RenderPosition.BEFOREEND);
render(mainElement, new MenuView(filters), RenderPosition.BEFOREEND);

const menuListElement = document.querySelector('.main-navigation');
const sortFilmListComponent = new SortFilmListView();
render(menuListElement, sortFilmListComponent, RenderPosition.AFTEREND);

const filmsContainerComponent = new FilmsContainerView();
render(mainElement, filmsContainerComponent, RenderPosition.BEFOREEND);

const filmListComponent = new FilmListView();
render(filmsContainerComponent, filmListComponent, RenderPosition.BEFOREEND);

const filmListRatedComponent = new FilmListRatedView();
const filmListCommentedComponent = new FilmListCommentedView();
render(filmsContainerComponent, filmListRatedComponent, RenderPosition.BEFOREEND);
render(filmsContainerComponent, filmListCommentedComponent, RenderPosition.BEFOREEND);

const filmPopupComponent = new FilmPopupView();

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCardView(film);
  const filmControlsComponent = new FilmControlsView(film);
  const commentListComponent = new CommentListView(film, comments);
  const newCommentComponent = new NewCommentView();

  const showFilmPopup = (filmData) => {
    render(footerElement, filmPopupComponent, RenderPosition.AFTEREND, filmData);

    const filmDetailsContainer = filmPopupComponent.renderElement().querySelector('.film-details__inner');
    render(filmDetailsContainer, filmControlsComponent, RenderPosition.BEFOREEND);
    render(filmDetailsContainer, commentListComponent, RenderPosition.BEFOREEND);

    const filmCommentsWrapper = commentListComponent.renderElement().querySelector('.film-details__comments-wrap');
    render(filmCommentsWrapper, newCommentComponent, RenderPosition.BEFOREEND);

    filmPopupComponent.setClosePopupClickHandler(() => {
      filmPopupComponent.removeElement();
    });
  };

  const closePopupEscKeyHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      filmPopupComponent.removeElement();
    }
  };

  filmComponent.setFilmCardClickHandler(() => {
    document.addEventListener('keydown', closePopupEscKeyHandler);
    filmPopupComponent.removeElement();

    showFilmPopup(film);
  });

  return render(container, filmComponent, RenderPosition.BEFOREEND);
};

const filmListInner = filmsContainerComponent.renderElement().querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_CARDS_COUNT_STEP); i++) {
  renderFilmCard(filmListInner, films[i]);
}

const filmListElement = mainElement.querySelector('.films-list');

if (films.length > FILM_CARDS_COUNT_STEP) {
  let renderedFilmsCount = FILM_CARDS_COUNT_STEP;

  const showMoreButton = new ShowMoreButtonView();
  render(filmListElement, showMoreButton, RenderPosition.BEFOREEND);


  showMoreButton.setLoadMoreClickHandler(() => {
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARDS_COUNT_STEP)
      .forEach((film) => renderFilmCard(filmListInner, film));

    renderedFilmsCount += FILM_CARDS_COUNT_STEP;

    if (renderedFilmsCount >= films.length) {
      removeComponent(showMoreButton);
    }
  });
}

const filmListRatedInner = filmListRatedComponent.renderElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderFilmCard(filmListRatedInner, film);
});

const filmListCommentedInner = filmListCommentedComponent.renderElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderFilmCard(filmListCommentedInner, film);
});

render(footerElement, new FooterStats(films), RenderPosition.BEFOREEND);

const showEmptyDatabaseMessage = () => {
  removeComponent(sortFilmListComponent);
  removeComponent(filmListRatedComponent);
  removeComponent(filmListCommentedComponent);
  removeComponent(filmListComponent);

  render(filmsContainerComponent.renderElement(), new EmptyListView(), RenderPosition.BEFOREEND);
};

if (!films.length) {
  showEmptyDatabaseMessage();
}
