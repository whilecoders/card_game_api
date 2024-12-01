import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { UserModule } from 'src/user/user.module';
import { RecordSessionKqjModule } from 'src/record_session_kqj/record_session_kqj.module';
import { TransactionSessionModule } from 'src/transaction_session/transaction_session.module';

@Module({
  imports: [GameSessionKqjModule,UserModule,RecordSessionKqjModule,TransactionSessionModule],
  providers: [DashboardResolver, DashboardService],
})
export class DashboardModule {}
