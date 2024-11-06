import { Module } from '@nestjs/common';
import { TransactionSessionService } from './transaction_session.service';
import { TransactionSessionResolver } from './transaction_session.resolver';
import { TransactionSessionProvider } from './dbrepo/transaction_session.provider';
import { RecordSessionKqjModule } from 'src/record_session_kqj/record_session_kqj.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[RecordSessionKqjModule,UserModule],
  providers: [TransactionSessionResolver, TransactionSessionService,...TransactionSessionProvider],
  exports:[...TransactionSessionProvider]
})
export class TransactionSessionModule {}
