import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/common/constants/enums';

@InputType()
export class UpdatePermissionDto {
  @Field(() => Int, { nullable: false })
  @IsNotEmpty({message:"permission id is required"})
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  action?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  allowed?: boolean;
}
