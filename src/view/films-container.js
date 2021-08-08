import { createElement } from '../utils/utils.js';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmContainerTemplate();
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    this._element = null;
  }
}
