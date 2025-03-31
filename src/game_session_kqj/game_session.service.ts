import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { UpdateGameSessionDto } from './dto/update-game_session.dto';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionStatus, GameResultStatus } from 'src/common/constants';
import { PaginatedGameSessionKqjDto } from './dto/paginated-game-session-kqj.dto';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { GameSessionKqjStats } from './dto/game_session_stats.dto';
import { User } from 'src/user/dbrepo/user.repository';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';

@Injectable()
export class GameSessionKqjService {
  constructor(
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
    @Inject('USER_REPOSITORY')
    private readonly user: Repository<User>,
    @Inject('TRANSACTION_SESSION_REPOSITORY')
    private readonly transactionSession: Repository<TransactionSession>,
  ) {}

  async updateGameSession(
    id: number,
    updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    try {
      const gameSession = await this.gameSessionKqjRepository.findOne({
        where: { id },
      });
      if (!gameSession)
        throw new NotFoundException(`GameSession with ID ${id} not found`);
      gameSession.game_result_card = updateGameSessionDto.game_result_card;

      return await this.gameSessionKqjRepository.save(gameSession);
    } catch {
      throw new BadRequestException(
        'Failed to update game session. Please check input values and try again.',
      );
    }
  }
  async getGameSessionById(id: number): Promise<GameSessionKqj> {
    const gameSession = await this.gameSessionKqjRepository.findOne({
      where: { id },
    });
    if (!gameSession) {
      throw new NotFoundException(`GameSession with ID ${id} not found`);
    }
    return gameSession;
  }

  async getAllGameSessions(
    skip: number,
    take: number,
  ): Promise<PaginatedGameSessionKqjDto> {
    const [data, count] = await this.gameSessionKqjRepository.findAndCount({
      relations: ['game', 'record_session_kqj'],
      skip,
      take,
    });

    return {
      data,
      count,
      skip,
      take,
    };
  }

  async getLiveGameSessions(): Promise<GameSessionKqj> {
    const finded = await this.gameSessionKqjRepository.find({
      where: { session_status: GameSessionStatus.LIVE },
      relations: ['game', 'record_session_kqj'],
    });
    return finded[finded.length - 1];
  }

  async getGameSessionsByDateOrToday(
    filter?: DateFilterDto,
  ): Promise<GameSessionKqj[]> {
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
        const today = new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/kolkata' }),
        );
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
        console.log('===== Debuging wrong date ========');
        console.log('startData: ', start);
        console.log('endData: ', end);
      }

      const sessions = await this.gameSessionKqjRepository.find({
        where: { session_start_time: Between(start, end) },
        relations: ['game', 'record_session_kqj'],
      });
      // console.log("fetched game session  ->", sessions);
      if (!sessions.length) {
        return [];
      }
      return sessions;
    } catch (error) {
      console.error('Error retrieving game sessions:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve game sessions.',
      );
    }
  }

  async getPlayerStats(userId: number): Promise<GameSessionKqjStats> {
    const user = await this.user.findOne({ where: { id: userId } });
    if (!user) {
      new NotFoundException('No user found');
    }

    const totalUserBets = await this.transactionSession.find({
      where: {
        record_session_kqj: { user: { id: userId } },
      },
      relations: ['record_session_kqj', 'record_session_kqj.game_session_id'],
    });

    // Group bets by `game_session_id`
    const groupedGameResult = totalUserBets.reduce<
      Map<string, TransactionSession>
    >((accum, value) => {
      const uniqueKey = value.record_session_kqj.game_session_id.id.toString();
      if (accum.has(uniqueKey)) {
        const existing = accum.get(uniqueKey)!;
        if (value.game_status === GameResultStatus.WIN) {
          existing.game_status = GameResultStatus.WIN;
        }
        if (existing.game_status === GameResultStatus.LOSS) {
          existing.game_status = GameResultStatus.LOSS;
        }
      } else {
        accum.set(uniqueKey, { ...value });
      }
      return accum;
    }, new Map<string, TransactionSession>());

    const gameResult = Array.from(groupedGameResult.values());
    const losseGames = gameResult.filter(
      (result) => result.game_status === GameResultStatus.LOSS,
    );
    const winGames = gameResult.filter(
      (result) => result.game_status === GameResultStatus.WIN,
    );

    console.log('gruped resutl: ', groupedGameResult);
    console.log('gameResult: ', losseGames);
    console.log('Loss Games: ', losseGames);
    console.log('Win Games: ', winGames);

    return {
      totalWins: winGames.length,
      totalGamePlayed: gameResult.length,
      totalLosses: losseGames.length,
    };
  }
}
