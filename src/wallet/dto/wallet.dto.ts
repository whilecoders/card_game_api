import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { TransactionType } from 'src/common/constants';

@InputType() 
export class WalletDto {
  @Field(()=>Number) 
  @IsNumber()
  amount: number;

  @Field(()=>TransactionType) 
  @IsEnum([TransactionType], { message: "Type must be 'credit' or 'debit'" })
  type: TransactionType;
}
