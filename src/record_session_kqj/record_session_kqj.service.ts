import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, ILike, Repository } from 'typeorm';
import { RecordSessionKqj, RecordSessionKqjPagination } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { User } from 'src/user/dbrepo/user.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { RecordStatus, TransactionType } from 'src/common/constants';
import { DailyWinnersAndLosers } from '../dashboard/dto/Daily-Winner-Looser.input';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';
import { PaginationMetadataDto } from 'src/common/model';
import { off } from 'process';

@Injectable()
export class RecordSessionKqjService {
  constructor(
    @Inject('RECORD_SESSION_KQJ_REPOSITORY')
    private readonly recordSessionKqjRepository: Repository<RecordSessionKqj>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
    @Inject('TRANSACTION_SESSION_REPOSITORY')
    private readonly transactionSessionRepository: Repository<TransactionSession>,
  ) { }

  async createRecordSession(
    dto: CreateRecordSessionKqjDto,
  ): Promise<RecordSessionKqj> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }
    const gameSession = await this.gameSessionKqjRepository.findOne({
      where: { id: dto.gameSessionId },
    });

    if (!gameSession) {
      throw new NotFoundException(
        `GameSession with ID ${dto.gameSessionId} not found`,
      );
    }

    const recordSession = this.recordSessionKqjRepository.create({
      user,
      token: dto.token,
      game_session_id: gameSession,
      choosen_card: dto.choosen_card,
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
      const savedSession = await this.recordSessionKqjRepository.save(recordSession);
      const findCreatedSession = await this.recordSessionKqjRepository.findOne({ where: { id: savedSession.id } })
      return findCreatedSession
    } catch (error) {
      throw new BadRequestException('Failed to create record session');
    }
  }

  async getRecordSessionById(id: number): Promise<RecordSessionKqj> {
    const recordSession = await this.recordSessionKqjRepository.findOne({
      where: { id, deletedAt: null, deletedBy: null },
      relations: ['user', 'game_session', 'transaction_session'],
    });
    if (!recordSession) {
      throw new NotFoundException(`RecordSession with ID ${id} not found`);
    }
    return recordSession;
  }

  async getAllRecordSessions(): Promise<RecordSessionKqj[]> {
    try {
      return await this.recordSessionKqjRepository.find({
        where: {
          deletedAt: null, deletedBy: null
        },
        relations: {
          user: true,
          game_session_id: true,
          transaction_session: true,
        },
      });
    } catch (error) {
      console.error('Error retrieving record sessions:', error);
      throw new BadRequestException('Failed to retrieve record sessions');
    }
  }

  async getRecordsByUserId(userId: number): Promise<RecordSessionKqj[]> {
    try {
      const records = await this.recordSessionKqjRepository.find({
        where: { user: { id: userId }, deletedAt: null, deletedBy: null },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!records.length) {
        throw new NotFoundException(`No records found for user ID ${userId}`);
      }
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
    offset: PaginationMetadataDto
  ): Promise<RecordSessionKqjPagination> {
    try {
      let whereCondition = {
        game_session_id: { id: sessionId },
        deletedAt: null,
        deletedBy: null,
      };
      if (!isNaN(Number(searchTerm))) whereCondition["user"] = { id: Number(searchTerm) };
      else whereCondition["user"] = { username: ILike(`%${searchTerm}%`) };
      const [data, totalSize] = await this.recordSessionKqjRepository.findAndCount({
        where: whereCondition,
        relations: ['user', 'game_session_id', 'transaction_session'],
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
    offset?: PaginationMetadataDto
  ): Promise<RecordSessionKqjPagination> {
    try {
      console.log(offset);

      const [data, totalSize] = await this.recordSessionKqjRepository.findAndCount({
        where: { game_session_id: { id: sessionId }, deletedAt: null, deletedBy: null },
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
    status: RecordStatus,
  ): Promise<RecordSessionKqj> {
    try {
      const recordSession = await this.recordSessionKqjRepository.findOne({
        where: { user: { id: userId }, game_session_id: { id: gameSessionId } },
      });

      if (!recordSession) {
        throw new NotFoundException(
          `RecordSession for userId ${userId} and gameSessionId ${gameSessionId} not found`,
        );
      }

      if (recordSession.record_status === RecordStatus.COMPLETED) {
        throw new BadRequestException(
          'Cannot update a session that is already completed',
        );
      }

      recordSession.record_status = status;

      return await this.recordSessionKqjRepository.save(recordSession);
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
      const recordSessions = await this.recordSessionKqjRepository.find({
        where: { game_session_id: { id: gameSessionId } },
      });
      if (!recordSessions.length) {
        throw new NotFoundException(
          `No records found for gameSessionId ${gameSessionId}`,
        );
      }
      for (const record of recordSessions) {
        record.record_status = RecordStatus.COMPLETED;
      }
      await this.recordSessionKqjRepository.save(recordSessions);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to mark session as completed',
      );
    }
  }

  async removeFromGame(userId: number, gameSessionId: number, deleteBy: number) {
    try {
      const recordSession = await this.recordSessionKqjRepository.find({
        where: { user: { id: userId }, game_session_id: { id: gameSessionId } },
      });
      if (!recordSession || recordSession.length === 0) {
        throw new NotFoundException(
          `RecordSession for userId ${userId} and gameSessionId ${gameSessionId} not found`,
        );
      }
      for (const session of recordSession) {
        session.deletedAt = new Date()
        session.deletedBy = deleteBy.toString()
      }
      return await this.recordSessionKqjRepository.save(recordSession);
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
      const recordSession = await this.recordSessionKqjRepository.find({
        where: { id: id },
      });
      if (!recordSession || recordSession.length === 0) {
        throw new NotFoundException(
          `RecordSession for userId ${id} not found`,
        );
      }
      for (const session of recordSession) {
        session.deletedAt = new Date()
        session.deletedBy = deleteBy.toString()
      }
      return await this.recordSessionKqjRepository.save(recordSession);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException ||
        error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to update record status');
    }
  }

  async getRecordsByDate(filter?: DateFilterDto): Promise<RecordSessionKqj[]> {
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

    return this.recordSessionKqjRepository.find({
      where: {
        createdAt: Between(start, end),
        deletedAt: null,
        deletedBy: null
      },
      relations: ['game', 'user'],
    });
  }

  async getResultBySessionId(sessionId: number): Promise<any[]> {
    const records = await this.recordSessionKqjRepository.find({
      where: { game_session_id: { id: sessionId } },
      relations: ['user', 'game_session', 'transaction_session'],
    });

    if (!records.length) {
      throw new NotFoundException(
        `No records found for session ID ${sessionId}`,
      );
    }

    const gameSession = records[0]?.game_session_id;
    if (!gameSession) {
      throw new NotFoundException(`Game session not found for ID ${sessionId}`);
    }

    const resultCard = gameSession.game_result_card;

    if (!resultCard) {
      throw new BadRequestException(
        `Result card is not set for session ID ${sessionId}`,
      );
    }

    const results = [];
    for (const record of records) {
      const isWinner = record.choosen_card === resultCard;
      const prizeAmount = isWinner ? record.token * 2 : 0;

      const transactionSession = this.transactionSessionRepository.create({
        record_session_kqj: record,
        type: isWinner ? TransactionType.CREDIT : TransactionType.DEBIT,
        createdAt: new Date(),
      });

      if (isWinner) {
        record.user.wallet += prizeAmount;
      } else {
      }

      await this.userRepository.save(record.user);
      await this.transactionSessionRepository.save(transactionSession);

      results.push({
        recordId: record.id,
        choosen_card: record.choosen_card,
        result_card: resultCard,
        isWinner,
        prizeAmount,
      });
    }
    return results;
  }
}
