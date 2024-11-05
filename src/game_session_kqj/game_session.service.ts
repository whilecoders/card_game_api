import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateGameSessionDto } from './dto/create-game_session.input';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameLaunch } from 'src/game_launch/dbrepo/game_launch.repository';
import { GameSessionKqj } from './dbrepo/game_session.repository';

@Injectable()
export class GameSessionKqjService {
  constructor(
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionRepository: Repository<GameSessionKqj>,
    @Inject('GAME_LAUNCH_REPOSITORY')
    private readonly gameLaunchRepository: Repository<GameLaunch>,
  ) {}

  async createGameSession(
    createGameSessionDto: CreateGameSessionDto,
  ): Promise<GameSessionKqj> {
    const { game_launch_id } = createGameSessionDto;

    try {
      const gameLaunch = await this.gameLaunchRepository.findOne({
        where: { id: game_launch_id },
      });
      if (!gameLaunch)
        throw new NotFoundException(
          `GameLaunch with ID ${game_launch_id} not found`,
        );

      const newGameSession = this.gameSessionRepository.create({
        ...createGameSessionDto,
        game_launch: gameLaunch,
      });

      return await this.gameSessionRepository.save(newGameSession);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create game session. Please check input values and try again.',
      );
    }
  }

  async updateGameSession(
    id: number,
    updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    try {
      const gameSession = await this.gameSessionRepository.findOne({
        where: { id },
      });
      if (!gameSession)
        throw new NotFoundException(`GameSession with ID ${id} not found`);

      if (updateGameSessionDto.game_launch_id) {
        const gameLaunch = await this.gameLaunchRepository.findOne({
          where: { id: updateGameSessionDto.game_launch_id },
        });
        if (!gameLaunch)
          throw new NotFoundException(
            `GameLaunch with ID ${updateGameSessionDto.game_launch_id} not found`,
          );
        gameSession.game_launch = gameLaunch;
      }

      Object.assign(gameSession, updateGameSessionDto);
      return await this.gameSessionRepository.save(gameSession);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update game session. Please check input values and try again.',
      );
    }
  }
  async getGameSessionById(id: number): Promise<GameSessionKqj> {
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

  async getGameSessionsByDate(startDate: Date, endDate: Date): Promise<GameSessionKqj[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Please provide valid ISO dates.');
    }

    return await this.gameSessionRepository.find({
      where: {
        session_start_time: Between(start, end),
      },
    });
  }
}
