import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Game, GameLaunchStatus } from 'src/common/constants';
import { IsFullDateString } from 'src/common/validators';

@InputType()
export class CreateGameLaunchDto {
  @Field(() => Game)
  @IsEnum(Game, { message: 'Invalid game selected. Please choose a valid game option.' })
  game: Game;

  @Field(() => String)
  @IsNotEmpty({ message: 'Start time is required.' })
  @IsFullDateString({ message: 'Start time must be a valid ISO date string with seconds.' })
  start_time: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'End time is required.' })
  @IsFullDateString({ message: 'End time must be a valid ISO date string with seconds.' })
  end_time: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Game duration is required and must be a valid time format (e.g., "1h30m").' })
  game_duration: string;

  @Field(() => Number)
  @IsNumber({}, { message: 'Game in day must be a number if provided.' })
  game_in_day: number;

  @Field(() => GameLaunchStatus)
  @IsEnum(GameLaunchStatus, { message: 'Invalid game launch status. Choose a valid status.' })
  game_launch_status: GameLaunchStatus;
}
