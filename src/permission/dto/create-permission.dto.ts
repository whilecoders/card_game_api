import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/constants/enums';

@InputType()
export class CreatePermissionInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  action: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  allowed: boolean;
}
