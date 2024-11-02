import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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
      throw new Error('gameInDay is required and cannot be empty .');
    }

    // Convert start_time from string to Date
    const sessionStartTime = new Date(start_time);

    // Check if sessionStartTime is valid
    if (isNaN(sessionStartTime.getTime())) {
      throw new Error(
        'Invalid start_time format. Must be a valid date string.',
      );
    }

    const sessionsToCreate = [];
    console.log(start_time)
    for (let i = 0; i < gameInDay; i++) {
      const sessionEndTime = calculateSessionEndTime(
        sessionStartTime,
        game_duration,
      );
      console.log(`Session ${i + 1}: Start Time = ${sessionStartTime}, End Time = ${sessionEndTime}`);

      const session = this.gameSessionRepository.create({
        game_launch: gameLaunch,
        session_start_time: new Date(sessionStartTime),
        session_end_time: new Date(sessionEndTime),
      });
      console.log(`Created Session:`, session);
      sessionsToCreate.push(session);
      sessionStartTime.setTime(
        sessionStartTime.getTime() + parseGameDuration(game_duration),
      );
    }

    try {
      await this.gameSessionRepository.save(sessionsToCreate);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save game sessions. Please try again.',
      );
    }
  }

  async updateGameLauncher(
    id: string,
    updateGameLaunchDto: UpdateGameLaunchDto,
  ): Promise<GameLaunch> {
    const gameLaunch = await this.gameLaunchRepository.findOne({
      where: { id },
      relations: ['sessions'],
    });
  
    if (!gameLaunch) {
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    }
  
    // Update only the provided fields
    if (updateGameLaunchDto.start_time) {
      gameLaunch.start_time = new Date(updateGameLaunchDto.start_time);
    }
    if (updateGameLaunchDto.end_time) {
      gameLaunch.end_time = new Date(updateGameLaunchDto.end_time);
    }
    if (updateGameLaunchDto.game_duration) {
      gameLaunch.game_duration = updateGameLaunchDto.game_duration;
    }
    if (updateGameLaunchDto.game_in_day) {
      gameLaunch.game_in_day = updateGameLaunchDto.game_in_day;
    }
    if (updateGameLaunchDto.game_launch_status) {
      gameLaunch.game_launch_status = updateGameLaunchDto.game_launch_status;
    }
  
    // Update sessions if related fields are modified
    if (
      updateGameLaunchDto.start_time ||
      updateGameLaunchDto.game_duration ||
      updateGameLaunchDto.game_in_day
    ) {
      await this.updateGameSessions(
        gameLaunch,
        updateGameLaunchDto.start_time,
        updateGameLaunchDto.game_duration || gameLaunch.game_duration,
        updateGameLaunchDto.game_in_day || gameLaunch.game_in_day,
      );
    }
  
    try {
      return await this.gameLaunchRepository.save(gameLaunch);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update GameLaunch. Please try again.',
      );
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
  
    const sessionsToCreate = [];
    const sessionsToUpdate = [];
  
    for (let i = 0; i < game_in_day; i++) {
      const sessionEndTime = calculateSessionEndTime(
        sessionStartTime,
        game_duration,
      );
  
      if (i < existingSessions.length) {
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
      sessionStartTime.setTime(sessionStartTime.getTime() + parseGameDuration(game_duration));
    }
  
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
     const allGameLaunch=await this.gameLaunchRepository.find({
        relations: ['admin'],
      });
      if (!allGameLaunch)
        throw new NotFoundException(`GameLaunch not found`);
      return allGameLaunch
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve GameLaunches.',
      );
    }
  }

  async getGameLaunchById(id: string): Promise<GameLaunch> {
    const gameLaunch = await this.gameLaunchRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
    if (!gameLaunch)
      throw new NotFoundException(`GameLaunch with ID ${id} not found`);
    return gameLaunch;
  }

  async softDeleteGameLauncher(id: string): Promise<void> {
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
}
