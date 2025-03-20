import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../dbrepo/transaction.repository';

@ObjectType()
export class PaginatedTranscationDto {
    @Field(() => [Transaction])
    data: Transaction[];

    @Field(() => Int)
    count: number;

    @Field(() => Int)
    take: number;

    @Field(() => Int)
    skip: number;
}
