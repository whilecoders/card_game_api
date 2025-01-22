import { Module } from '@nestjs/common';
import { GameResultRouletteService } from './game_result_roulette.service';
import { GameResultRouletteResolver } from './game_result_roulette.resolver';
import { GameResultRouletteProviders } from './dbrepo/game_result_roulette.provider';
import { UserModule } from 'src/user/user.module';
import { RecordSessionRouletteModule } from 'src/record_session_roulette/record_session_roulette.module';

@Module({
  imports: [UserModule, RecordSessionRouletteModule],
  providers: [
    GameResultRouletteResolver,
    GameResultRouletteService,
    ...GameResultRouletteProviders,
  ],
  exports: [...GameResultRouletteProviders, GameResultRouletteService],
})
export class GameResultRouletteModule {}
