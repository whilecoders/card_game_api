import { DataSource } from 'typeorm';
import { Permission } from './permission.repository';

export const PermissionProviders = [
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Permission),
    inject: ['DATA_SOURCE'],
  },
];
