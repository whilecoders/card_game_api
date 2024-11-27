import { DataSource } from 'typeorm';
import { DailyGame } from './daily_game.repository';

export const DailyGameProviders = [
  {
    provide: 'DAILY_GAME_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DailyGame),
    inject: ['DATA_SOURCE'],
  },
];
