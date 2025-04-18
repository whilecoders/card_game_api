import { forwardRef, Module } from '@nestjs/common';
import { RecordSessionKqjService } from './record_session_kqj.service';
import { RecordSessionKqjResolver } from './record_session_kqj.resolver';
import { RecordSessionKqjProvider } from './dbrepo/record_session_kqj.provider';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { UserModule } from 'src/user/user.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    forwardRef(() => GameSessionKqjModule),
    UserModule,
    PermissionModule,
  ],
  providers: [
    RecordSessionKqjResolver,
    RecordSessionKqjService,
    ...RecordSessionKqjProvider,
  ],
  exports: [...RecordSessionKqjProvider, RecordSessionKqjService],
})
export class RecordSessionKqjModule {}
