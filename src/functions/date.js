export function isNotOlderThanTwoMonths(date) {
  // new Date, gives you the date of right now
  const now = new Date();
  const differenceInMonths = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonths >= 0 && differenceInMonths <= 1;
}

export function isBetweenTwoToSixMonthsOld(date) {
  const now = new Date();
  const differenceInMonths = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonths >= 2 && differenceInMonths <= 5;
}

export function isBetweenSixToTwelveMonthsOld(date) {
  const now = new Date();
  const differenceInMonths = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonths >= 6 && differenceInMonths <= 11;
}

export function isBetweenOneToTwoYearsOld(date) {
  const now = new Date();
  const differenceInMonths = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return differenceInMonths >= 12 && differenceInMonths <= 23;
}

export function isOlderThanTwoYears(date) {
  const now = new Date();
  const differenceInMonths = differenceInMonths(now, date);
  // more than 2 years
  return differenceInMonths >= 24;
}
