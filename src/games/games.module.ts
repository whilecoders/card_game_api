import { Module, forwardRef } from '@nestjs/common';
import { GamesProviders } from './dbrepo/games.provider';
import { UserModule } from 'src/user/user.module';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';

@Module({
  imports: [UserModule, forwardRef(() => GameSessionKqjModule)],
  providers: [GamesResolver, GamesService, ...GamesProviders],
  exports: [...GamesProviders],
})
export class GamesModule {}
