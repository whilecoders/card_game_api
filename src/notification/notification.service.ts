import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Repository, Not } from 'typeorm';
import { CreateNotificationInput } from './dto/create_notification_input.dto';
import { Notification } from './dbrepo/notification.repository';
import { UpdateNotificationInput } from './dto/update_notification_input.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create(
        createNotificationInput,
      );
      return await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new InternalServerErrorException(
        'Could not create the notification. Please try again later.',
      );
    }
  }

  async updateNotification(
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: updateNotificationInput.id },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      Object.assign(notification, updateNotificationInput);

      return await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new InternalServerErrorException(
        'Could not update the notification. Please try again later.',
      );
    }
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { user: { id: userId }, deletedAt: null },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw new InternalServerErrorException(
        'Could not fetch user notifications. Please try again later.',
      );
    }
  }

  async getDeletedNotifications(userId: number): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { user: { id: userId }, deletedAt: Not(null) },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching deleted notifications:', error);
      throw new InternalServerErrorException(
        'Could not fetch deleted notifications. Please try again later.',
      );
    }
  }
}
