import AbstractView from './abstract';
import { FilterType } from '../utils/const';

const EmptyListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyListTemplate = (filterType) => {
  const emptyListText = EmptyListTextType[filterType];

  return (
    `<h2 class="films-list__title">${emptyListText}</h2>`
  );
};


export default class EmptyList extends AbstractView {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createEmptyListTemplate(this._data);
  }
}
