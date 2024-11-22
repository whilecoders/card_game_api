import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DailyWinnersAndLosers {
  @Field()
  winners: number;

  @Field()
  losers: number;
}
