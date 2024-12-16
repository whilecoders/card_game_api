import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsDateString } from 'class-validator';

@InputType()
export class DateFilterDto {
  @Field(() => Date, { nullable: true })
  @IsOptional()
  // @IsDateString()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  // @IsDateString()
  endDate?: Date;
}
