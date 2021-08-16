import dayjs from 'dayjs';

export const sortByDate = (filmA, filmB) => dayjs(filmB.date.releaseDate).diff(dayjs(filmA.date.releaseDate));

export const sortByRating = (filmA, filmB) => (filmB.rating > filmA.rating) ? 1 : -1;
