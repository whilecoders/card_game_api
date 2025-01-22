import { Module } from '@nestjs/common';
import { GameResultRouletteService } from './game_result_roulette.service';
import { GameResultRouletteResolver } from './game_result_roulette.resolver';
import { GameResultRouletteProviders } from './dbrepo/game_result_roulette.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [
    GameResultRouletteResolver,
    GameResultRouletteService,
    ...GameResultRouletteProviders,
  ],
  exports: [...GameResultRouletteProviders],
})
export class GameResultRouletteModule {}
