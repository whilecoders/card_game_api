import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GameSessionRoulette } from '../dbrepo/game-session-roulette.repository';

@ObjectType()
export class PaginatedGameSessionRouletteDto {
  @Field(() => [GameSessionRoulette])
  data: GameSessionRoulette[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
