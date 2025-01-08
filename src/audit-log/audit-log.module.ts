import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogResolver } from './audit-log.resolver';
import { AuditLogProviders } from './dbrepo/audit_log.provider';

@Module({
  providers: [AuditLogResolver, AuditLogService, ...AuditLogProviders],
  exports: [...AuditLogProviders],
})
export class AuditLogModule {}
