import AbstractView from './abstract';

const createFilmContainerTemplate = () => '<section class="films"></section>';

export default class FilmSection extends AbstractView {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
