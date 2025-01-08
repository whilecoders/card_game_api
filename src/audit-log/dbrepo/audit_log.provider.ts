import { DataSource } from 'typeorm';
import { AuditLog } from './audit_log.repository';

export const AuditLogProviders = [
  {
    provide: 'AUDIT_LOG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AuditLog),
    inject: ['DATA_SOURCE'],
  },
];
