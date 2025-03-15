import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './dbrepo/user.repository';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/common/constants/enums';
import { AddUserDto } from './dto/add_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { SuspendUserDto } from './dto/suspend_user.dto';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { UserFiltersInput } from './dto/user_filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUserDto)
  async getAllUsers(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
  ): Promise<PaginatedUserDto> {
    return await this.userService.getAllUsers(skip, take);
  }

  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionAction.GETUSERBYID)
  @Query(() => User)
  async getUserById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Query(() => [User])
  async getUserByRole(@Args('role') role: Role): Promise<User[]> {
    return await this.userService.getUserByRole(role);
  }

  @Query(() => [User])
  async getUsersByCreatedAt(@Args('date') date: Date): Promise<User[]> {
    return await this.userService.getUsersByCreatedAt(date);
  }

  @Mutation(() => User)
  async addUser(@Args('addUserDto') addUserDto: AddUserDto): Promise<User> {
    return await this.userService.addUser(addUserDto);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  async setTransactionPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('transactionPassword') transactionPassword: string,
  ): Promise<boolean> {
    return await this.userService.setTransactionPassword(
      id,
      transactionPassword,
    );
  }

  @Mutation(() => Boolean)
  async verifyTransactionPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('transactionPassword') transactionPassword: string,
  ): Promise<boolean> {
    return await this.userService.verifyTransactionPassword(
      id,
      transactionPassword,
    );
  }

  @Mutation(() => User)
  async suspendUser(
    @Args('suspendUserDto') suspendUserDto: SuspendUserDto,
  ): Promise<User> {
    return await this.userService.suspendUser(suspendUserDto);
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
    @Args('UserFiltersInput') userFiltersInput: UserFiltersInput,
  ): Promise<PaginatedUserDto> {
    return await this.userService.searchUser(
      userFiltersInput,
      userFiltersInput.skip,
      userFiltersInput.take,
    );
  }

  @Mutation(() => User)
  async updateUserWallet(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserWallet(id, updateUserDto);
  }
}
