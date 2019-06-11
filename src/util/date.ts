import * as moment from 'moment';

export const getYYYYMMDD = (date?: Date) => {
  const input = moment(date) || moment();
  return input.format('YYYY-MM-DD');
} 