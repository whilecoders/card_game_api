import { InputType, Field } from '@nestjs/graphql';
import { TokenValues, TransactionType } from 'src/common/constants';

@InputType()
export class CreateTransactionSessionDto {
  @Field(() => TokenValues)
  token: TokenValues;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType; // Optional, default to CREDIT

  @Field(() => String) // Assuming the Record Session ID is passed as a string
  recordSessionId: string;
}
