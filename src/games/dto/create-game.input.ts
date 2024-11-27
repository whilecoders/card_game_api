import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { GameType, GameStatus } from 'src/common/constants';
import {
  IsFullDateString,
  IsValidDateRange,
  IsValidTimeFormat,
  IsValidTimeRange,
} from 'src/common/validators';

@InputType()
export class CreateGamesDto {
  @Field(() => Int, { nullable: false })
  @IsNotEmpty({ message: 'user id is required.' })
  admin_id: number;

  @Field(() => GameType, { nullable: false })
  @IsEnum(GameType, {
    message: 'Invalid game selected. Please choose a valid game option.',
  })
  game_type: GameType;

  @Field(() => String, { nullable: false })
  @IsNotEmpty({ message: 'Start time is required.' })
  @IsValidTimeFormat({ message: 'Start time must be in HH:MM:SS format.' })
  start_time: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty({ message: 'End time is required.' })
  @IsValidTimeFormat({ message: 'End time must be in HH:MM:SS format.' })
  @Validate(IsValidTimeRange, {
    message: 'End time must be greater than start time.',
  })
  end_time: string;

  @Field(() => Date, { nullable: false })
  @IsNotEmpty({ message: 'Start Date is required.' })
  @IsFullDateString({
    message: 'Start Date must be a valid ISO date string with seconds.',
  })
  start_date: Date;

  @Field(() => Date, { nullable: false })
  @IsNotEmpty({ message: 'End Date is required.' })
  @IsFullDateString({
    message: 'End Date must be a valid ISO date string with seconds.',
  })
  @Validate(IsValidDateRange, {
    message:
      'End Date must be greater than start date, on the same date, and not the same time.',
  })
  end_date: Date;

  @Field(() => Int, { nullable: false })
  @IsNotEmpty({
    message: 'Game duration is required and must be a number.',
  })
  @IsNumber({}, { message: 'Game duration must be a valid number.' })
  game_duration: number;

  @Field(() => Int, { nullable: false })
  @IsNotEmpty({ message: 'Game in day is required and must be a number.' })
  @IsNumber({}, { message: 'Game in day must be a valid number.' })
  game_in_day: number;

  @Field(() => GameStatus)
  @IsEnum(GameStatus, {
    message: 'Invalid game launch status. Choose a valid status.',
  })
  game_status: GameStatus;
}
