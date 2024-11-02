import { DataSource } from 'typeorm';
import { GameLaunch } from './game_launch.repository';

export const GameLaunchProviders = [
  {
    provide: 'GAME_LAUNCH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameLaunch),
    inject: ['DATA_SOURCE'],
  },
];
