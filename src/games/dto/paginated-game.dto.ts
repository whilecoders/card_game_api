import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/helper';
import { Games } from '../dbrepo/games.repository';

// @ObjectType()
// export class PaginatedGamesDto extends PaginatedDto(Games) {}

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
