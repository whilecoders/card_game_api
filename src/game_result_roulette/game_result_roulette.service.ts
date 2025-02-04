import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/dbrepo/user.repository';
import { Between, Repository } from 'typeorm';
import { GameResultRoulette } from './dbrepo/game_result_roulette.repository';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { GameResultStatus } from 'src/common/constants';
import { GameResultStats } from './dto/game_result_stats.dto';
import { CreateGameResultDto } from './dto/create_game_result_roulette.dto';
import { RecordSessionRoulette } from 'src/record_session_roulette/dbrepo/record-session-roulette.repository';

@Injectable()
export class GameResultRouletteService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('GAME_RESULT_ROULETTE_REPOSITORY')
    private readonly gameResultRouletteRepository: Repository<GameResultRoulette>,
    @Inject('RECORD_SESSION_ROULETTE_REPOSITORY')
    private readonly recordSessionRouletteRepository: Repository<RecordSessionRoulette>,
  ) {}

  async createGameResult(
    dto: CreateGameResultDto,
  ): Promise<GameResultRoulette> {
    const recordSessionRoulette =
      await this.recordSessionRouletteRepository.findOne({
        where: { id: dto.recordSessionId },
        relations: {
          user: true,
          game_session_roulette: true,
          game_result_roulette: true,
        },
      });
    if (!recordSessionRoulette) {
      throw new NotFoundException(
        `RecordSession with ID ${dto.recordSessionId} not found`,
      );
    }

    if (!recordSessionRoulette.user)
      throw new BadRequestException(
        'Associated user not found in record session.',
      );

    const gameResult = this.gameResultRouletteRepository.create({
      token: dto.token,
      game_status: dto.game_status,
      record_session_roulette: recordSessionRoulette,
      createdAt: new Date(),
    });

    try {
      return await this.gameResultRouletteRepository.save(gameResult);
    } catch (error) {
      console.error('Error saving transaction session:', error);
      throw new InternalServerErrorException(
        'Failed to create transaction session.',
      );
    }
  }

  async getGameResultById(id: number): Promise<GameResultRoulette> {
    const gameResult = await this.gameResultRouletteRepository.findOne({
      where: { id },
      relations: { record_session_roulette: true },
    });
    if (!gameResult) {
      throw new NotFoundException(`Game Result with ID ${id} not found`);
    }
    return gameResult;
  }

  async getAllGameResult(): Promise<GameResultRoulette[]> {
    try {
      return await this.gameResultRouletteRepository.find({
        relations: { record_session_roulette: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve Game Result');
    }
  }

  async getGameResultByUserId(userId: number): Promise<GameResultRoulette[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      const userResult = await this.gameResultRouletteRepository.find({
        relations: [
          'record_session_roulette',
          'record_session_roulette.user',
          'record_session_roulette.game_session_roulette',
        ],
        where: { record_session_roulette: { user: { id: userId } } },
      });
      if (!userResult) {
        throw new NotFoundException(`records with userId ${userId} not found`);
      }
      return userResult;
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw new InternalServerErrorException(
        'Failed to fetch transactions for the specified user.',
      );
    }
  }

  async getGameResultByDate(
    filter?: DateFilterDto,
  ): Promise<GameResultRoulette[]> {
    let start: Date;
    let end: Date;

    if (filter && filter.startDate && filter.endDate) {
      start = new Date(filter.startDate);
      end = new Date(filter.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException(
          'Invalid date format. Please provide valid ISO dates.',
        );
      }
      if (start >= end) {
        throw new BadRequestException('Start date must be before end date.');
      }
    } else {
      const today = new Date();
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
    }

    try {
      return await this.gameResultRouletteRepository.find({
        where: {
          createdAt: Between(start, end),
        },
        relations: ['record_session_roulette', 'record_session_roulette.user'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions by date.');
    }
  }

  async getPlayerStats(userId: number): Promise<GameResultStats> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      new NotFoundException('No user found');
    }

    const totalUserBets = await this.gameResultRouletteRepository.find({
      where: {
        record_session_roulette: { user: { id: userId } },
      },
      relations: [
        'record_session_roulette',
        'record_session_roulette.game_session_roulette',
      ],
    });

    // Group bets by `game_session_id`
    const groupedGameResult = totalUserBets.reduce<
      Map<string, GameResultRoulette>
    >((accum, value) => {
      const uniqueKey =
        value.record_session_roulette.game_session_roulette.id.toString();
      if (accum.has(uniqueKey)) {
        const existing = accum.get(uniqueKey)!;
        if (value.game_status === GameResultStatus.WIN) {
          existing.game_status = GameResultStatus.WIN;
        }
        if (existing.game_status === GameResultStatus.LOSS) {
          existing.game_status = GameResultStatus.LOSS;
        }
      } else {
        accum.set(uniqueKey, { ...value });
      }
      return accum;
    }, new Map<string, GameResultRoulette>());

    const gameResult = Array.from(groupedGameResult.values());
    const losseGames = gameResult.filter(
      (result) => result.game_status === GameResultStatus.LOSS,
    );
    const winGames = gameResult.filter(
      (result) => result.game_status === GameResultStatus.WIN,
    );

    console.log('gruped resutl: ', groupedGameResult);
    console.log('gameResult: ', losseGames);
    console.log('Loss Games: ', losseGames);
    console.log('Win Games: ', winGames);

    return {
      totalWins: winGames.length,
      totalGamePlayed: gameResult.length,
      totalLosses: losseGames.length,
    };
  }
}
