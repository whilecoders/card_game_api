import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GameResultStatus,
  GameSessionStatus,
  GameStatus,
  TransactionType,
} from 'src/common/constants';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Between, Repository } from 'typeorm';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';
import { ProfitAndLoss } from './dto/profite-loss.input';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
    @Inject('RECORD_SESSION_KQJ_REPOSITORY')
    private readonly recordSessionKqjRepository: Repository<RecordSessionKqj>,
    @Inject('TRANSACTION_SESSION_REPOSITORY')
    private readonly transactionSessionRepository: Repository<TransactionSession>,
  ) {}

  async getTotalSessionsDateOrToday(filter?: DateFilterDto): Promise<number> {
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

    const sessions = await this.gameSessionKqjRepository.find({
      where: {
        session_start_time: Between(start, end),
      },
    });

    return sessions.length;
  }

  async getFinishedSessionsByDateOrToday(
    filter?: DateFilterDto,
  ): Promise<number> {
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

    const finishedSessions = await this.gameSessionKqjRepository.find({
      where: {
        session_end_time: Between(start, end),
        session_status: GameSessionStatus.END,
      },
    });

    return finishedSessions.length;
  }

  async getTotalUsersByDateOrToday(filter?: DateFilterDto): Promise<number> {
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

  async getTotalTokensByDateOrToday(filter?: DateFilterDto): Promise<number> {
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
        if (!session.game_result_card) {
          continue; // Skip if the game result card is not available
        }

        // Ensure `record_session_kqj` is an array
        if (Array.isArray(session.record_session_kqj)) {
          session.record_session_kqj.forEach((record) => {
            if (record.choosen_card === session.game_result_card) {
              winners++;
            } else {
              losers++;
            }
          });
        }
      }

      return { winners, losers };
    } catch (error) {
      console.error('Error fetching daily winners and losers:', error);
      throw new InternalServerErrorException(
        'Failed to fetch daily winners and losers',
      );
    }
  }

  async getProfitAndLoss(date?: Date): Promise<ProfitAndLoss> {
    try {
      const targetDate = date ? new Date(date) : new Date();
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const whereClause = { createdAt: Between(startOfDay, endOfDay) };

      const WinTransactions = await this.transactionSessionRepository.find({
        where: { game_status: GameResultStatus.WIN, ...whereClause },
      });

      const LossTransactions = await this.transactionSessionRepository.find({
        where: { game_status: GameResultStatus.LOSS, ...whereClause },
      });

      const profit = WinTransactions.reduce(
        (sum, transaction) => sum + transaction.token,
        0,
      );
      const loss = LossTransactions.reduce(
        (sum, transaction) => sum + transaction.token,
        0,
      );

      const net = profit - loss;

      return {
        profit,
        loss,
        net,
      };
    } catch (error) {
      console.error('Error calculating profit and loss:', error);
      throw new Error('Failed to calculate profit and loss.');
    }
  }

  async getUpcomingSessions(): Promise<GameSessionKqj[]> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return await this.gameSessionKqjRepository.find({
        where: {
          session_start_time: Between(startOfDay, endOfDay),
          session_status: GameSessionStatus.UPCOMING,
        },
      });
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw new InternalServerErrorException(
        'Failed to fetch upcoming sessions.',
      );
    }
  }

  async getLiveSessions(): Promise<GameSessionKqj[]> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return await this.gameSessionKqjRepository.find({
        where: {
          session_start_time: Between(startOfDay, endOfDay),
          session_status: GameSessionStatus.LIVE,
        },
      });
    } catch (error) {
      console.error('Error fetching running sessions:', error);
      throw new InternalServerErrorException(
        'Failed to fetch running sessions.',
      );
    }
  }
}
