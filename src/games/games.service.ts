import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Games } from './dbrepo/games.repository';
import { CreateGamesDto } from './dto/create-game.input';
import { UpdateGamesDto as UpdateGameDto } from './dto/update-game.input';
import { GameSessionStatus, GameStatus } from 'src/common/constants';
import { DailyGame } from 'src/daily_game/dbrepo/daily_game.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class GamesService {
  constructor(
    @Inject('GAMES_REPOSITORY')
    private readonly gamesRepository: Repository<Games>,

    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,

    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,

    @Inject('DAILY_GAME_REPOSITORY')
    private readonly dailyGameRepository: Repository<DailyGame>,
  ) {}

  async createGame(createGameDto: CreateGamesDto): Promise<Games> {
    const admin = await this.userRepository.findOne({
      where: { id: createGameDto.admin_id },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const game = this.gamesRepository.create({ ...createGameDto });

    try {
      const game_created = await this.gamesRepository.save(game);
      if (!game_created) {
        throw new InternalServerErrorException(
          'Failed to create GameLaunch. Please try again.',
        );
      }
      return game_created;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server error 400');
    }
  }

  async createDailyGame(): Promise<void> {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const games = await this.gamesRepository.find({
      where: {
        start_date: LessThanOrEqual(currentDate),
        end_date: MoreThanOrEqual(currentDate),
      },
    });

    if (games.length === 0) {
      throw new NotFoundException('No games found for the current date.');
    }

    const dailyGamesToCreate = games.map((game) => ({
      games: game,
      createdAt: startOfDay,
    }));

    await this.dailyGameRepository.save(dailyGamesToCreate);
  }

  async createGameSessions(): Promise<GameSessionKqj[]> {
    const currentDate = new Date();

    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const dailyGame = await this.dailyGameRepository.findOne({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
      relations: ['games'],
    });

    if (!dailyGame) {
      throw new NotFoundException('No DailyGame entry found for today.');
    }
    const { games } = dailyGame;
    const { start_time, game_duration, game_in_day } = games;

    // Helper function to add seconds to a time string and return a Date with both date and time
    const addSecondsToDateTime = (
      date: Date,
      time: string,
      seconds: number = 0,
    ): Date => {
      const [hours, minutes, secs] = time.split(':').map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hours, minutes, secs || 0, 0); // Set the time component
      combinedDate.setSeconds(combinedDate.getSeconds() + seconds); // Add duration in seconds
      return combinedDate;
    };

    // Create session start and end times
    const sessionsToCreate: {
      start_time: Date;
      end_time: Date;
      session_status: GameSessionStatus;
    }[] = [];
    let currentStartTime = addSecondsToDateTime(currentDate, start_time); // Initial session start time

    for (let i = 0; i < game_in_day; i++) {
      let endTime = addSecondsToDateTime(
        currentStartTime,
        '00:00:00',
        game_duration,
      );

      sessionsToCreate.push({
        start_time: currentStartTime,
        end_time: endTime,
        session_status: GameSessionStatus.INACTIVE,
      });

      currentStartTime = endTime;
    }

    const gameSessions = this.gameSessionKqjRepository.create(
      sessionsToCreate.map((session) => ({
        games,
        session_start_time: session.start_time,
        session_end_time: session.end_time,
        session_status: session.session_status,
      })),
    );

    try {
      const createdSession =
        await this.gameSessionKqjRepository.save(gameSessions);
      if (!createdSession) {
        throw new InternalServerErrorException(
          'Failed to save game sessions. Please try again.',
        );
      }
console.log("one")
      createdSession.forEach((gameSession) => {
        const now = new Date();
        const sessionStartTime = new Date(gameSession.session_start_time);

        // If the session start time is in the past, we should not start a cron job
        if (sessionStartTime <= now) {
          console.warn(
            `Session start time is in the past for session ID: ${gameSession.id}`,
          );
          return;
        }

        // Calculate the delay in milliseconds
        const delay = sessionStartTime.getTime() - now.getTime();

        const job = new CronJob(
          new Date(Date.now() + delay),
          async () => {
            let toUpdate = await this.gameSessionKqjRepository.findOne({
              where: { id: gameSession.id },
            });
            if (toUpdate) {
              toUpdate.session_status = GameSessionStatus.LIVE;
              await this.gameSessionKqjRepository.save(toUpdate);
            }
            job.stop();
          },
          null, // Stop the cron job after it runs null,
          true, // Auto-start job
        );
      });

      console.log("two")


      return createdSession;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving game sessions:',
        error,
      );
    }
  }

  async updateGame(id: number, updateGameDto: UpdateGameDto): Promise<Games> {
    try {
      const game = await this.gamesRepository.findOne({
        where: { id },
        relations: { admin: true, gameSession: true },
      });

      if (!game) {
        throw new NotFoundException(`GameLaunch with ID ${id} not found`);
      }

      Object.assign(game, updateGameDto);

      return await this.gamesRepository.save(game);
    } catch (error) {
      console.error('Error updating GameLaunch:', error);
      throw new InternalServerErrorException('Failed to update GameLaunch.');
    }
  }

  async getAllGames(): Promise<Games[]> {
    try {
      const allGameLaunch = await this.gamesRepository.find({
        where: { deletedBy: null },
        relations: { admin: true, gameSession: true },
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
      relations: { admin: true, gameSession: true },
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

  async getGamesByDate(from: Date, to: Date): Promise<Games[]> {
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide valid ISO dates.',
      );
    }
    return await this.gamesRepository.find({
      where: {
        start_date: Between(from, to),
      },
      relations: { admin: true, gameSession: true },
    });
  }
}
