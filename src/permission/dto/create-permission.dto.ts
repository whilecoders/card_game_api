import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/common/constants/enums';

@InputType()
export class CreatePermissionInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  action: string;

  @IsOptional()
  @Field(() => Role, { nullable: true })
  role?: Role;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  userId?: number;

  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  allowed: boolean;
}
