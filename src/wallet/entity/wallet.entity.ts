import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/dbrepo/user.repository';
import { Transaction } from 'typeorm';

@ObjectType('Wallet')
export class WalletType {
  @Field(() => User)
  user: User;
  @Field(() => Transaction)
  transaction: Transaction;
}
