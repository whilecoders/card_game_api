import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';

@InputType()
export class UpdateGameSessionDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  session_start_time?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  session_end_time?: string;

  @Field(() => GameKqjCards, { nullable: true })
  game_result_card?: GameKqjCards;

  @Field(() => GameSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(GameSessionStatus)
  session_status?: GameSessionStatus;
  game_launch_id: any;
}
