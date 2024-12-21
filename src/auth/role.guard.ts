import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class RoleGuard implements CanActivate {
  public role: string[];
  constructor(role: string[]) {
    this.role = role;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    // console.log(ctx);
    
    const { role } = ctx.user;
    console.log(role);
    console.log(this.role);
    if (this.role.includes(role)) return true;
    return false;
  }
}
