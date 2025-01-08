import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AuditEntityType, AuditActionType } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

registerEnumType(AuditEntityType, { name: 'AuditEntityType' });
registerEnumType(AuditActionType, { name: 'AuditActionType' });

@ObjectType('AuditLog')
@Entity({
  name: 'audit_log',
})
export class AuditLog extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  details: string;

  @Field(() => AuditActionType, { nullable: false })
  @Column({ type: 'enum', enum: AuditActionType, nullable: false })
  action: AuditActionType;

  @Field(() => AuditEntityType, { nullable: false })
  @Column({ type: 'enum', enum: AuditEntityType, nullable: false })
  entity: AuditEntityType;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.audit_log_id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_log_id' })
  user_id: User;
}
