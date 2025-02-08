import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from 'src/graphql';

@InputType()
export class permissionFilterInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  action?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Boolean, { nullable: true })
  allowed?: boolean;
}
