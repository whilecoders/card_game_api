import { DataSource } from 'typeorm';
import { DailyGameRoulette } from './daily-game-roulette.repository';

export const DailyGameRouletteProviders = [
  {
    provide: 'DAILY_GAME_ROULETTE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DailyGameRoulette),
    inject: ['DATA_SOURCE'],
  },
];
