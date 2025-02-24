import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class AuditLogFiltersInput {
  @IsNumber()
  @Field(() => Int)
  take: number;

  @IsNumber()
  @Field(() => Int)
  skip: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  action?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  entity?: string;
}
