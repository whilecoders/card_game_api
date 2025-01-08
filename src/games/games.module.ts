import { Module } from '@nestjs/common';
import { GamesProviders } from './dbrepo/games.provider';
import { UserModule } from 'src/user/user.module';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [UserModule, AuditLogModule,PermissionModule],
  providers: [GamesResolver, GamesService, ...GamesProviders],
  exports: [...GamesProviders],
})
export class GamesModule {}
