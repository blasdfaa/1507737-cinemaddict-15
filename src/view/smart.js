import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();

    this._data = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = { ...this._data, ...update };

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.renderElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.renderElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
