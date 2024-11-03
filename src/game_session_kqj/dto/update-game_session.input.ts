import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';

@InputType()
export class UpdateGameSessionDto {
  
  @Field(() => GameKqjCards)
  game_result_card: GameKqjCards;

  @Field(() => GameSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(GameSessionStatus)
  session_status?: GameSessionStatus;
}
