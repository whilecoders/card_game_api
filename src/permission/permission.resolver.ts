import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { CreatePermissionInput } from './dto/create-permission.dto';
import { Permission } from './dbrepo/permission.repository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/common/constants';

// @UseGuards(AuthGuard)
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission, { description: 'Create a new permission' })
  async createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ): Promise<Permission> {
    return await this.permissionService.createPermission(createPermissionInput);
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

  @Mutation(() => String)
  async restrictRoleAction(
    @Args('role', { type: () => Role }) role: Role,
    @Args('action', { type: () => String }) action: string,
  ): Promise<string> {
    return await this.permissionService.restrictRoleAction(role, action);
  }

  @Mutation(() => String)
  async unrestrictRoleAction(
    @Args('role', { type: () => Role }) role: Role,
    @Args('action', { type: () => String }) action: string,
  ): Promise<string> {
    return await this.permissionService.unrestrictRoleAction(role, action);
  }

  @Query(() => [Permission])
  async getPermissions(
    @Args('userId', { type: () => Number, nullable: true }) userId?: number,
    @Args('role', { type: () => Role, nullable: true }) role?: Role,
  ) {
    return await this.permissionService.getPermissions(userId, role);
  }
}
