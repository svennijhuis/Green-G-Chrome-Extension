import { differenceInMonths } from "date-fns";
export function isNotOlderThanTwoMonthsFilter(date) {
  // new Date, gives you the date of right now
  const now = new Date();
  const differenceInMonthsVariable = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonthsVariable >= 0 && differenceInMonthsVariable <= 1;
}

export function isBetweenTwoToSixMonthsOldFilter(date) {
  const now = new Date();
  const differenceInMonthsVariable = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonthsVariable >= 2 && differenceInMonthsVariable <= 5;
}

export function isBetweenSixToTwelveMonthsOldFilter(date) {
  const now = new Date();
  const differenceInMonthsVariable = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonthsVariable >= 6 && differenceInMonthsVariable <= 11;
}

export function isBetweenOneToTwoYearsOldFilter(date) {
  const now = new Date();
  const differenceInMonthsVariable = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonthsVariable >= 12 && differenceInMonthsVariable <= 23;
}

export function isOlderThanTwoYearsFilter(date) {
  const now = new Date();
  const differenceInMonthsVariable = differenceInMonths(now, date);
  // more than 2 years
  return differenceInMonthsVariable >= 24;
}
