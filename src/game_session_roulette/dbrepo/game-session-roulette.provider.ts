import { DataSource } from 'typeorm';
import { GameSessionRoulette } from './game-session-roulette.repository';

export const GameSessionRouletteProviders = [
  {
    provide: 'GAMES_SESSION_ROULETTE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameSessionRoulette),
    inject: ['DATA_SOURCE'],
  },
];
