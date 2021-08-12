import { getRandomArrayInRange, getRandomIntegerInRange, getRandomIntegerInRangeWithFloat } from '../utils/common.js';

const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];

  return titles[getRandomIntegerInRange(0, titles.length - 1)];
};

const generatePoster = () => {
  const posters = [
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png',
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg',
  ];

  return posters[getRandomIntegerInRange(0, posters.length - 1)];
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget',
    'Fusce tristique felis at fermentum pharetra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'Sed sed nisi sed augue convallis suscipit in sed felis',
    'Aliquam erat volutpat',
    'Nunc fermentum tortor ac porta dapibus',
    'In rutrum ac purus sit amet tempus',
  ];

  return getRandomArrayInRange(descriptions, 5).join('. ');
};

const generateWhrites = () => {
  const writers = [
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
  ];

  return getRandomArrayInRange(writers, writers.length);
};

const generateActors = () => {
  const actors = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
  ];

  return getRandomArrayInRange(actors, actors.length);
};

const generateCountry = () => {
  const country = [
    'USA',
    'UK',
    'DE',
    'KZ',
    'UA',
    'RU',
  ];

  return country[getRandomIntegerInRange(0, country.length - 1)];
};

const generateReleaseData = () => {
  const year = getRandomIntegerInRange(2000, 2021);
  const month = getRandomIntegerInRange(1, 12);
  const day = getRandomIntegerInRange(1, 30);

  return [year, month, day].join('-');
};

const generateControlsValue = () => ({
  isViewed: Boolean(getRandomIntegerInRange(0, 1)),
  isFavorite: Boolean(getRandomIntegerInRange(0, 1)),
  inWatchlist: Boolean(getRandomIntegerInRange(0, 1)),
});

const generateComments = () => {
  const comments = [];

  for (let i = 1; i < 7; i++) {
    comments.push(i);
  }

  return getRandomArrayInRange(comments, comments.length - 1);
};

const generateAgeRating = () => {
  const ageList = [13, 16, 18];

  return ageList[getRandomIntegerInRange(0, ageList.length - 1)];
};

const generateGenres = () => {
  const genres = [
    'Sci-Fi',
    'Sports',
    'War',
    'Westerns',
    'Comedy',
    'Crime',
  ];

  return getRandomArrayInRange(genres, 3);
};

export const generateFilmData = () => ({
  title: generateTitle(),
  poster: generatePoster(),
  description: generateDescription(),
  rating: getRandomIntegerInRangeWithFloat(0, 10, 1),
  genres: generateGenres(),
  date: {
    releaseDate: generateReleaseData(),
    runtime: getRandomIntegerInRange(40, 350),
  },
  details: {
    age: generateAgeRating(),
    originalTitle: generateTitle(),
    director: 'Anthony Mann',
    writers: generateWhrites(),
    actors: generateActors(),
    country: generateCountry(),
  },
  comments: generateComments(),
  userInfo: generateControlsValue(),
});
