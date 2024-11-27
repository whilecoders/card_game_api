import { Field, Int, ObjectType } from '@nestjs/graphql';

export function PaginatedDto<T>(itemType: T): any {
  @ObjectType({ isAbstract: true })
  class PaginatedDtoClass {
    @Field(() => [itemType])
    data: T[];

    @Field(() => Int)
    count: number;

    @Field(() => Int)
    take: number;

    @Field(() => Int)
    skip: number;
  }

  return PaginatedDtoClass;
}
