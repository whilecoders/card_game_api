import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Games } from './dbrepo/games.repository';
import { CreateGamesDto } from './dto/create-game.input';
import { UpdateGamesDto } from './dto/update-game.input';
import { GameSessionStatus, GameStatus } from 'src/common/constants';

@Injectable()
export class GamesService {
  constructor(
    @Inject('GAMES_REPOSITORY')
    private readonly gamesRepository: Repository<Games>,

    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionRepository: Repository<GameSessionKqj>,

    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async createGame(createGameDto: CreateGamesDto): Promise<Games> {
    const admin = await this.userRepository.findOne({
      where: { id: createGameDto.user_id },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const gameLaunch = this.gamesRepository.create({
      ...createGameDto,
      admin,
      start_time: createGameDto.start_time,
      end_time: createGameDto.end_time,
      game_status: GameStatus.AVAILABLE,
    });

    try {
      const game_created = await this.gamesRepository.save(gameLaunch);
      if (!game_created) {
        throw new InternalServerErrorException(
          'Failed to create GameLaunch. Please try again.',
        );
      }

      await this.createGameSessions(
        game_created,
        createGameDto.start_time,
        createGameDto.game_duration,
        createGameDto.game_in_day,
      );

      return game_created;
    } catch (error) {
      console.error('Error creating GameLaunch:', error);
      throw new InternalServerErrorException('Internal Server error 400');
    }
  }

  private async createGameSessions(
    game: Games,
    start_time: Date,
    game_duration: number,
    gameInDay: number,
  ) {
    interface gameSessionPayload {
      start_time: Date;
      end_time: Date;
    }
    const sessionsToCreate: gameSessionPayload[] = [];

    let currentStartTime = new Date(start_time); // start time for the first session

    for (let i = 0; i < gameInDay; i++) {
      // Calculate end time by adding game_duration (converted to milliseconds) to the start time
      const endTime = new Date(
        currentStartTime.getTime() + game_duration * 1000,
      );

      // Push the session with start and end times to the array
      sessionsToCreate.push({
        start_time: new Date(currentStartTime),
        end_time: endTime,
      });

      // Update currentStartTime to the start of the next session
      currentStartTime = new Date(endTime);
    }

    const gameSession = this.gameSessionRepository.create(
      sessionsToCreate.map((val: gameSessionPayload) => ({
        game,
        session_start_time: val.start_time,
        session_end_time: val.end_time,
        session_status: GameSessionStatus.LIVE,
      })),
    );
    try {
      await this.gameSessionRepository.save(gameSession);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save game sessions. Please try again.',
      );
    }
  }

  async updateGame(
    id: number,
    updateGameLaunchDto: UpdateGamesDto,
  ): Promise<Games> {
    try {
      const gameLaunch = await this.gamesRepository.findOne({
        where: { id },
        relations: ['admin'],
      });

      if (!gameLaunch) {
        throw new NotFoundException(`GameLaunch with ID ${id} not found`);
      }

      gameLaunch.start_time = updateGameLaunchDto.start_time;
      gameLaunch.end_time = updateGameLaunchDto.end_time;
      gameLaunch.game_duration = updateGameLaunchDto.game_duration;
      gameLaunch.game_in_day = updateGameLaunchDto.game_in_day;
      gameLaunch.game_status = updateGameLaunchDto.game_status;

      await this.updateGameSessions(
        gameLaunch,
        gameLaunch.start_time,
        gameLaunch.game_duration,
        gameLaunch.game_in_day,
      );

      return await this.gamesRepository.save(gameLaunch);
    } catch (error) {
      console.error('Error updating GameLaunch:', error);
      throw new InternalServerErrorException('Failed to update GameLaunch.');
    }
  }

  private async updateGameSessions(
    game: Games,
    start_time: Date,
    game_duration: number,
    game_in_day: number,
  ) {
    try {
      const deleteResult = await this.gameSessionRepository.delete({ game });

      if (deleteResult.affected === 0) {
        throw new Error('No sessions were deleted for the specified game.');
      }

      const sessionsToCreate = [];
      let currentStartTime = new Date(start_time);

      for (let i = 0; i < game_in_day; i++) {
        const sessionEndTime = new Date(
          currentStartTime.getTime() + game_duration * 1000,
        );

        const newSession = this.gameSessionRepository.create({
          game,
          session_start_time: currentStartTime,
          session_end_time: sessionEndTime,
          session_status: GameSessionStatus.LIVE,
        });
        sessionsToCreate.push(newSession);
        currentStartTime = sessionEndTime;
      }

      const saveResult =
        await this.gameSessionRepository.save(sessionsToCreate);

      if (saveResult.length === 0) {
        throw new Error('No new sessions were saved to the database.');
      }
    } catch (error) {
      console.error('Error during updateGameSessions:', error);
      throw new Error('Failed to update game sessions. Please try again.');
    }
  }

  async getAllGames(): Promise<Games[]> {
    try {
      const allGameLaunch = await this.gamesRepository.find({
        where: { deletedBy: null },
        relations: ['admin', 'gameSession'],
      });
      if (!allGameLaunch.length)
        throw new NotFoundException(`No GameLaunches found`);
      return allGameLaunch;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve GameLaunches.',
      );
    }
  }

  async getGameById(id: number): Promise<Games> {
    const gameLaunch = await this.gamesRepository.findOne({
      where: { id, deletedBy: null },
      relations: ['admin', 'gameSession'],
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    return gameLaunch;
  }

  async deleteGame(id: number): Promise<void> {
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

  async getGamesByDate(startDate: string, endDate: string): Promise<Games[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide valid ISO dates.',
      );
    }

    return await this.gamesRepository.find({
      where: {
        start_time: Between(start, end),
      },
    });
  }
}
