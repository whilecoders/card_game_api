import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { TokenValues, TransactionType } from 'src/common/constants';

@InputType()
export class WalletDto {
  @Field(() => TokenValues)
  @IsNumber()
  token: TokenValues;

  @Field(() => TransactionType)
  @IsEnum([TransactionType], { message: "Type must be 'credit' or 'debit'" })
  type: TransactionType;
}
