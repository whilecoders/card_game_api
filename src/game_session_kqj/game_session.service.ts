import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionStatus } from 'src/common/constants';

@Injectable()
export class GameSessionKqjService {
  constructor(
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionRepository: Repository<GameSessionKqj>,
  ) {}

  async updateGameSession(
    id: string,
    updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    try {
      const gameSession = await this.gameSessionRepository.findOne({
        where: { id },
      });
      if (!gameSession) {
        throw new NotFoundException(`GameSession with ID ${id} not found`);
      }

      if (updateGameSessionDto.game_result_card) {
        gameSession.game_result_card = updateGameSessionDto.game_result_card;
      }
      if (updateGameSessionDto.session_status) {
        gameSession.session_status = updateGameSessionDto.session_status;
      }

      return await this.gameSessionRepository.save(gameSession);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update game session. Please check input values and try again.',
      );
    }
  }
  async getGameSessionById(id: string): Promise<GameSessionKqj> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id },
    });
    if (!gameSession) {
      throw new NotFoundException(`GameSession with ID ${id} not found`);
    }
    return gameSession;
  }

  async getAllGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionRepository.find();
  }

  async getLiveGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionRepository.find({
      where: { session_status: GameSessionStatus.LIVE },
    });
  }

  async getGameSessionsByDate(date: string): Promise<GameSessionKqj[]> {
    const start = new Date(date);
    const end = new Date(date);

    // Set `end` to the end of the day (23:59:59)
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide a valid ISO date.',
      );
    }

    return await this.gameSessionRepository.find({
      where: {
        session_start_time: Between(start, end),
      },
    });
  }
}
