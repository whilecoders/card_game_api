import { Module } from '@nestjs/common';
import { TaskScheduler } from './task_scheduler.service';
import { GamesModule } from 'src/games/games.module';
import { GameSessionKqjModule } from 'src/game_session_kqj/game_session.module';
import { DailyGameModule } from 'src/daily_game/daily_game.module';
import { GamesocketModule } from 'src/gamesocket/gamesocket.module';

@Module({
  imports: [GamesModule, GameSessionKqjModule, DailyGameModule, GamesocketModule],
  providers: [TaskScheduler],

})
export class TaskSchedulerModule { }
