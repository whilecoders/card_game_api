import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionStatus } from 'src/common/constants';
import { PaginatedGameSessionKqjDto } from './dto/paginated-game-session-kqj';
import { DateFilterDto } from 'src/common/model/date-filter.dto';

@Injectable()
export class GameSessionKqjService {
  constructor(
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
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
    } catch (error) {
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
    const finded = await this.gameSessionKqjRepository.findOne({
      where: { session_status: GameSessionStatus.LIVE, createdAt: new Date() },
      relations: ['game', 'record_session_kqj'],
    });
    // console.log(finded);
    return finded;
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
        const today = new Date();
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
      }
      const sessions = await this.gameSessionKqjRepository.find({
        where: { session_start_time: Between(start, end) },
        relations: ['game', 'record_session_kqj'],
      });
      // console.log(sessions);
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

  async generateResult() {}
}
