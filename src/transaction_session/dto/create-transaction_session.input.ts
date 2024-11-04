import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { TokenValues, TransactionType } from 'src/common/constants';

@InputType()
export class CreateTransactionSessionDto {
  @Field(() => TokenValues, { nullable: false })
  @IsNotEmpty({ message: 'Token value cannot be empty' })
  @IsEnum(TokenValues, { message: 'Invalid token value' })
  token: TokenValues;

  @Field(() => TransactionType, { nullable: false })
  @IsNotEmpty({ message: 'Transaction type cannot be empty' })
  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  type: TransactionType;

  @Field(() => Number, { nullable: false })
  @IsNotEmpty({ message: 'Record session ID cannot be empty' })
  @IsNumber({}, { message: 'Record session ID must be a number' })
  recordSessionId: number;
}
