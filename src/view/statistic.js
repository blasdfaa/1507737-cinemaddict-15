import { BAR_HEIGHT_SIZE, FilmDurationFormat, StatsFilterType } from '../utils/const';
import { getGenres, getGenresCount, getTopGenre, getTotalFilmsDuration } from '../utils/date';
import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderGenresChart = (statisticCtx, films) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: Array.from(getGenres(films)),
    datasets: [{
      data: getGenresCount(films),
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
      barThickness: 30,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const createStatisticTemplate = (rating, currentFilter, films) => (
  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-all-time"
        value="${StatsFilterType.ALL}"
        ${currentFilter === StatsFilterType.ALL ? 'checked' : ''}
      >
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-today"
        value="${StatsFilterType.TODAY}"
        ${currentFilter === StatsFilterType.TODAY ? 'checked' : ''}
      >
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-week"
        value="${StatsFilterType.WEEK}"
        ${currentFilter === StatsFilterType.WEEK ? 'checked' : ''}
      >
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-month"
        value="${StatsFilterType.MONTH}"
        ${currentFilter === StatsFilterType.MONTH ? 'checked' : ''}
      >
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-year" value="${StatsFilterType.YEAR}"
        ${currentFilter === StatsFilterType.YEAR ? 'checked' : ''}
      >
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">
          ${films.length}
        <span class="statistic__item-description">
          ${films.length > 1 ? 'movies' : 'movie'}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
      ${getTotalFilmsDuration(films, FilmDurationFormat.DAY) > 0 ?
    `${getTotalFilmsDuration(
      films,
      FilmDurationFormat.DAY,
    )} <span class="statistic__item-description">d</span>` : ''}
      ${getTotalFilmsDuration(films, FilmDurationFormat.HOUR) > 0 ? `${getTotalFilmsDuration(
    films,
    FilmDurationFormat.HOUR,
  )}
       <span class="statistic__item-description">h</span>` : ''}

        ${getTotalFilmsDuration(films, FilmDurationFormat.MINUTE)}
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${films.length ? getTopGenre(films) : ''}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas
        class="statistic__chart"
        width="1000"
        height="${BAR_HEIGHT_SIZE * getGenres(films).size}"
      >
      </canvas>
    </div>
  </section>
`);

export default class StatsScreen extends AbstractView {
  constructor(rating, currentFilter, films) {
    super();

    this._rating = rating;
    this._currentFilter = currentFilter;
    this._films = films;

    this._statisticCart = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._setChart();
  }

  removeElement() {
    super.removeElement();

    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }
  }

  getTemplate() {
    return createStatisticTemplate(this._rating, this._currentFilter, this._films);
  }

  _getScrollPositon() {
    return this.renderElement().scrollTop;
  }

  _setScrollPosition(value) {
    this.renderElement().scrollTop = value;
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const scroll = this._getScrollPositon();

    this._callback.filterTypeChange(evt.target.value);
    this._setScrollPosition(scroll);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.renderElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._filterTypeChangeHandler);
  }

  _setChart() {
    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }

    const statisticCtx = this.renderElement().querySelector('.statistic__chart');
    this._statisticCart = renderGenresChart(statisticCtx, this._films);
  }
}
