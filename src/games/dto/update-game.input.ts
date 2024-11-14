import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { GameStatus } from 'src/common/constants';
import {
  IsFullDateString,
  IsValidDateRange,
  IsValidTimeFormat,
  IsValidTimeRange,
} from 'src/common/validators';

@InputType()
export class UpdateGamesDto {
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
  game_duration: number;

  @Field(() => Int, { nullable: false })
  @IsNumber({}, { message: 'Game in day must be a valid number.' })
  game_in_day: number;

  @Field(() => GameStatus)
  @IsEnum(GameStatus, { message: 'Invalid game launch status.' })
  game_status?: GameStatus;
}
