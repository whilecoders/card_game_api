import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { GameLaunch } from './dbrepo/game_launch.repository';
import { CreateGameLaunchDto } from './dto/create-game_launch.input';
import { UpdateGameLaunchDto } from './dto/update-game_launch.input';
import {
  calculateSessionEndTime,
  parseGameDuration,
} from 'src/common/helper/gameLaunch.helper';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { User } from 'src/user/dbrepo/user.repository';

@Injectable()
export class GameLaunchService {
  constructor(
    @Inject('GAME_LAUNCH_REPOSITORY')
    private readonly gameLaunchRepository: Repository<GameLaunch>,

    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionRepository: Repository<GameSessionKqj>,

    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async createGameLauncher(
    createGameLaunchDto: CreateGameLaunchDto,
    adminId: string,
  ): Promise<GameLaunch> {
    try {
      const admin = await this.userRepository.findOne({
        where: { id: adminId },
      });
      if (!admin) {
        throw new NotFoundException('Admin user not found');
      }

      const gameLaunch = this.gameLaunchRepository.create({
        ...createGameLaunchDto,
        admin,
        start_time: new Date(createGameLaunchDto.start_time),
        end_time: new Date(createGameLaunchDto.end_time),
      });

      const game_created = await this.gameLaunchRepository.save(gameLaunch);
      if (!game_created) {
        throw new InternalServerErrorException(
          'Failed to create GameLaunch. Please try again.',
        );
      }

      await this.createGameSessions(
        game_created,
        createGameLaunchDto.start_time,
        createGameLaunchDto.game_duration,
        createGameLaunchDto.game_in_day,
      );

      return game_created;
    } catch (error) {
      console.error('Error creating GameLaunch:', error);
      throw new InternalServerErrorException('Internal Server error 400');
    }
  }

  private async createGameSessions(
    gameLaunch: GameLaunch,
    start_time: string,
    game_duration: string,
    gameInDay: number,
  ) {
    if (!gameLaunch) {
      throw new Error(
        'gameLaunch is required and cannot be null or undefined.',
      );
    }

    if (!start_time) {
      throw new Error('start_time is required and cannot be empty.');
    }

    if (!game_duration) {
      throw new Error('game_duration is required and cannot be empty.');
    }

    if (gameInDay === undefined) {
      throw new Error('gameInDay is required and cannot be empty.');
    }

    // Convert start_time from string to Date
    const sessionStartTime = new Date(start_time);

    // Check if sessionStartTime is valid
    if (isNaN(sessionStartTime.getTime())) {
      throw new Error(
        'Invalid start_time format. Must be a valid date string.',
      );
    }

    // Log the initial values
    console.log('Initial start_time:', sessionStartTime.toISOString());
    console.log('Game duration:', game_duration);

    const sessionsToCreate = [];

    for (let i = 0; i < gameInDay; i++) {
      const durationInMs = parseGameDuration(game_duration);
      console.log(`Parsed game duration in ms: ${durationInMs}`);

      // Ensure durationInMs is valid
      if (isNaN(durationInMs) || durationInMs <= 0) {
        throw new Error(
          'Parsed duration is invalid. Please check the game_duration format.',
        );
      }

      const sessionEndTime = calculateSessionEndTime(
        sessionStartTime,
        game_duration,
      );

      // Ensure sessionEndTime is valid
      if (isNaN(sessionEndTime.getTime())) {
        throw new Error('Calculated end time is invalid.');
      }

      console.log(
        `Session ${i + 1}: Start Time = ${sessionStartTime.toISOString()}, End Time = ${sessionEndTime.toISOString()}`,
      );

      const session = this.gameSessionRepository.create({
        game_launch: gameLaunch,
        session_start_time: new Date(sessionStartTime),
        session_end_time: new Date(sessionEndTime),
      });

      console.log(`Created Session:`, session);
      sessionsToCreate.push(session);

      // Update the start time for the next session
      sessionStartTime.setTime(sessionStartTime.getTime() + durationInMs);
    }

    try {
      await this.gameSessionRepository.save(sessionsToCreate);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save game sessions. Please try again.',
      );
    }
  }

  async updateGameLaunch(
    id: string,
    updateGameLaunchDto: UpdateGameLaunchDto,
  ): Promise<GameLaunch> {
    const gameLaunch = await this.gameLaunchRepository.findOne({ where: { id } });
  
    if (!gameLaunch) {
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    }
  
    const startTime = new Date(updateGameLaunchDto.start_time);
    const endTime = new Date(updateGameLaunchDto.end_time);

    gameLaunch.start_time = startTime;
    gameLaunch.end_time = endTime;
    gameLaunch.game_duration = updateGameLaunchDto.game_duration;
    gameLaunch.game_in_day = updateGameLaunchDto.game_in_day;

    if (updateGameLaunchDto.game_launch_status) {
      gameLaunch.game_launch_status = updateGameLaunchDto.game_launch_status;
    }  

    await this.updateGameSessions(
      gameLaunch,
      updateGameLaunchDto.start_time,
      updateGameLaunchDto.game_duration,
      updateGameLaunchDto.game_in_day,
    );
  
    try {
      return await this.gameLaunchRepository.save(gameLaunch);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update GameLaunch.');
    }
  }
  

  private async updateGameSessions(
    gameLaunch: GameLaunch,
    start_time: string,
    game_duration: string,
    game_in_day: number,
  ) {
    // Convert start_time from string to Date
    let sessionStartTime = new Date(start_time);
    const existingSessions = await this.gameSessionRepository.find({
      where: { game_launch: gameLaunch },
    });

    // Validate sessionStartTime
    if (isNaN(sessionStartTime.getTime())) {
      throw new Error(
        'Invalid start_time format. Must be a valid date string.',
      );
    }

    const sessionsToCreate = [];
    const sessionsToUpdate = [];
    const durationInMs = parseGameDuration(game_duration);

    // Log the initial values
    console.log('Initial start_time:', sessionStartTime.toISOString());
    console.log('Game duration (ms):', durationInMs);

    for (let i = 0; i < game_in_day; i++) {
      const sessionEndTime = calculateSessionEndTime(
        sessionStartTime,
        game_duration,
      );

      if (i < existingSessions.length) {
        // Update existing session
        const session = existingSessions[i];
        session.session_start_time = sessionStartTime;
        session.session_end_time = sessionEndTime;
        sessionsToUpdate.push(session);
      } else {
        // Create new session if `game_in_day` increased
        const session = this.gameSessionRepository.create({
          game_launch: gameLaunch,
          session_start_time: sessionStartTime,
          session_end_time: sessionEndTime,
        });
        sessionsToCreate.push(session);
      }

      // Update session start time for the next iteration
      sessionStartTime.setTime(sessionStartTime.getTime() + durationInMs);
    }

    // Remove extra sessions if game_in_day is decreased
    const sessionsToRemove = existingSessions.slice(game_in_day);

    try {
      await this.gameSessionRepository.remove(sessionsToRemove);
      await this.gameSessionRepository.save([
        ...sessionsToUpdate,
        ...sessionsToCreate,
      ]);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update game sessions. Please try again.',
      );
    }
  }

  async getAllGameLaunches(): Promise<GameLaunch[]> {
    try {
      const allGameLaunch = await this.gameLaunchRepository.find({
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

  async getGameLaunchById(id: string): Promise<GameLaunch> {
    const gameLaunch = await this.gameLaunchRepository.findOne({
      where: { id, deletedBy: null },
      relations: ['admin', 'gameSession'],
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    return gameLaunch;
  }

  async deleteGameLauncher(id: string): Promise<void> {
    const gameLaunch = await this.gameLaunchRepository.findOne({
      where: { id },
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);

    gameLaunch.deletedBy = 'system';
    gameLaunch.deletedAt = new Date();

    try {
      await this.gameLaunchRepository.save(gameLaunch);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to soft delete GameLaunch.',
      );
    }
  }


  async getGameLaunchByDate(startDate: string, endDate: string): Promise<GameLaunch[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Please provide valid ISO dates.');
    }

    return await this.gameLaunchRepository.find({
      where: {
        start_time: Between(start, end),
      },
    });
  }

  async undeleteGameLaunch(id: string): Promise<void> {
    const gameLaunch = await this.gameLaunchRepository.findOne({
      where: { id },
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);

    if (gameLaunch.deletedBy === null) {
      throw new BadRequestException(`GameLaunch with ID ${id} is not deleted`);
    }

    gameLaunch.deletedBy = null;
    gameLaunch.deletedAt = null;

    try {
      await this.gameLaunchRepository.save(gameLaunch);
    } catch (error) {
      throw new InternalServerErrorException('Failed to undelete GameLaunch.');
    }
  }
}
