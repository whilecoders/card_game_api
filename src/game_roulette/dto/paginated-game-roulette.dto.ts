import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Games } from 'src/games/dbrepo/games.repository';

@ObjectType()
export class PaginatedGameRouletteDto {
  @Field(() => [Games])
  data: Games[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
