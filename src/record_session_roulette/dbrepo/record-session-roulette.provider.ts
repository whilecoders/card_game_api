import { DataSource } from 'typeorm';
import { RecordSessionRoulette } from './record-session-roulette.repository';

export const RecordSessionRouleteProviders = [
  {
    provide: 'RECORD_SESSION_ROULETTE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RecordSessionRoulette),
    inject: ['DATA_SOURCE'],
  },
];
