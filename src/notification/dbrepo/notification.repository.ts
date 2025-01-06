import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { NotificationStatus, NotificationType } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});

@ObjectType()
@Entity({ name: 'notifications' })
export class Notification extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  title: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  message: string;

  @Field(() => NotificationType)
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.MESSAGE,
  })
  type: NotificationType;

  @Field(() => NotificationStatus)
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'notifications' })
  user: User;
}
