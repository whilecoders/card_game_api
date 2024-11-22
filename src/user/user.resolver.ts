import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './dbrepo/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/constants/enums';
import { AddUserDto } from './dto/add_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { SuspendUserDto } from './dto/suspend_user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
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
}
