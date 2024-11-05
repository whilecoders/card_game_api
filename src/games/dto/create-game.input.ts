import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { GameType, GameStatus } from 'src/common/constants';
import { IsFullDateString } from 'src/common/validators';

@InputType()
export class CreateGamesDto {
  @Field(() => Number,{nullable:false})
  @IsNotEmpty({ message: 'user id is required.' })
  user_id: number;

  @Field(() => GameType,{nullable:false})
  @IsEnum(GameType, {
    message: 'Invalid game selected. Please choose a valid game option.',
  })
  game_type: GameType;

  @Field(() => Date,{nullable:false})
  @IsNotEmpty({ message: 'Start time is required.' })
  @IsFullDateString({
    message: 'Start time must be a valid ISO date string with seconds.',
  })
  start_time: Date;

  @Field(() => Date,{nullable:false})
  @IsNotEmpty({ message: 'End time is required.' })
  @IsFullDateString({
    message: 'End time must be a valid ISO date string with seconds.',
  })
  end_time: Date;

  @Field(() => Number,{nullable:false})
  @IsNotEmpty({
    message: 'Game duration is required and must be a number.',
  })
  @IsNumber({}, { message: 'Game duration must be a valid number.' })
  game_duration: number;

  @Field(() => Number,{nullable:false})
  @IsNotEmpty({ message: 'Game in day is required and must be a number.' }) 
  @IsNumber({}, { message: 'Game in day must be a valid number.' })
  game_in_day: number;

  @Field(() => GameStatus)
  @IsEnum(GameStatus, {
    message: 'Invalid game launch status. Choose a valid status.',
  })
  game_status: GameStatus;
}
