import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { CreatePermissionInput } from './dto/create-permission.dto';
import { Permission } from './dbrepo/permission.repository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginatedPermission } from './entity/paginated_permission.entity';
import { permissionFilterInput } from './dto/permission_filter.input';
import { UpdatePermissionDto } from './dto/update-permission.input';

@UseGuards(AuthGuard)
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

  @Query(() => PaginatedPermission)
  async getPermission(
    @Args('filters', { type: () => permissionFilterInput })
    filters: permissionFilterInput,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedPermission> {
    return await this.permissionService.getPermission(filters, skip, take);
  }

  @Mutation(() => Permission)
  async updatePermission(
    @Args('id') id: string,
    @Args('updatePermissionDto') updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(updatePermissionDto);
  }
}
