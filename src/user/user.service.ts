import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  ConflictException,
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
      const count = await this.userRepository.count();
      const data = await this.userRepository.find({ skip, take });

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
      where: { username },
    });
    if (userByUsername) {
      throw new ConflictException('Username already exists');
    }

    const userByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (userByEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create({
      username,
      email,
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
      const user = await this.userRepository.findOne({ where: { id } });
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
    const { userId, suspend } = suspendUserDto;
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      if (
        user.status === (suspend ? UserStatus.SUSPENDED : UserStatus.ACTIVE)
      ) {
        throw new ConflictException(
          `User is already ${suspend ? 'suspended' : 'active'}`,
        );
      }
      user.status = suspend ? UserStatus.SUSPENDED : UserStatus.ACTIVE;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to suspend or activate user',
      );
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

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
        }
      });
      queryBuilder.skip(skip).take(take);
      const [data, count] = await queryBuilder.getManyAndCount();
      if (!data.length) {
        throw new NotFoundException(
          'No users found with the provided criteria.',
        );
      }
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
