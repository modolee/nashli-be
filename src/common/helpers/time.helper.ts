import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const DEFAULT_TIMEZONE = 'Asia/Seoul';

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getDateString = (date, format = 'YYYY-MM-DD', timezone = DEFAULT_TIMEZONE) =>
  dayjs(date)
    .tz(timezone)
    .format(format);

export const getTodayString = (format = 'YYYY-MM-DD', timezone = DEFAULT_TIMEZONE) =>
  dayjs()
    .tz(timezone)
    .format(format);

export const getTomorrowString = (format = 'YYYY-MM-DD', timezone = DEFAULT_TIMEZONE) =>
  dayjs()
    .tz(timezone)
    .add(1, 'day')
    .format(format);

export const getStartOfDayTimestamp = (date, timezone = DEFAULT_TIMEZONE) =>
  dayjs(date)
    .tz(timezone)
    .startOf('day')
    .valueOf();

export const getNow = (format = 'YYYY-MM-DD ddd HH:mm:ss Z', timezone = DEFAULT_TIMEZONE) =>
  dayjs()
    .tz(timezone)
    .format(format);
