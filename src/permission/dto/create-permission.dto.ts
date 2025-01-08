import { Field, InputType } from '@nestjs/graphql';
import { Role } from 'src/common/constants/enums';

@InputType()
export class CreatePermissionInput {
  @Field(() => String)
  action: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => String, { nullable: true })
  userId?: number;

  @Field(() => Boolean)
  allowed: boolean;
}
