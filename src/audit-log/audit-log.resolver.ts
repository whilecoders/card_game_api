import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AuditLogService } from './audit-log.service';
import { PaginatedAuditLogDto } from './dto/paginated_audit_log.dto';

@Resolver()
export class AuditLogResolver {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Query(() => PaginatedAuditLogDto, { name: 'getAllGameSessions' })
  async getAllAuditLog(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedAuditLogDto> {
    return this.auditLogService.getAllGameSessions(skip, take);
  }
}
