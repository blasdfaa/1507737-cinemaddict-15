import Films from './presenter/films';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Filter from './presenter/filter';
import { AUTHORIZATION, END_POINT, RenderPosition, UpdateType } from './utils/const';
import Api from './api/api';
import FooterStatsView from './view/footer-stats';
import { render } from './utils/render';
import Store from './api/store';
import Provider from './api/provider';

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

new Filter(headerElement, mainElement, filterModel, filmsModel).init();
new Films(mainElement, footerElement, filmsModel, filterModel, apiWithProvider).init();

apiWithProvider.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(
      footerElement,
      new FooterStatsView(filmsModel.getFilms()),
      RenderPosition.BEFOREEND,
    );
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(footerElement, new FooterStatsView(), RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
