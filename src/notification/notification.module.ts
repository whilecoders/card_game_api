import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationProviders } from './dbrepo/notification.provider';

@Module({
  providers: [
    NotificationResolver,
    NotificationService,
    ...NotificationProviders,
  ],
  exports: [...NotificationProviders],
})
export class NotificationModule {}
