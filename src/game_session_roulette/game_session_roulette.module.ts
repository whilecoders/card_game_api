import { Module } from '@nestjs/common';
import { GameSessionRouletteService } from './game_session_roulette.service';
import { GameSessionRouletteResolver } from './game_session_roulette.resolver';
import { GameSessionRouletteProviders } from './dbrepo/game-session-roulette.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    GameSessionRouletteResolver,
    GameSessionRouletteService,
    ...GameSessionRouletteProviders,
  ],
  exports: [...GameSessionRouletteProviders, GameSessionRouletteService],
})
export class GameSessionRouletteModule {}
