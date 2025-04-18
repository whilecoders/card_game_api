import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Games } from '../dbrepo/games.repository';

@ObjectType()
export class PaginatedGamesDto {
  @Field(() => [Games])
  data: Games[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
