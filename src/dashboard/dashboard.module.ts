import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { RecordSessionKqjModule } from 'src/record_session_kqj/record_session_kqj.module';
import { TransactionSessionModule } from 'src/transaction_session/transaction_session.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    GameSessionKqjModule,
    RecordSessionKqjModule,
    TransactionSessionModule,
    UserModule,
  ],
  providers: [DashboardResolver, DashboardService],
})
export class DashboardModule {}
