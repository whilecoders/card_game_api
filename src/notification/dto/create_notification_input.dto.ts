import { InputType, Field } from '@nestjs/graphql';
import { NotificationType } from 'src/common/constants';

@InputType()
export class CreateNotificationInput {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  userId: number;

  @Field(() => NotificationType, { defaultValue: NotificationType.MESSAGE })
  type: NotificationType;
}
