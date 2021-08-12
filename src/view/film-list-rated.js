import AbstractView from './abstract';

const filmListRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmListRated extends AbstractView {
  getTemplate() {
    return filmListRatedTemplate();
  }
}
