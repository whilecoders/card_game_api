import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThan, Not, Repository } from 'typeorm';
import { User } from 'src/user/dbrepo/user.repository';
import {
  AuditActionType,
  AuditDetails,
  AuditEntityType,
} from 'src/common/constants';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { AuditLog } from 'src/audit-log/dbrepo/audit_log.repository';
import { GameRoulette } from './dbrepo/game-roulette.repository';
import { CreateGameRouletteDto } from './dto/create-game-roulette.dto';
import { UpdateGameRouletteDto } from './dto/update-game-roulette.dto';
import { PaginatedGameRouletteDto } from './dto/paginated-game-roulette.dto';

@Injectable()
export class GameRouletteService {
  constructor(
    @Inject('GAMES_ROULETTE_REPOSITORY')
    private readonly gamesRepository: Repository<GameRoulette>,

    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,

    @Inject('AUDIT_LOG_REPOSITORY')
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createGameRoulette(
    createGameRouletteDto: CreateGameRouletteDto,
  ): Promise<GameRoulette> {
    const admin = await this.userRepository.findOne({
      where: { id: createGameRouletteDto.admin_id },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const startDate = new Date(createGameRouletteDto.start_date);
    startDate.setHours(0, 0, 0, 0);
    createGameRouletteDto.start_date = startDate;

    const endDate = new Date(createGameRouletteDto.end_date);
    endDate.setHours(23, 59, 59, 999);
    createGameRouletteDto.end_date = endDate;

    createGameRouletteDto.start_date = startDate;
    createGameRouletteDto.end_date = endDate;

    const existingGame = await this.gamesRepository.findOne({
      where: [
        {
          start_date: LessThanOrEqual(createGameRouletteDto.end_date),
          end_date: MoreThan(createGameRouletteDto.start_date),
        },
        {
          start_date: MoreThan(createGameRouletteDto.start_date),
          end_date: LessThanOrEqual(createGameRouletteDto.end_date),
        },
      ],
    });

    if (existingGame) {
      throw new ConflictException('A game already exists with this dates');
    }

    const game = this.gamesRepository.create({
      ...createGameRouletteDto,
      admin,
    });

    try {
      const game_created = await this.gamesRepository.save(game);
      if (!game_created) {
        throw new InternalServerErrorException(
          'Failed to create GameLaunch. Please try again.',
        );
      }
      const auditDetails = AuditDetails.create(
        game_created.createdAt,
        game_created.admin.username,
        AuditEntityType.Game,
      );
      const audit = this.auditLogRepository.create({
        action: AuditActionType.CREATE,
        entity: AuditEntityType.Game,
        user_id: admin,
        details: auditDetails,
      });
      await this.auditLogRepository.save(audit);
      return game_created;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server error 400');
    }
  }

  async updateGameRoulette(
    updateGameRouletteDto: UpdateGameRouletteDto,
  ): Promise<GameRoulette> {
    try {
      console.log(updateGameRouletteDto);

      const game = await this.gamesRepository.findOne({
        where: { id: updateGameRouletteDto.game_id },
        relations: { admin: true, game_session_roulette: true },
      });

      if (!game) {
        throw new NotFoundException(
          `Game with ID ${updateGameRouletteDto.game_id} not found`,
        );
      }

      const admin = await this.userRepository.findOne({
        where: { id: updateGameRouletteDto.admin_id },
      });
      if (!admin) {
        throw new NotFoundException(
          `Admin with ID ${updateGameRouletteDto.admin_id} not found`,
        );
      }

      const overlappingGame = await this.gamesRepository.findOne({
        where: [
          {
            id: Not(updateGameRouletteDto.game_id),
            start_date: LessThanOrEqual(updateGameRouletteDto.end_date),
            end_date: MoreThan(updateGameRouletteDto.start_date),
          },
          {
            id: Not(updateGameRouletteDto.game_id),
            start_date: MoreThan(updateGameRouletteDto.start_date),
            end_date: LessThanOrEqual(updateGameRouletteDto.end_date),
          },
        ],
      });

      if (overlappingGame) {
        throw new ConflictException(
          'Another game with overlapping dates already exists',
        );
      }

      const startDate = new Date(updateGameRouletteDto.start_date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(updateGameRouletteDto.end_date);
      endDate.setHours(23, 59, 59, 999);

      updateGameRouletteDto.start_date = startDate;
      updateGameRouletteDto.end_date = endDate;

      Object.assign(game, updateGameRouletteDto);

      return await this.gamesRepository.save(game);
    } catch (error) {
      console.error('Error updating GameLaunch:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Game.');
    }
  }

  async getAllGamesRoulette(
    skip: number,
    take: number,
  ): Promise<PaginatedGameRouletteDto> {
    try {
      const [data, count] = await this.gamesRepository.findAndCount({
        where: { deletedBy: null },
        relations: { admin: true, game_session_roulette: true },
        skip,
        take,
      });

      if (!data.length) {
        throw new NotFoundException(`No GameLaunches found`);
      }

      return { data, count, skip, take };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve GameLaunches.',
      );
    }
  }

  async getGameRouletteById(id: number): Promise<GameRoulette> {
    const gameLaunch = await this.gamesRepository.findOne({
      where: { id, deletedBy: null },
      relations: { admin: true, game_session_roulette: true },
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    return gameLaunch;
  }

  async deleteGameRoulette(id: number): Promise<void> {
    const gameLaunch = await this.gamesRepository.findOne({
      where: { id },
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);

    gameLaunch.deletedBy = 'system';
    gameLaunch.deletedAt = new Date();

    try {
      await this.gamesRepository.save(gameLaunch);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to soft delete GameLaunch.',
      );
    }
  }

  async getGameRouleteByDateOrToday(
    filter?: DateFilterDto,
  ): Promise<GameRoulette[]> {
    try {
      let start: Date;
      let end: Date;
      if (filter && filter.startDate && filter.endDate) {
        start = new Date(filter.startDate);
        end = new Date(filter.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new BadRequestException(
            'Invalid date format. Please provide valid ISO dates.',
          );
        }
      } else {
        const today = new Date();
        start = new Date(today.setDate(today.getDate() - 7));
        end = new Date(today.setDate(today.getDate() + 14));
      }
      console.log(Between(start, end));

      const games = await this.gamesRepository.find({
        where: { start_date: Between(start, end) },
        relations: { game_session_roulette: true },
      });
      if (!games.length) {
        return [];
      }
      return games;
    } catch (error) {
      console.error('Error retrieving game sessions:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve game sessions.',
      );
    }
  }
}
