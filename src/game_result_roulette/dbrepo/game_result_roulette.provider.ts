import { DataSource } from 'typeorm';
import { GameResultRoulette } from './game_result_roulette.repository';

export const GameResultRouletteProviders = [
  {
    provide: 'GAME_RESULT_ROULETTE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameResultRoulette),
    inject: ['DATA_SOURCE'],
  },
];
