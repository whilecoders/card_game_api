import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GameSessionKqj } from '../dbrepo/game_session.repository';

@ObjectType()
export class PaginatedGameSessionKqjDto {
  @Field(() => [GameSessionKqj])
  data: GameSessionKqj[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
