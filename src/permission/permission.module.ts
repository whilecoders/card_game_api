import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { PermissionProviders } from './dbrepo/permission.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [PermissionResolver, PermissionService, ...PermissionProviders],
  exports: [...PermissionProviders, PermissionService],
})
export class PermissionModule {}
