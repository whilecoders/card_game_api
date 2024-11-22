import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/constants/enums';

@InputType()
export class UpdateUserDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Role, { nullable: true })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @Field(() => String, { nullable: true })
  @IsOptional()
  city?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  phone_number?: number;
}
