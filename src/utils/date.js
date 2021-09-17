import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { FilmDurationFormat } from './const';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

export const getTotalFilmsDuration = (films, format) => {
  const totalDuration = films.reduce((acc, rec) => acc + rec.runtime, 0);

  switch (format) {
    case FilmDurationFormat.HOUR:
      return dayjs.duration(totalDuration, 'm').format('H');
    case FilmDurationFormat.MINUTE:
      return dayjs.duration(totalDuration, 'm').format('m');
    case FilmDurationFormat.DAY:
      return dayjs.duration(totalDuration, 'm').format('D');
  }
};

export const getGenres = (films) => {
  const genres = new Set();

  films.forEach((film) => film.genres.forEach((genre) => genres.add(genre)));

  return genres;
};

export const countsGenres = (films) => {
  const allFilmsGenres = [];

  films.forEach((film) => allFilmsGenres.push(...film.genres));

  const genres = [];

  getGenres(films).forEach((genre) =>
    genres.push({
      genre: genre,
      count: allFilmsGenres.filter((allFilmgenre) => allFilmgenre === genre).length,
    }),
  );

  return genres;
};

export const getGenresCounts = (films) => {
  const count = [];

  countsGenres(films).forEach((genre) => count.push(genre.count));

  return count;
};

export const getTopGenre = (films) => {
  const topGenre = countsGenres(films);

  topGenre.sort((prev, next) => next.count - prev.count);

  return topGenre[0].genre;
};
