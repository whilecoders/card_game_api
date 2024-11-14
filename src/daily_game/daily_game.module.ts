import { Module } from '@nestjs/common';
import { DailyGameService } from './daily_game.service';
import { DailyGameResolver } from './daily_game.resolver';
import { DailyGameProviders } from './dbrepo/daily_game.provider';

@Module({
  providers: [DailyGameResolver, DailyGameService, ...DailyGameProviders],
  exports: [...DailyGameProviders],
})
export class DailyGameModule {}
