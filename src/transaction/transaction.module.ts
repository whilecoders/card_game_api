import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TransactionProviders } from './dbrepo/transaction.provider';

@Module({
  providers: [TransactionResolver, TransactionService, ...TransactionProviders],
  exports: [...TransactionProviders]
})
export class TransactionModule { }
