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
  IsNull,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { GameSessionStatus } from '../common/constants';
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

  @Cron('01 18 * * *', { name: 'createDailyGame' })
  async createDailyGame(): Promise<void> {
    try {
      const currentDate = new Date();
      console.log(currentDate); 
      const game: Games | null = await this.gamesRepository.findOne({
        where: {
          start_date: LessThanOrEqual(currentDate),
          end_date: MoreThanOrEqual(currentDate),
        },
      });
      if (game === null) {
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
      console.log(error);
      
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
    const { start_time, game_duration, game_in_day, start_date, end_date } = games;

    // Check for overlapping game sessions
    const overlappingGameSession = await this.gameSessionKqjRepository.findOne({
      where: [
        {
          session_start_time: LessThanOrEqual(end_date),
          session_end_time: MoreThan(start_date),
        },
        {
          session_start_time: MoreThan(start_date),
          session_end_time: LessThanOrEqual(end_date),
        },
      ],
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
    const sessionsToCreate: { start_time: Date; end_time: Date, session_status: GameSessionStatus }[] = [];
    let currentStartTime = addSecondsToDateTime(startOfDay, start_time); // Initial session start time at game start time
    const currentTime = new Date()

    for (let i = 0; i < game_in_day; i++) {
      const endTime = new Date(currentStartTime);
      endTime.setSeconds(currentStartTime.getSeconds() + game_duration); // Add game_duration in seconds to get the end time
      sessionsToCreate.push({
        start_time: currentStartTime,
        end_time: endTime,
        session_status: 
         (currentTime.getTime() < endTime.getTime() && 
          currentTime.getTime() > currentStartTime.getTime())
            ?  GameSessionStatus.LIVE 
            :  currentTime.getTime() < currentStartTime.getTime() 
              ?  GameSessionStatus.UPCOMING
              :  GameSessionStatus.END,
      });
      currentStartTime = endTime; // Update to the next session's start time
    }

    // Map the sessions to the GameSessionKqj format
    const gameSessions = this.gameSessionKqjRepository.create(
      sessionsToCreate.map((session) => ({
        game: games,
        session_start_time: session.start_time.toISOString(),
        session_end_time: session.end_time.toISOString(), 
        session_status: session.session_status,
      })),
    );

    try {
      const createdSession = await this.gameSessionKqjRepository.save(gameSessions);
      for (const session of gameSessions) {
        let start = session.session_start_time;
        let end = session.session_end_time;

        if (typeof start === 'string' || typeof end == 'string') {
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
        const startJob: CronJob = new CronJob(
          `${start.getMinutes()} ${start.getHours()} ${start.getDate()} ${start.getMonth() + 1} *`,
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

        const endJob: CronJob = new CronJob(
          `${end.getMinutes()} ${end.getHours()} ${end.getDate()} ${end.getMonth() + 1} *`,
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

        this.schedulerRegistry.addCronJob(`session start ${start}`, startJob);
        this.schedulerRegistry.addCronJob(`session end ${end}`, endJob);

        startJob.start();
        endJob.start();
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
