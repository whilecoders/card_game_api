import { DataSource } from 'typeorm';
import { Games } from './games.repository';

export const GamesProviders = [
  {
    provide: 'GAMES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Games),
    inject: ['DATA_SOURCE'],
  },
];
