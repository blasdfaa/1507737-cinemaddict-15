import dayjs from 'dayjs';

export const sortByDate = (filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

export const sortByRating = (filmA, filmB) => (filmB.filmRating > filmA.filmRating ? 1 : -1);
