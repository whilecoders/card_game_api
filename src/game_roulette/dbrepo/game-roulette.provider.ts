import { DataSource } from 'typeorm';
import { GameRoulette } from './game-roulette.repository';

export const GameRouletteProviders = [
  {
    provide: 'GAMES_ROULETTE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameRoulette),
    inject: ['DATA_SOURCE'],
  },
];
