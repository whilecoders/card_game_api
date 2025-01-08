import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserProviders } from './dbrepo/user.provider';
import { PermissionModule } from 'src/permission/permission.module';
import { JWTService } from 'src/common/helper';

@Module({
  imports: [PermissionModule],
  providers: [UserResolver, UserService, ...UserProviders, JWTService],
  exports: [...UserProviders, UserService],
})
export class UserModule {}
