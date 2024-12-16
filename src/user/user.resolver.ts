import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './dbrepo/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/constants/enums';
import { AddUserDto } from './dto/add_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { SuspendUserDto } from './dto/suspend_user.dto';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { UserFiltersInput } from './dto/user_filter.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUserDto)
  async getAllUsers(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
  ): Promise<PaginatedUserDto> {
    try {
      return await this.userService.getAllUsers(skip, take);
    } catch (error) {
      throw new NotFoundException('Unable to fetch users');
    }
  }

  @Query(() => User)
  async getUserById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Query(() => [User])
  async getUserByRole(@Args('role') role: Role): Promise<User[]> {
    try {
      return await this.userService.getUserByRole(role);
    } catch (error) {
      throw new NotFoundException('Unable to fetch users by role');
    }
  }

  @Query(() => [User])
  async getUsersByCreatedAt(@Args('date') date: Date): Promise<User[]> {
    try {
      return await this.userService.getUsersByCreatedAt(date);
    } catch (error) {
      throw new NotFoundException('Unable to fetch users by creation date');
    }
  }

  @Mutation(() => User)
  async addUser(@Args('addUserDto') addUserDto: AddUserDto): Promise<User> {
    try {
      return await this.userService.addUser(addUserDto);
    } catch (error) {
      throw new Error('Failed to create new user');
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Mutation(() => User)
  async suspendUser(
    @Args('suspendUserDto') suspendUserDto: SuspendUserDto,
  ): Promise<User> {
    try {
      return await this.userService.suspendUser(suspendUserDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(
    @Args('userId') userId: number,
    @Args('adminId') adminId: number,
  ): Promise<boolean> {
    await this.userService.deleteUser(userId, adminId);
    return true;
  }

  @Query(() => PaginatedUserDto, { name: 'searchUser' })
  async searchUser(
    @Args('filters', { type: () => UserFiltersInput })
    filters: UserFiltersInput,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedUserDto> {
    try {
      return await this.userService.searchUser(filters, skip, take);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
