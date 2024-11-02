import { DataSource } from 'typeorm';
import { RecordSessionKqj } from './record_session_kqj.repository';

export const RecordSessionKqjProvider = [
  {
    provide: 'RECORD_SESSION_KQJ_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RecordSessionKqj),
    inject: ['DATA_SOURCE'],
  },
];
