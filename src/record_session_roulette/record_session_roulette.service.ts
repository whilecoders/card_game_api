import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, ILike, Repository } from 'typeorm';
import { User } from 'src/user/dbrepo/user.repository';
import { GameRouletteNumbers, RecordSessionStatus } from 'src/common/constants';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { PaginationMetadataDto } from 'src/common/model';
import { RecordSessionRoulette } from './dbrepo/record-session-roulette.repository';
import { GameSessionRoulette } from 'src/game_session_roulette/dbrepo/game-session-roulette.repository';
import { CreateRecordSessionRouletteDto } from './dto/create_record_session_roulette.dto';
import { RecordSessionRoulettePagination } from './dto/paginated_record_session_roulette.dto';

@Injectable()
export class RecordSessionRouletteService {
  constructor(
    @Inject('RECORD_SESSION_ROULETTE_REPOSITORY')
    private readonly recordSessionRouletteRepository: Repository<RecordSessionRoulette>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('GAMES_SESSION_ROULETTE_REPOSITORY')
    private readonly gameSessionRouletteRepository: Repository<GameSessionRoulette>,
  ) {}

  async createRecordSession(
    dto: CreateRecordSessionRouletteDto,
  ): Promise<RecordSessionRoulette> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }
    const gameSessionRoulette =
      await this.gameSessionRouletteRepository.findOne({
        where: { id: dto.gameSessionRouletteId },
      });

    if (!gameSessionRoulette) {
      throw new NotFoundException(
        `GameSessionRoulette with ID ${dto.gameSessionRouletteId} not found`,
      );
    }

    const recordSession = this.recordSessionRouletteRepository.create({
      user: { id: dto.userId },
      token: dto.token,
      game_session_roulette: gameSessionRoulette,
      choosen_number: dto.choosen_number,
      record_status: dto.record_status,
      createdAt: new Date(),
    });

    if (dto.token) {
      if (user.wallet < dto.token) {
        throw new BadRequestException(
          'Insufficient funds for this transaction.',
        );
      }
      user.wallet -= dto.token;
    }

    try {
      const savedSession =await this.recordSessionRouletteRepository.save(recordSession);
      await this.userRepository.save(user);
      const findCreatedSession =
        await this.recordSessionRouletteRepository.findOne({
          where: { id: savedSession.id },
        });
      return findCreatedSession;
    } catch (error) {
      throw new BadRequestException('Failed to create record session');
    }
  }

  async getRecordSessionById(id: number): Promise<RecordSessionRoulette> {
    const recordSession = await this.recordSessionRouletteRepository.findOne({
      where: { id, deletedAt: null, deletedBy: null },
      relations: ['user', 'game_session', 'transaction_session'],
    });
    if (!recordSession) {
      throw new NotFoundException(`RecordSession with ID ${id} not found`);
    }
    return recordSession;
  }

  async getAllRecordSessions(): Promise<RecordSessionRoulette[]> {
    try {
      return await this.recordSessionRouletteRepository.find({
        where: {
          deletedAt: null,
          deletedBy: null,
        },
        relations: {
          user: true,
          game_session_roulette: true,
          game_result_roulette: true,
        },
      });
    } catch (error) {
      console.error('Error retrieving record sessions:', error);
      throw new BadRequestException('Failed to retrieve record sessions');
    }
  }

  async getRecordsByUserId(userId: number): Promise<RecordSessionRoulette[]> {
    try {
      const records = await this.recordSessionRouletteRepository.find({
        where: { user: { id: userId }, deletedAt: null, deletedBy: null },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      // if (!records.length) {
      //   throw new NotFoundException(`No records found for user ID ${userId}`);
      // }
      return records;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to retrieve records. Please try again later.',
      );
    }
  }

  async searchRecords(
    sessionId: number,
    searchTerm: string,
    offset: PaginationMetadataDto,
  ): Promise<RecordSessionRoulettePagination> {
    try {
      let whereCondition = {
        game_session_id: { id: sessionId },
        deletedAt: null,
        deletedBy: null,
      };
      if (!isNaN(Number(searchTerm)))
        whereCondition['user'] = { id: Number(searchTerm) };
      else whereCondition['user'] = { username: ILike(`%${searchTerm}%`) };
      const [data, totalSize] =
        await this.recordSessionRouletteRepository.findAndCount({
          where: whereCondition,
          relations: {
            user: true,
            game_session_roulette: true,
            game_result_roulette: true,
          },
          skip: offset.skip,
          take: offset.take,
        });

      return { data, totalSize };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to search records. Please try again later.',
      );
    }
  }

  async getAllRecordsBySessionId(
    sessionId: number,
    offset?: PaginationMetadataDto,
  ): Promise<RecordSessionRoulettePagination> {
    try {
      console.log(offset);

      const [data, totalSize] =
        await this.recordSessionRouletteRepository.findAndCount({
          where: {
            game_session_roulette: { id: sessionId },
            deletedAt: null,
            deletedBy: null,
          },
          skip: offset.skip,
          take: offset.take,
          relations: ['user', 'game_session_id', 'transaction_session'],
        });
      return { data, totalSize };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to retrieve records. Please try again later.',
      );
    }
  }

  async updateRecordStatus(
    userId: number,
    gameSessionId: number,
    status: RecordSessionStatus,
  ): Promise<RecordSessionRoulette> {
    try {
      const recordSession = await this.recordSessionRouletteRepository.findOne({
        where: {
          user: { id: userId },
          game_session_roulette: { id: gameSessionId },
        },
      });

      if (!recordSession) {
        throw new NotFoundException(
          `RecordSession for userId ${userId} and gameSessionId ${gameSessionId} not found`,
        );
      }

      if (recordSession.record_status === RecordSessionStatus.COMPLETED) {
        throw new BadRequestException(
          'Cannot update a session that is already completed',
        );
      }

      recordSession.record_status = status;

      return await this.recordSessionRouletteRepository.save(recordSession);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update record status');
    }
  }

  async markSessionAsCompleted(gameSessionId: number): Promise<void> {
    try {
      const recordSessions = await this.recordSessionRouletteRepository.find({
        where: { game_session_roulette: { id: gameSessionId } },
      });
      if (!recordSessions.length) {
        throw new NotFoundException(
          `No records found for gameSessionId ${gameSessionId}`,
        );
      }
      for (const record of recordSessions) {
        record.record_status = RecordSessionStatus.COMPLETED;
      }
      await this.recordSessionRouletteRepository.save(recordSessions);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to mark session as completed',
      );
    }
  }

  async removeFromGame(
    userId: number,
    gameSessionId: number,
    deleteBy: number,
  ) {
    try {
      const recordSession = await this.recordSessionRouletteRepository.find({
        where: {
          user: { id: userId },
          game_session_roulette: { id: gameSessionId },
        },
      });
      if (!recordSession || recordSession.length === 0) {
        throw new NotFoundException(
          `RecordSession for userId ${userId} and gameSessionId ${gameSessionId} not found`,
        );
      }
      for (const session of recordSession) {
        session.deletedAt = new Date();
        session.deletedBy = deleteBy.toString();
      }
      return await this.recordSessionRouletteRepository.save(recordSession);
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update record status');
    }
  }

  async removeSessionFromGame(id: number, deleteBy: number) {
    try {
      const recordSession = await this.recordSessionRouletteRepository.find({
        where: { id: id },
      });
      if (!recordSession || recordSession.length === 0) {
        throw new NotFoundException(`RecordSession for userId ${id} not found`);
      }
      for (const session of recordSession) {
        session.deletedAt = new Date();
        session.deletedBy = deleteBy.toString();
      }
      return await this.recordSessionRouletteRepository.save(recordSession);
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to update record status');
    }
  }

  async getRecordsByDate(
    filter?: DateFilterDto,
  ): Promise<RecordSessionRoulette[]> {
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
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
    }

    return this.recordSessionRouletteRepository.find({
      where: {
        createdAt: Between(start, end),
        deletedAt: null,
        deletedBy: null,
      },
      relations: ['game', 'user'],
    });
  }
}
