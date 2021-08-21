import { MAX_DESCRIPTION_LENGTH } from './const';

export const getRandomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomIntegerInRangeWithFloat = (min, max, float = 1) => {
  const result = Math.abs(Math.random() * (max - min) + min);

  return result.toFixed(float);
};

export const shuffleArray = (arr) => {
  const copyArray = [...arr];

  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
  }
  return copyArray;
};

export const getRandomArrayInRange = (arr, maxRange) => {
  const newArray = shuffleArray(arr);

  return newArray.slice(0, getRandomIntegerInRange(1, maxRange));
};

export const sliceDescription = (text) =>
  text.length >= MAX_DESCRIPTION_LENGTH ? `${text.slice(0, MAX_DESCRIPTION_LENGTH)}...` : text;

export const getListFromArr = (arr) => arr.join(', ');

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
