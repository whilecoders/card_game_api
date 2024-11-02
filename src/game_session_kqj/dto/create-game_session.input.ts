import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';

@InputType()
export class CreateGameSessionDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Game launch ID must be provided' })
  game_launch_id: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Session start time must be provided' })
  session_start_time: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Session end time must be provided' })
  session_end_time: string;

  @Field(() => GameKqjCards, { nullable: true })
  game_result_card?: GameKqjCards;

  @Field(() => GameSessionStatus, { nullable: true })
  @IsEnum(GameSessionStatus, { message: 'Invalid session status' })
  session_status?: GameSessionStatus;
}
