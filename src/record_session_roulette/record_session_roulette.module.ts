import { Module } from '@nestjs/common';
import { RecordSessionRouletteService } from './record_session_roulette.service';
import { RecordSessionRouletteResolver } from './record_session_roulette.resolver';
import { RecordSessionRouleteProviders } from './dbrepo/record-session-roulette.provider';
import { UserModule } from 'src/user/user.module';
import { GameSessionRouletteModule } from 'src/game_session_roulette/game_session_roulette.module';

@Module({
  imports: [UserModule, GameSessionRouletteModule],
  providers: [
    RecordSessionRouletteResolver,
    RecordSessionRouletteService,
    ...RecordSessionRouleteProviders,
  ],
  exports: [...RecordSessionRouleteProviders, RecordSessionRouletteService],
})
export class RecordSessionRouletteModule {}
