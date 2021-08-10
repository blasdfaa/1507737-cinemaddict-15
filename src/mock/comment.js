import { getRandomIntegerInRange } from '../utils/common.js';

export const generateCommentsData = () => {
  const generateCommentId = () => {
    const id = [];

    for (let i = 1; i < 20; i++) {
      id.push(i);
    }

    return id[getRandomIntegerInRange(0, id.length - 1)];
  };

  const generateAuthor = () => {
    const authors = [
      'Erich von Stroheim',
      'Mary Beth Hughes',
      'Dan Duryea',
      'Anne Wigton',
      'Heinz Herald',
      'Richard Weil',
    ];

    return authors[getRandomIntegerInRange(0, authors.length - 1)];
  };

  const generateComments = () => {
    const comments = [
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

    return comments[getRandomIntegerInRange(0, comments.length - 1)];
  };

  const generateEmoji = () => {
    const emoji = ['smile', 'sleeping', 'puke', 'angry'];

    return emoji[getRandomIntegerInRange(0, emoji.length - 1)];
  };

  const generateCommentDate = () => {
    const dates = [
      '2013-01-01T01:05:13.554Z',
      '2014-02-02T20:01:54.554Z',
      '2015-03-03T11:12:34.554Z',
      '2016-04-13T17:10:55.554Z',
      '2017-05-16T19:16:32.554Z',
      '2018-06-06T11:09:22.554Z',
      '2019-07-10T16:12:32.554Z',
      '2020-08-11T16:12:11.554Z',
    ];

    return dates[getRandomIntegerInRange(0, dates.length - 1)];
  };

  return {
    id: generateCommentId(),
    author: generateAuthor(),
    text: generateComments(),
    emoji: generateEmoji(),
    date: generateCommentDate(),
  };
};
