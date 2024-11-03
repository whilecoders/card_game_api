import { InputType, Field } from '@nestjs/graphql';
import { TokenValues, TransactionType } from 'src/common/constants';

@InputType()
export class CreateTransactionSessionDto {
  @Field(() => TokenValues)
  token: TokenValues;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => String)
  recordSessionId: string;
}
