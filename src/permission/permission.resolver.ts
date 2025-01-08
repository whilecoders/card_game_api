import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { CreatePermissionInput } from './dto/create-permission.dto';
import { Permission } from './dbrepo/permission.repository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission, { description: 'Create a new permission' })
  async createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ): Promise<Permission> {
    try {
      return await this.permissionService.createPermission(
        createPermissionInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @Mutation(() => String)
  async restrictUserAction(
    @Args('userId', { type: () => Number }) userId: number,
    @Args('action', { type: () => String }) action: string,
  ): Promise<string> {
    return await this.permissionService.restrictUserAction(userId, action);
  }

  @Mutation(() => String)
  async unrestrictUserAction(
    @Args('userId', { type: () => Number }) userId: number,
    @Args('action', { type: () => String }) action: string,
  ): Promise<string> {
    return await this.permissionService.unrestrictUserAction(userId, action);
  }
}
