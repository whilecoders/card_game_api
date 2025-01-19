import { InputType, Field, Int } from '@nestjs/graphql';
import { NotificationStatus, NotificationType } from 'src/common/constants';

@InputType()
export class UpdateNotificationInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => NotificationStatus, { nullable: true })
  status?: NotificationStatus;

  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  deletedBy?: string;
}
