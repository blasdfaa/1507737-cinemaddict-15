import AbstractView from './abstract';

const filmListCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmListCommented extends AbstractView {
  getTemplate() {
    return filmListCommentedTemplate();
  }
}
