import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { GameStatus } from 'src/common/constants';
import { IsFullDateString } from 'src/common/validators';

@InputType()
export class UpdateGamesDto {
  @Field(() => Date,{nullable:false})
  @IsFullDateString({ message: 'Start time must be a valid ISO date string with seconds.' })
  start_time: Date;

  @Field(() => Date,{nullable:false})
  @IsFullDateString({ message: 'End time must be a valid ISO date string with seconds.' })
  end_time: Date;

  @Field(() => Number,{nullable:false})
  game_duration: number;

  @Field(() => Number,{nullable:false})
  @IsNumber({}, { message: 'Game in day must be a valid number.' })
  game_in_day: number;

  @Field(() => GameStatus)
  @IsEnum(GameStatus, { message: 'Invalid game launch status.' })
  game_status?: GameStatus;
}
