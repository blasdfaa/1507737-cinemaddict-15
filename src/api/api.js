import FilmsModel from '../model/films';
import { Method } from '../utils/const';

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }

  sync(data) {
    return this._load({
      url: '/movies/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON);
  }


  getFilmsData() {
    return this._load({ url: 'movies' })
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  getCommentsList(film) {
    return this._load({ url: `comments/${film.id}` }).then(Api.toJSON);
  }

  addComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON);
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });
  }

  _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }
}
