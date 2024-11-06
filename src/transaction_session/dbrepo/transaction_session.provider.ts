import { DataSource } from 'typeorm';
import { TransactionSession } from './transaction_session.repository';

export const TransactionSessionProvider = [
  {
    provide: 'TRANSACTION_SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionSession),
    inject: ['DATA_SOURCE'],
  },
];
