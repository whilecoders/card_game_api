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

// Helper function to format Date as HH:MM:SS
export const calculateSessionEndTime = (start_time: Date,game_duration: string,): Date => {
  const durationInMs = parseGameDuration(game_duration);
  return new Date(start_time.getTime() + durationInMs);
};

export const parseGameDuration = (game_duration: string): number => {
  // Assuming game_duration is in format "HH:MM"
  const [hours, minutes] = game_duration.split(':').map(Number);
  return (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
};
