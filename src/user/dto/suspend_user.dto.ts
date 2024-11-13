import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SuspendUserDto {
  @Field(() => Int)
  @IsString()
  userId: number;

  @Field(() => Boolean)
  suspend: boolean;
}
