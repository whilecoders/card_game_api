import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Repository, EntityMetadata } from 'typeorm';
import { AuditLog } from './dbrepo/audit_log.repository';
import {
  AuditActionType,
  AuditDetails,
  AuditEntityType,
} from 'src/common/constants';
import { getRepository } from 'typeorm';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUDIT_LOG_REPOSITORY')
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext.user;

    if (!user) {
      throw new Error(
        'User not found in context. Ensure AuthGuard is applied.',
      );
    }

    return next.handle().pipe(
      tap(async (result) => {
        if (result) {
          const entityType = this.getEntityFromResult(result);
          const action = this.getActionFromEntityState(result);

          // Only log if there's an entity and a valid action
          if (entityType && action) {
            // Log the operation after the DB change happens
            const auditDetails = AuditDetails.create(
              result.createdAt || new Date(),
              user.username,
              entityType,
            );

            await this.auditLogRepository.save({
              action,
              entity: entityType,
              user_id: user.id,
              details: auditDetails,
            });
          }
        }
      }),
    );
  }

  private getEntityFromResult(result: any): AuditEntityType | null {
    const metadata = getRepository(result.constructor).metadata;

    switch (metadata.tableName) {
      case 'games':
        return AuditEntityType.Game;
      case 'game_sessions':
        return AuditEntityType.GameSession;
      case 'users':
        return AuditEntityType.User;
      case 'transactions':
        return AuditEntityType.Transaction;
      default:
        return null;
    }
  }

  private getActionFromEntityState(result: any): AuditActionType | null {
    const metadata: EntityMetadata = getRepository(result.constructor).metadata;

    if (!result.id) {
      // If no ID, it's a new entity (CREATE)
      return AuditActionType.CREATE;
    } else if (result.deletedAt) {
      // If there's a deletedAt field, it's a soft delete (DELETE)
      return AuditActionType.DELETE;
    } else if (
      Object.keys(result).some((key) =>
        metadata.columns.some((col) => col.propertyName === key),
      )
    ) {
      // If any field was updated, it's an UPDATE
      return AuditActionType.UPDATE;
    }
    return null;
  }
}
