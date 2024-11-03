import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber, Matches } from 'class-validator';
import { GameLaunchStatus } from 'src/common/constants';
import { IsFullDateString } from 'src/common/validators';

@InputType()
export class UpdateGameLaunchDto {
  @Field(() => String)
  @IsFullDateString({ message: 'Start time must be a valid ISO date string with seconds.' })
  start_time: string;

  @Field(() => String)
  @IsFullDateString({ message: 'End time must be a valid ISO date string with seconds.' })
  end_time: string;

  @Field(() => String)
  game_duration: string;

  @Field(() => Number)
  @IsNumber({}, { message: 'Game in day must be a valid number.' })
  game_in_day: number;

  @Field(() => GameLaunchStatus)
  @IsEnum(GameLaunchStatus, { message: 'Invalid game launch status.' })
  game_launch_status?: GameLaunchStatus;
}
