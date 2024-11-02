import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTransactionSessionDto } from './create-transaction_session.input';

@InputType()
export class UpdateTransactionSessionDto extends PartialType(CreateTransactionSessionDto) {
  @Field(() => String)
  id: string; // ID of the transaction session to be updated
}
