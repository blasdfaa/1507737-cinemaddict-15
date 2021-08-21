import AbstractView from './abstract';

const createFooterStatsTemplate = (films = []) => (
  `<section class="footer__statistics">
    <p>${films.length ? films.length : 0} movies inside</p>
  </section>`
);

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._films);
  }
}
