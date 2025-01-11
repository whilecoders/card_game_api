import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EnvKeyConstants } from 'src/common/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const accessToken = this.extractTokenFromHeader(ctx.req);

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }
    // console.log(accessToken);

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: EnvKeyConstants.JWT_SECRET,
      });
      // console.log(payload);
      ctx.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
