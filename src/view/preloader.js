import AbstractView from './abstract';

const createPreloaderTemplate = () => (
  '<h2 class="films-list__title">Loading...</h2>'
);

export default class Preloader extends AbstractView {
  getTemplate() {
    return createPreloaderTemplate();
  }
}
