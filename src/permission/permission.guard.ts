import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionService } from './permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly permissionService: PermissionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const user = ctx.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const action = this.extractActionFromHeader(ctx.req);
    if (!action) {
      throw new ForbiddenException('Action is undefined');
    }

    // Check permissions using the full user entity
    const isAllowed = await this.permissionService.isActionAllowed(
      user,
      action,
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        `You do not have permission to perform the action: ${action}`,
      );
    }

    return true;
  }

  private extractActionFromHeader(request: Request): string {
    const action = request.headers['x-action']; 
    if (!action) {
      throw new Error('Action header is missing'); 
    }
    return action;
  }
}
