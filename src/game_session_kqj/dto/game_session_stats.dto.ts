import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('GameSessionKqjStats')
export class GameSessionKqjStats {
  @Field(() => Int)
  totalGamePlayed: number;

  @Field(() => Int)
  totalWins: number;

  @Field(() => Int)
  totalLosses: number;
}
