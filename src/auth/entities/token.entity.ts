import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Token')
export class TokenType {
  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
