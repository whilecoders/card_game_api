import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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

  @Cron('23 23 * * *', {
    name: 'createDailyGame',
  })
  async createDailyGame(): Promise<void> {
    try {
      const currentDate = new Date();

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
      combinedDate.setSeconds(combinedDate.getSeconds() + seconds); // Add the seconds
      return combinedDate;
    };

    // Create session start and end times
    const sessionsToCreate: { start_time: Date; end_time: Date }[] = [];
    let currentStartTime = addSecondsToDateTime(startOfDay, start_time); // Initial session start time at game start time

    // Iterate to create the sessions
    for (let i = 0; i < game_in_day; i++) {
      // Calculate the end time for each session based on the game duration
      const endTime = new Date(currentStartTime);
      endTime.setSeconds(currentStartTime.getSeconds() + game_duration); // Add game_duration in seconds to get the end time

      sessionsToCreate.push({
        start_time: currentStartTime,
        end_time: endTime,
      });

      currentStartTime = endTime; // Update to the next session's start time
    }

    // Map the sessions to the GameSessionKqj format
    const gameSessions = this.gameSessionKqjRepository.create(
      sessionsToCreate.map((session) => ({
        game: games,
        session_start_time: session.start_time.toISOString(), // Store in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
        session_end_time: session.end_time.toISOString(), // Store in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
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
        'Error saving game sessions.',
        error,
      );
    }
  }
}
