import { createElement } from '../utils/render';
import { SHAKE_ANIMATION_TIMEOUT } from '../utils/const';

export default class Abstract {
  constructor() {
    this._element = null;
    this._callback = {};
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

  shake() {
    this.renderElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.renderElement().style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
