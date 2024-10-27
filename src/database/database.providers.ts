import { DataSource } from 'typeorm';
import * as mysql from 'mysql2';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'card_game',
        entities: [__dirname + '/../**/*.repository{.ts,.js}'],
        synchronize: true,
        driver: mysql,
      });
      return dataSource.initialize();
    },
  },
];
