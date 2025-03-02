import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class SuspendUserDto {
  @Field(() => Int)
  @IsInt()
  userId: number;
}
