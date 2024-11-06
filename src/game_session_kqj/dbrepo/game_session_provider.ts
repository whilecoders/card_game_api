import { DataSource } from 'typeorm';
import { GameSessionKqj } from './game_session.repository';

export const GameSessionKqjProviders = [
  {
    provide: 'GAME_SESSION_KQJ_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameSessionKqj),
    inject: ['DATA_SOURCE'],
  },
];
