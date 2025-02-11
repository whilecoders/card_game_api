import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, isNumber, IsOptional, IsString } from 'class-validator';
import { Role, UserStatus } from 'src/common/constants/enums';

@InputType()
export class UserFiltersInput {
  @IsNumber()
  @Field(() => Int)
  take: number;

  @IsNumber()
  @Field(() => Int)
  skip: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  username?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Field(() => Role, { nullable: true })
  role?: Role;

  @IsOptional()
  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  city?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  phone_number?: string;
}
