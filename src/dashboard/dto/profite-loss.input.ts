import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProfitAndLoss {
  @Field()
  profit: number;

  @Field()
  loss: number;

  @Field()
  net: number;
}
