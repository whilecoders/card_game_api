import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMetadataDto {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
