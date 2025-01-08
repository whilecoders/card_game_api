import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AuditLog } from '../dbrepo/audit_log.repository';

@ObjectType()
export class PaginatedAuditLogDto {
  @Field(() => [AuditLog])
  data: AuditLog[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
