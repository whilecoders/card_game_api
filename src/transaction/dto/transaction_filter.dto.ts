import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, isNumber, IsOptional, IsString } from 'class-validator';
import { Role, UserStatus } from 'src/common/constants/enums';

@InputType()
export class TransactionFiltersInput {
    @IsNumber()
    @Field(() => Int)
    take: number;

    @IsNumber()
    @Field(() => Int)
    skip: number;


    @IsOptional()
    @Field(() => Int, { nullable: true })
    id?: number;

}
