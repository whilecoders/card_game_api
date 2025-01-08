import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditLog } from './dbrepo/audit_log.repository';
import { PaginatedAuditLogDto } from './dto/paginated_audit_log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject('AUDIT_LOG_REPOSITORY')
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getAllGameSessions(
    skip: number,
    take: number,
  ): Promise<PaginatedAuditLogDto> {
    const [data, count] = await this.auditLogRepository.findAndCount({
      relations: ['user_id'],
      skip,
      take,
    });

    return {
      data,
      count,
      skip,
      take,
    };
  }
}
