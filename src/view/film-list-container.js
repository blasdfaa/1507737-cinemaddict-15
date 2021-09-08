import AbstractView from './abstract';

const createFilmListTemplate = () => '<div class="films-list__container"></div>';

export default class FilmListContainer extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
