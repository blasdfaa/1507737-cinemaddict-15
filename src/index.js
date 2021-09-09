import Films from './presenter/films';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Filter from './presenter/filter';
import { AUTHORIZATION, END_POINT, RenderPosition, UpdateType } from './utils/const';
import Api from './api';
import FooterStatsView from './view/footer-stats';
import { render } from './utils/render';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

new Filter(headerElement, mainElement, filterModel, filmsModel).init();
new Films(mainElement, footerElement, filmsModel, filterModel, api).init();

api.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerElement, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(footerElement, new FooterStatsView(), RenderPosition.BEFOREEND);
  });

