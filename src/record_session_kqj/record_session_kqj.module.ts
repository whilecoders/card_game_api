import { Module } from '@nestjs/common';
import { RecordSessionKqjService } from './record_session_kqj.service';
import { RecordSessionKqjResolver } from './record_session_kqj.resolver';
import { RecordSessionKqjProvider } from './dbrepo/record_session_kqj.provider';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[GameSessionKqjModule,UserModule],
  providers: [RecordSessionKqjResolver, RecordSessionKqjService,...RecordSessionKqjProvider],
  exports:[...RecordSessionKqjProvider]
})
export class RecordSessionKqjModule {}
