import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { Games } from 'src/games/dbrepo/games.repository';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { GameSessionStatus } from '../common/constants';
import { DailyGame } from 'src/daily_game/dbrepo/daily_game.repository';

export class TaskScheduler {
  constructor(
    @Inject('GAMES_REPOSITORY')
    private gamesRepository: Repository<Games>,
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private gameSessionKqjRepository: Repository<GameSessionKqj>,
    @Inject('DAILY_GAME_REPOSITORY')
    private readonly dailyGameRepository: Repository<DailyGame>,
  ) {}

  @Cron('5 * * * *', {
    name: 'createDailyGame',
  })
  async createDailyGame(): Promise<void> {
    console.log("5 min")
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

    await this.createGameSessions();
  }
  private async createGameSessions(): Promise<GameSessionKqj[]> {
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
    const sessionsToCreate: { start_time: Date; end_time: Date }[] = [];
    let currentStartTime = addSecondsToDateTime(currentDate, start_time); // Initial session start time

    for (let i = 0; i < game_in_day; i++) {
      const endTime = addSecondsToDateTime(
        currentStartTime,
        '00:00:00',
        game_duration,
      );

      sessionsToCreate.push({
        start_time: currentStartTime,
        end_time: endTime,
      });

      currentStartTime = endTime; // Move to the next session's start time
    }

    const gameSessions = this.gameSessionKqjRepository.create(
      sessionsToCreate.map((session) => ({
        game: games,
        session_start_time: session.start_time,
        session_end_time: session.end_time,
        session_status: GameSessionStatus.UPCOMING,
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
      return createdSession;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error saving game sessions:',
        error,
      );
    }
  }
}
