import { Module } from '@nestjs/common';
import { GameSessionKqjProviders } from './dbrepo/game_session_provider';
import { GameSessionKqjResolver } from './game_session.resolver';
import { GameSessionKqjService } from './game_session.service';
import { UserModule } from 'src/user/user.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [UserModule,PermissionModule],
  providers: [
    GameSessionKqjResolver,
    GameSessionKqjService,
    ...GameSessionKqjProviders,
  ],
  exports: [GameSessionKqjService, ...GameSessionKqjProviders],
})
export class GameSessionKqjModule {}
