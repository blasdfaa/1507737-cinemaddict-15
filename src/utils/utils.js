import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { MAX_DESCRIPTION_LENGTH } from './const';

dayjs.extend(duration);

export const getRandomInteger = (min, max) => Math.abs(Math.floor(min + Math.random() * (max + 1 - min)));

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

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

export const sliceDescription = (text) =>
  text.length >= MAX_DESCRIPTION_LENGTH ? `${text.slice(0, MAX_DESCRIPTION_LENGTH)}...` : text;

export const getListFromArr = (arr) => arr.join(', ');

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const removeDOMElement = (className) => document.querySelector(className).remove();
