export const toMySqlTime = (date: Date = new Date()) =>
  date.toJSON().slice(0, 19).replace('T', ' ');
