import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/create_notification_input.dto';
import { UpdateNotificationInput } from './dto/update_notification_input.dto';
import { Notification } from './dbrepo/notification.repository';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  async createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    return await this.notificationService.create(createNotificationInput);
  }

  @Mutation(() => Notification)
  async updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    return await this.notificationService.updateNotification(
      updateNotificationInput,
    );
  }

  @Query(() => [Notification])
  async getUserNotifications(
    @Args('userId') userId: number,
  ): Promise<Notification[]> {
    return await this.notificationService.getUserNotifications(userId);
  }

  @Query(() => [Notification])
  async getDeletedNotifications(
    @Args('userId') userId: number,
  ): Promise<Notification[]> {
    return await this.notificationService.getDeletedNotifications(userId);
  }
}
