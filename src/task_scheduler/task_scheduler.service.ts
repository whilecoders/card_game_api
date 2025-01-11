import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { Games } from 'src/games/dbrepo/games.repository';
import {
  Between,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { GameKqjCards, GameSessionStatus } from '../common/constants';
import { DailyGame } from 'src/daily_game/dbrepo/daily_game.repository';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { GamesocketGateway } from 'src/gamesocket/gamesocket.gateway';

export class TaskScheduler {
  constructor(
    @Inject('GAMES_REPOSITORY')
    private gamesRepository: Repository<Games>,
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private gameSessionKqjRepository: Repository<GameSessionKqj>,
    @Inject('DAILY_GAME_REPOSITORY')
    private readonly dailyGameRepository: Repository<DailyGame>,
    private schedulerRegistry: SchedulerRegistry,
    private gamesocketGateway: GamesocketGateway,
  ) { }

  @Cron('0 20 * * *', { name: 'createDailyGame' })
  async creaeDailyGame(): Promise<void> {

    try {
      const currentDate = new Date();
      console.log(currentDate);

      const game = await this.gamesRepository.findOne({
        where: {
          start_date: LessThanOrEqual(currentDate),
          end_date: MoreThanOrEqual(currentDate),
        },
      });

      if (!game) {
        throw new NotFoundException('No game found for the current date.');
      }

      const dailyGameToCreate = {
        games: game,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      await this.dailyGameRepository.save(dailyGameToCreate);
      await this.createGameSessions();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create daily games.');
      }
    }
  }

  private async createGameSessions(): Promise<GameSessionKqj[]> {
    const currentDate = new Date();

    // Set the current date (today) without the time component
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const currentDateWithTime = new Date(currentDate.setHours(23, 59, 59, 999));
    console.log('creating game sessions', startOfDay);

    // Fetch today's DailyGame
    const dailyGame = await this.dailyGameRepository.findOne({
      where: {
        createdAt: Between(startOfDay, currentDateWithTime),
      },
      relations: ['games'],
    });

    if (!dailyGame) {
      throw new NotFoundException('No DailyGame entry found for today.');
    }

    const { games } = dailyGame;
    const { start_time, game_duration, game_in_day, start_date, end_date, id } =
      games;

    // Check for overlapping game sessions
    const overlappingGameSession = await this.gameSessionKqjRepository.findOne({
      where: { createdAt: Between(startOfDay, currentDateWithTime), game: { id: id } }
      // where: [
      //   {
      //     session_start_time: LessThanOrEqual(end_date),
      //     session_end_time: MoreThan(start_date),
      //   },
      //   {
      //     session_start_time: MoreThan(start_date),
      //     session_end_time: LessThanOrEqual(end_date),
      //   },
      // ],
    });

    if (overlappingGameSession) {
      throw new ConflictException(
        'A game session already exists within the specified time range.',
      );
    }

    // Helper function to add seconds to a time string and return a Date with both date and time
    const addSecondsToDateTime = (
      date: Date,
      time: string,
      seconds: number = 0,
    ): Date => {
      const [hours, minutes, secs] = time.split(':').map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hours, minutes, secs || 0, 0); // Set the time component
      combinedDate.setSeconds(combinedDate.getSeconds() + seconds); // Add the seconds
      return combinedDate;
    };

    // Create session start and end times
    const sessionsToCreate: {
      start_time: Date;
      end_time: Date;
      session_status: GameSessionStatus;
    }[] = [];
    let currentStartTime = addSecondsToDateTime(startOfDay, start_time); // Initial session start time at game start time
    const currentTime = new Date();
    // Iterate to create the sessions
    for (let i = 0; i < game_in_day; i++) {
      // Calculate the end time for each session based on the game duration
      const endTime = new Date(currentStartTime);
      endTime.setSeconds(currentStartTime.getSeconds() + game_duration); // Add game_duration in seconds to get the end time

      sessionsToCreate.push({
        start_time: currentStartTime,
        end_time: endTime,
        session_status:
          currentTime.getTime() < endTime.getTime() &&
            currentTime.getTime() > currentStartTime.getTime()
            ? GameSessionStatus.LIVE
            : currentTime.getTime() < currentStartTime.getTime()
              ? GameSessionStatus.UPCOMING
              : GameSessionStatus.END,
      });
      currentStartTime = endTime;
    }

    // Map the sessions to the GameSessionKqj format
    const gameSessions = this.gameSessionKqjRepository.create(
      sessionsToCreate.map((session) => ({
        game: games,
        session_start_time: session.start_time,
        session_end_time: session.end_time,
        session_status: session.session_status,
      })),
    );

    try {
      const createdSession =
        await this.gameSessionKqjRepository.save(gameSessions);

      for (const session of gameSessions) {
        let start = new Date(session.session_start_time);
        let end = new Date(session.session_end_time);

        // Convert to IST and reassign to the same variables
        start = new Date(
          start.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        );
        end = new Date(
          end.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        );

        if (typeof start === 'string' || typeof end === 'string') {
          start = new Date(start);
          end = new Date(end);
        }
        // Validate Date
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error(
            'Invalid date for session_start_time:',
            session.session_start_time,
          );
          continue;
        }
        const toMinmiumDigit = (value: number) =>
          `${value < 10 ? `0${value}` : value}`;
        // start game
        const startJob: CronJob = new CronJob(
          `${toMinmiumDigit(start.getMinutes())} ${toMinmiumDigit(start.getHours())} ${toMinmiumDigit(start.getDate())} ${toMinmiumDigit(start.getMonth() + 1)} *`,
          async () => {
            console.log('stating game session ');
            const startSession = await this.gameSessionKqjRepository.update(
              session.id,
              { session_status: GameSessionStatus.LIVE },
            );
            this.gamesocketGateway.broadcastEvent('gameStart', {
              sessionId: session.id,
            });
          },
        );
        startJob.runOnce = true;

        // end game
        const endJob: CronJob = new CronJob(
          `${toMinmiumDigit(end.getMinutes())} ${toMinmiumDigit(end.getHours())} ${toMinmiumDigit(end.getDate())} ${toMinmiumDigit(end.getMonth() + 1)} *`,
          async () => {
            console.log('stating game session ');
            const startSession = await this.gameSessionKqjRepository.update(
              session.id,
              { session_status: GameSessionStatus.END },
            );
            this.gamesocketGateway.broadcastEvent('gameEnd', {
              sessionId: session.id,
            });
          },
        );
        endJob.runOnce = true;

        const resultJob: CronJob = new CronJob(
          `${toMinmiumDigit(end.getMinutes() - 1)} ${toMinmiumDigit(end.getHours())} ${toMinmiumDigit(end.getDate())} ${toMinmiumDigit(end.getMonth() + 1)} *`,
          async () => {
            console.log('show game session result');
            let game_result: GameKqjCards = session.game_result_card
              ? session.game_result_card
              : generateResult(GameKqjCards);
            // console.log("game ka result -> ", session);
            this.gamesocketGateway.broadcastEvent('gameResult', {
              sessionId: session.id,
              game_result,
            });
          },
        );
        resultJob.runOnce = true;

        this.schedulerRegistry.addCronJob(`session start ${start}`, startJob);
        this.schedulerRegistry.addCronJob(`session end ${end}`, endJob);
        this.schedulerRegistry.addCronJob(`session result ${end}`, resultJob);

        startJob.start();
        endJob.start();
        resultJob.start();
      }

      if (!createdSession) {
        throw new InternalServerErrorException(
          'Failed to save game sessions. Please try again.',
        );
      }
      return createdSession;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error saving game sessions.',
        error,
      );
    }
  }
}

function generateResult<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as T[keyof T];
}
