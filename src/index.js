import Films from './presenter/films';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Filter from './presenter/filter';
import { AUTHORIZATION, END_POINT, UpdateType } from './utils/const';
import Api from './api';

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
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
