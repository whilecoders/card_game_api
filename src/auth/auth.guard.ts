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
// import { jwtSecret } from 'src/utils/const';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const accessToken = this.extractTokenFromHeader(ctx.req);

    if (!accessToken) {
      throw new UnauthorizedException();
    }
    console.log(accessToken);

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: EnvKeyConstants.JWT_SECRET,
      });
      console.log(payload);
      ctx.user = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // console.log(request.headers);
    // const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return type === 'Bearer' ? token : undefined;
    console.log(request.headers.authorization);
    return request.headers.authorization;
  }
}
