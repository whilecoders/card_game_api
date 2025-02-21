import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditLog } from './dbrepo/audit_log.repository';
import { PaginatedAuditLogDto } from './dto/paginated_audit_log.dto';
import { AuditLogFiltersInput } from './dto/audit-log-filter.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject('AUDIT_LOG_REPOSITORY')
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getAllGameSessions({
    skip,
    take,
    action,
    entity,
  }: AuditLogFiltersInput): Promise<PaginatedAuditLogDto> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user_id', 'user_id'); // You can adjust the join as needed

    // Add filtering conditions based on 'action' and 'entity' if they are not null
    if (action) {
      queryBuilder.andWhere('audit_log.action = :action', { action });
    }

    if (entity) {
      queryBuilder.andWhere('audit_log.entity = :entity', { entity });
    }

    const [data, count] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount(); // Use getManyAndCount for pagination with count

    return {
      data,
      count,
      skip,
      take,
    };
  }
}
