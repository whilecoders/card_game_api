/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './dbrepo/user.repository';
import { UserStatus, Role } from 'src/common/constants/enums';
import { AddUserDto } from './dto/add_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { SuspendUserDto } from './dto/suspend_user.dto';
import { PasswordHashService } from 'src/common/helper';
import { PaginatedUserDto } from './dto/paginated-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(skip: number, take: number): Promise<PaginatedUserDto> {
    try {
      const [data, count] = await this.userRepository.findAndCount({
        skip,
        take,
      });

      return {
        count,
        take,
        skip,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by ID');
    }
  }

  async getUserByRole(role: Role): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { role } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users by role');
    }
  }

  async getUsersByCreatedAt(date: Date): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { createdAt: date } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch users by creation date',
      );
    }
  }

  async addUser(addUserDto: AddUserDto) {
    const { username, email, password, city, phone_number, role } = addUserDto;
    const hashedPassword = await PasswordHashService.hashPassword(password);

    const userByUsername = await this.userRepository.findOne({
      where: [{ username }, { phone_number }],
    });
    if (userByUsername) {
      throw new ConflictException(
        'User already exists with the same username or phone number',
      );
    }

    const user = this.userRepository.create({
      username,
      email: email ?? null,
      city,
      phone_number,
      password: hashedPassword,
      role: role,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, deletedAt: null, deletedBy: null },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async setTransactionPassword(userId: number, transaction_password: string) {
    try {
      // Implement the logic to set the transaction password
      const hashedPass = PasswordHashService.hashPassword(transaction_password);
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: null, deletedBy: null },
      });
      user.transaction_password = hashedPass;
      await this.userRepository.save(user);
      return true;
    } catch (_) {
      throw new InternalServerErrorException(
        'Failed to set transaction password',
      );
    }
  }

  async verifyTransactionPassword(
    userId: number,
    transaction_password: string,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: null, deletedBy: null },
      });

      if (!user || !user.transaction_password) {
        throw new NotFoundException(
          'User not found or transaction password not set',
        );
      }
      const isPasswordValid: boolean = PasswordHashService.verifyPassword(
        transaction_password,
        user.password,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid transaction password');

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to verify transaction password: \n ${error}`,
      );
    }
  }

  async updateUserWallet(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, deletedAt: null, deletedBy: null },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async suspendUser(suspendUserDto: SuspendUserDto): Promise<User> {
    const { userId } = suspendUserDto;
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (user.status === UserStatus.SUSPENDED) {
        throw new ConflictException(`User is already suspended`);
      }

      user.status = UserStatus.SUSPENDED;
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error in suspendUser:', error);
      throw new InternalServerErrorException('Failed to suspend user');
    }
  }

  async deleteUser(userId: number, adminId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    try {
      user.deletedBy = admin.username;
      user.deletedAt = new Date();

      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async searchUser(
    filters: Partial<User>,
    skip: number,
    take: number,
  ): Promise<PaginatedUserDto> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Apply LIKE for string fields
      if (filters.id != null) {
        queryBuilder.andWhere('user.id = :id', { id: filters.id });
      }
      if (filters.name) {
        queryBuilder.andWhere('user.name LIKE :name', {
          name: `%${filters.name}%`,
        });
      }
      if (filters.username) {
        queryBuilder.andWhere('user.username LIKE :username', {
          username: `%${filters.username}%`,
        });
      }
      if (filters.email) {
        queryBuilder.andWhere('user.email LIKE :email', {
          email: `%${filters.email}%`,
        });
      }
      if (filters.role) {
        queryBuilder.andWhere('user.role = :role', { role: filters.role });
      }
      if (filters.status) {
        queryBuilder.andWhere('user.status = :status', {
          status: filters.status,
        });
      }
      if (filters.city) {
        queryBuilder.andWhere('user.city LIKE :city', {
          city: `%${filters.city}%`,
        });
      }
      if (filters.phone_number) {
        queryBuilder.andWhere('user.phone_number LIKE :phone_number', {
          phone_number: `%${filters.phone_number}%`,
        });
      }

      // Apply pagination
      queryBuilder.skip(skip).take(take);

      // Execute the query and get the results
      const [data, count] = await queryBuilder.getManyAndCount();

      // Handle no results case
      if (!data.length) {
        throw new NotFoundException(
          'No users found with the provided criteria.',
        );
      }

      // Return paginated data
      return {
        count,
        take,
        skip,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch users with the provided criteria.',
      );
    }
  }
}
