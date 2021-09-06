import dayjs from 'dayjs';
import { MAX_FILMS_COUNT, MIN_FILMS_COUNT, ProfileRank, TIME_COUNT, ZERO_FILMS_COUNT } from './const';

export const getUserRating = (watchedCount) => {
  const isNoviceRank = watchedCount > ZERO_FILMS_COUNT && watchedCount <= MIN_FILMS_COUNT;
  const isFanRank = watchedCount > MIN_FILMS_COUNT && watchedCount <= MAX_FILMS_COUNT;
  const isMovieBuffRank = watchedCount > MAX_FILMS_COUNT;

  switch (watchedCount) {
    case isNoviceRank:
      return ProfileRank.NOVICE;
    case isFanRank:
      return ProfileRank.FAN;
    case isMovieBuffRank:
      return ProfileRank.MOVIE_BUFF;
    default:
      return '';
  }
};

export const filterStatsByWatchingDate = (films, period) => {
  const deadline = dayjs().subtract(TIME_COUNT, period);
  return films.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};
