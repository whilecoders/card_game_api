import { DateTime } from 'luxon';

/**
 * Converts a UTC time to a specified local time zone.
 * @param utcDate - The UTC Date object to be converted.
 * @param timeZone - The target time zone (e.g., 'Asia/Kolkata', 'America/New_York').
 * @returns {string} - The formatted date-time string in the specified local time zone.
 */
export const convertUtcToLocalTimeZone = (
  utcDate: Date,
  timeZone: string,
): Date => {
  const localDateTime = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(
    timeZone,
  ); // Set the local time zone

  return localDateTime.toJSDate(); // Return as a JavaScript Date object
};
