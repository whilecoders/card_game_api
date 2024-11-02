import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { GameLaunchStatus } from 'src/common/constants';

@InputType()
export class UpdateGameLaunchDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  start_time?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  end_time?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  game_duration?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Game in day must be a valid number if provided.' })
  game_in_day?: number;

  @Field(() => GameLaunchStatus, { nullable: true })
  @IsOptional()
  @IsEnum(GameLaunchStatus, { message: 'Invalid game launch status. Please provide a valid status option.' })
  game_launch_status?: GameLaunchStatus;
}
