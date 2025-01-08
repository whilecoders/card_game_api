import { formatDate } from '../helper/DateFormatter';
import { AuditEntityType } from './enums';

export const AuditDetails = {
  create: (time: Date, user: string, entity: AuditEntityType) =>
    `${entity} is created At ${formatDate(time)} By ${user}`,

  update: (time: Date, user: string, entity: AuditEntityType) =>
    `${entity} is updated At ${formatDate(time)} By ${user}`,

  delete: (time: Date, user: string, entity: AuditEntityType) =>
    `${entity} is deleted At ${formatDate(time)} By ${user}`,
};
