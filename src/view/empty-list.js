import AbstractView from './abstract';

const createEmptyListTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class EmptyList extends AbstractView {
  getTemplate() {
    return createEmptyListTemplate();
  }
}
