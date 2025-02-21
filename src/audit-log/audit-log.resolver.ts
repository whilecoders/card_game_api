import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AuditLogService } from './audit-log.service';
import { PaginatedAuditLogDto } from './dto/paginated_audit_log.dto';
import { AuditLogFiltersInput } from './dto/audit-log-filter.dto';

@Resolver()
export class AuditLogResolver {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Query(() => PaginatedAuditLogDto)
  async getAllAuditLog(
    @Args('AuditLogFiltersInput') auditLogFiltersInput: AuditLogFiltersInput,
  ): Promise<PaginatedAuditLogDto> {
    return this.auditLogService.getAllGameSessions(auditLogFiltersInput);
  }
}
