import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/common/constants';

@ObjectType('GuestToken')
export class GuestTokenType {
  @Field(() => Role)
  role: Role;

  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
