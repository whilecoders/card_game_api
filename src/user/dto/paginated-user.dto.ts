import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../dbrepo/user.repository';

@ObjectType()
export class PaginatedUserDto {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
