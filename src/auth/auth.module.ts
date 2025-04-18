import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JWTService } from 'src/common/helper/jwt.service';

@Module({
  imports:[UserModule],
  providers: [AuthResolver, AuthService,JWTService],
})
export class AuthModule {}
