import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/dbrepo/user.repository';

@ObjectType('UserToken')
export class UserTokenType{
  @Field(() => User)
  user: User;

  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
