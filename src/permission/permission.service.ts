import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from './dbrepo/permission.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { CreatePermissionInput } from './dto/create-permission.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
    private readonly userService: UserService,
  ) {}

  async isActionAllowed(user: User, action: string): Promise<boolean> {
    try {
      const validUser = this.userService.getUserById(user.id);

      if (!validUser) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      // Step 1: Check user-specific permission
      const userPermission = await this.permissionRepository.findOne({
        where: { user: { id: user.id }, action },
      });

      if (userPermission) {
        return userPermission.allowed;
      }

      // Step 2: Check role-based permission
      const rolePermission = await this.permissionRepository.findOne({
        where: { role: user.role, action },
      });

      if (rolePermission) {
        return rolePermission.allowed;
      }

      // Step 3: Default fallback (deny if no matching permission)
      return false;
    } catch (error) {
      throw new InternalServerErrorException('Error checking permissions');
    }
  }

  async createPermission(
    createPermissionInput: CreatePermissionInput,
  ): Promise<Permission> {
    try {
      console.log(createPermissionInput.role, createPermissionInput.userId);
      const permission = this.permissionRepository.create({
        action: createPermissionInput.action,
        role: createPermissionInput.role,
        user: createPermissionInput.userId
          ? { id: createPermissionInput.userId }
          : null,
        allowed: createPermissionInput.allowed,
      });
      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new InternalServerErrorException('Error creating permission');
    }
  }

  async restrictUserAction(userId: number, action: string): Promise<string> {
    try {
      const validUser = await this.userService.getUserById(userId);

      if (!validUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const existingRestriction = await this.permissionRepository.findOne({
        where: { user: { id: userId }, action },
      });

      if (existingRestriction) {
        if (existingRestriction.allowed === false) {
          return `User is already restricted from performing this action: ${action}`;
        }

        existingRestriction.allowed = false;
        await this.permissionRepository.save(existingRestriction);
        return `User has been restricted from performing this action: ${action}`;
      } else {
        const actionWithRole = await this.permissionRepository.findOne({
          where: { action },
        });

        if (actionWithRole) {
          if (actionWithRole.role) {
            const newRestriction = this.permissionRepository.create({
              user: { id: userId },
              action,
              allowed: false,
            });

            await this.permissionRepository.save(newRestriction);
            return `User has been restricted from performing this action: ${action}`;
          } else {
            return `No valid role found for the action: ${action}`;
          }
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Error restricting user action');
    }
  }

  async unrestrictUserAction(userId: number, action: string): Promise<string> {
    try {
      const validUser = this.userService.getUserById(userId);

      if (!validUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const restriction = await this.permissionRepository.findOne({
        where: { user: { id: userId }, action },
      });

      if (restriction) {
        restriction.allowed = true;
        await this.permissionRepository.save(restriction);
        return `User has been unrestricted and can now perform this action: ${action}`;
      }

      return `No restriction found for user on this action: ${action}`;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing user action restriction',
      );
    }
  }
}
