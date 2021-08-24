import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};
