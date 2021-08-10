import AbstractView from './abstract';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmContainerTemplate();
  }

}
