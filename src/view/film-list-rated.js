import { createElement } from '../utils/utils';

const filmListRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmListRated {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return filmListRatedTemplate();
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
