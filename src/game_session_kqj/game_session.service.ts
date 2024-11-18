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

  async getAllGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionKqjRepository.find({
      relations: ['game', 'record_session_kqj'],
    });
  }

  async getLiveGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionKqjRepository.find({
      where: { session_status: GameSessionStatus.LIVE },
      relations: ['game', 'record_session_kqj'],
    });
  }

  async getGameSessionsByDate(
    startDate: Date,
    endDate: Date,
  ): Promise<GameSessionKqj[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide valid ISO dates.',
      );
    }

    return await this.gameSessionKqjRepository.find({
      where: {
        session_start_time: Between(start, end),
      },
      relations: ['game', 'record_session_kqj'],
    });
  }

  async getTodaysGameSession(): Promise<GameSessionKqj[]> {
    try {
      const today = new Date();

      const todaysSessions = await this.gameSessionKqjRepository.find({
        where: {
          session_start_time: Between(
            today,
            new Date(today.getTime() + 24 * 60 * 60 * 1000),
          ),
        },
        relations: { game: { admin: true, gameSession: true } },
      });

      if (!todaysSessions.length) {
        throw new NotFoundException('No game sessions found for today.');
      }

      return todaysSessions;
    } catch (error) {
      console.error("Error retrieving today's game sessions:", error);
      throw new InternalServerErrorException(
        "Failed to retrieve today's game sessions.",
      );
    }
  }
}
