import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserProviders } from './dbrepo/user.provider';

@Module({
  providers: [UserResolver, UserService, ...UserProviders],
  imports: [],
  exports: [...UserProviders]
})
export class UserModule { }
