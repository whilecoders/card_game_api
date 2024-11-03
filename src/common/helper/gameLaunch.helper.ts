// import { BadRequestException } from '@nestjs/common';

// export const calculateMinutesDifference = (start: Date, end: Date): number => {
//   const diffMs = end.getTime() - start.getTime();
//   return Math.floor(diffMs / (1000 * 60));
// };

// export const calculateGameInDay = (
//   start_time: Date,
//   end_time: Date,
//   game_duration: string,
// ): number => {
//   const totalAvailableMinutes = calculateMinutesDifference(
//     start_time,
//     end_time,
//   );
//   const [hours, minutes] = game_duration.split(':').map(Number);
//   const gameDurationInMinutes = hours * 60 + minutes;

//   return Math.floor(totalAvailableMinutes / gameDurationInMinutes);
// };

// export const suggestEndTime = (
//   start_time: Date,
//   game_duration: string,
// ): string => {
//   const [hours, minutes] = game_duration.split(':').map(Number);
//   const gameDurationInMs = (hours * 60 + minutes) * 60 * 1000;
//   const suggestedEndTime = new Date(start_time.getTime() + gameDurationInMs);

//   return suggestedEndTime.toISOString().slice(11, 16);
// };

// export const validateGameInterval = (
//   start_time: Date,
//   end_time: Date,
//   game_duration: string,
// ): void => {
//   const totalAvailableMinutes = calculateMinutesDifference(
//     start_time,
//     end_time,
//   );
//   const [hours, minutes] = game_duration.split(':').map(Number);
//   const gameDurationInMinutes = hours * 60 + minutes;

//   if (totalAvailableMinutes % gameDurationInMinutes !== 0) {
//     const suggestedEndTime = suggestEndTime(start_time, game_duration);
//     throw new BadRequestException(
//       `The game duration does not fit evenly into the interval. Adjust the end time to ${suggestedEndTime} for alignment.`,
//     );
//   }
// };




//helper For GameSession
export const calculateSessionEndTime = (start_time: Date, game_duration: string): Date => {
  const durationInMs = parseGameDuration(game_duration);
  // console.log(`Calculating end time from start time ${start_time.toISOString()} with duration ${durationInMs} ms`);
  return new Date(start_time.getTime() + durationInMs);
};

// Parse the game duration string in "HH:MM" format or single hour input to milliseconds
export const parseGameDuration = (game_duration: string): number => {
  let hours: number;
  let minutes: number;

  if (game_duration.includes(':')) {
    // Handle "HH:MM" format
    const [h, m] = game_duration.split(':').map(Number);
    hours = h || 0; // Default to 0 if hours are NaN
    minutes = m || 0; // Default to 0 if minutes are NaN
  } else {
    // Handle single hour input, e.g., "1" should be treated as "1:00"
    hours = Number(game_duration);
    minutes = 0; // Default to 0 minutes
  }

  // Validate hours and minutes
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error('Invalid game duration format. Must be in "HH:MM" format or a single hour value.');
  }

  // Convert to milliseconds
  return (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
};