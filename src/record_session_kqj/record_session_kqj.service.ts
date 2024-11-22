import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { RecordSessionKqj } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { User } from 'src/user/dbrepo/user.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { RecordStatus } from 'src/common/constants';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';

@Injectable()
export class RecordSessionKqjService {
  constructor(
    @Inject('RECORD_SESSION_KQJ_REPOSITORY')
    private readonly recordSessionKqjRepository: Repository<RecordSessionKqj>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
  ) {}

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
    });

    try {
      return await this.recordSessionKqjRepository.save(recordSession);
    } catch (error) {
      throw new BadRequestException('Failed to create record session');
    }
  }

  async getRecordSessionById(id: number): Promise<RecordSessionKqj> {
    const recordSession = await this.recordSessionKqjRepository.findOne({
      where: { id },
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
        relations: {
          user: true,
          game_session_id: true,
          transaction_session_id: true,
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
        where: { user: { id: userId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!records.length) {
        throw new NotFoundException(`No records found for user ID ${userId}`);
      }
      return records;
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve records. Please try again later.',
      );
    }
  }

  async getRecordBySessionId(
    sessionId: number,
  ): Promise<RecordSessionKqj | null> {
    try {
      const record = await this.recordSessionKqjRepository.findOne({
        where: { game_session_id: { id: sessionId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!record) {
        throw new NotFoundException(
          `No record found for session ID ${sessionId}`,
        );
      }
      return record;
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve record. Please try again later.',
      );
    }
  }

  async getAllRecordsBySessionId(
    sessionId: number,
  ): Promise<RecordSessionKqj[]> {
    try {
      const records = await this.recordSessionKqjRepository.find({
        where: { game_session_id: { id: sessionId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!records.length) {
        throw new NotFoundException(
          `No records found for session ID ${sessionId}`,
        );
      }
      return records;
    } catch (error) {
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

  async getTotalUsersToday(): Promise<number> {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const records = await this.recordSessionKqjRepository.find({
        where: {
          createdAt: Between(start, end),
        },
        relations: ['user'],
      });

      const uniqueUsers = new Set(records.map((record) => record.user.id));
      return uniqueUsers.size;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get total users for today',
      );
    }
  }

  async getTotalTokensToday(): Promise<number> {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const records = await this.recordSessionKqjRepository.find({
        where: {
          createdAt: Between(start, end),
        },
      });

      const totalTokens = records.reduce(
        (sum, record) => sum + record.token,
        0,
      );
      return totalTokens;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get total tokens for today',
      );
    }
  }

  async getDailyWinnersAndLosers(): Promise<DailyWinnersAndLosers> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch game sessions for today
      const sessions = await this.gameSessionKqjRepository.find({
        where: {
          session_start_time: Between(startOfDay, endOfDay),
        },
        relations: ['record_session_kqj'],
      });

      let winners = 0;
      let losers = 0;

      // Iterate through each session and its records
      for (const session of sessions) {
        if (!session.record_session_kqj?.length || !session.game_result_card) {
          continue;
        }

        session.record_session_kqj.forEach((record) => {
          if (record.choosen_card === session.game_result_card) {
            winners++;
          } else {
            losers++;
          }
        });
      }

      return { winners, losers };
    } catch (error) {
      console.error('Error fetching daily winners and losers:', error);
      throw new InternalServerErrorException(
        'Failed to fetch daily winners and losers',
      );
    }
  }

}
