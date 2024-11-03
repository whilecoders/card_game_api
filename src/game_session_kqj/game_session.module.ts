import { Module } from '@nestjs/common';
import { GameSessionKqjProviders } from './dbrepo/game_session_provider';
import { GameLaunchModule } from 'src/game_launch/game_launch.module';
import { GameSessionKqjResolver } from './game_session.resolver';
import { GameSessionKqjService } from './game_session.service';

@Module({
  imports:[],
  providers: [GameSessionKqjResolver, GameSessionKqjService,...GameSessionKqjProviders],
  exports:[GameSessionKqjService,...GameSessionKqjProviders]
})
export class GameSessionKqjModule {}
