import { Module, forwardRef } from '@nestjs/common';
import { GameLaunchService } from './game_launch.service';
import { GameLaunchResolver } from './game_launch.resolver';
import { GameLaunchProviders } from './dbrepo/game_launch.provider';
import { UserModule } from 'src/user/user.module';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';

@Module({
  imports: [UserModule, forwardRef(() => GameSessionKqjModule)],
  providers: [GameLaunchResolver, GameLaunchService, ...GameLaunchProviders],
  exports: [...GameLaunchProviders],
})
export class GameLaunchModule {}
