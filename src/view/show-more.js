import { createElement } from '../utils/utils.js';

const showMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return showMoreButtonTemplate();
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
