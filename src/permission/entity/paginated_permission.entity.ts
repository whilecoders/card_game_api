import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Permission } from '../dbrepo/permission.repository';

@ObjectType()
export class PaginatedPermission {
  @Field(() => [Permission])
  data: Permission[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
