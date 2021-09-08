import { MAX_DESCRIPTION_LENGTH } from './const';

export const sliceDescription = (text) =>
  text.length >= MAX_DESCRIPTION_LENGTH ? `${text.slice(0, MAX_DESCRIPTION_LENGTH)}...` : text;

export const getListFromArr = (arr) => arr.join(', ');
