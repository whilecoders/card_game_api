import { InputType, Field, Int } from '@nestjs/graphql';
import { Role, UserStatus } from 'src/common/constants/enums';

@InputType()
export class UserFiltersInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  phone_number?: string;
}
