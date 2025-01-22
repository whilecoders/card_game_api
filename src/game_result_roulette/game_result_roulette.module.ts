import { Module } from '@nestjs/common';
import { GameResultRouletteService } from './game_result_roulette.service';
import { GameResultRouletteResolver } from './game_result_roulette.resolver';
import { GameResultRouletteProviders } from './dbrepo/game_result_roulette.provider';

@Module({
  providers: [
    GameResultRouletteResolver,
    GameResultRouletteService,
    ...GameResultRouletteProviders,
  ],
  exports: [...GameResultRouletteProviders],
})
export class GameResultRouletteModule {}
