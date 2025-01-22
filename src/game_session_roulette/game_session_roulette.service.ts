import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { GameSessionStatus } from 'src/common/constants';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { GameSessionRoulette } from './dbrepo/game-session-roulette.repository';
import { UpdateGameSessionRouletteDto } from './dto/update-game-session-roulette.dto';
import { PaginatedGameSessionRouletteDto } from './dto/paginated-game-session-roulette.dto';

@Injectable()
export class GameSessionRouletteService {
  constructor(
    @Inject('GAMES_SESSION_ROULETTE_REPOSITORY')
    private readonly gameSessionRouletteRepository: Repository<GameSessionRoulette>,
  ) {}

  async updateGameSessionRoulette(
    id: number,
    updateGameSessionRouletteDto: UpdateGameSessionRouletteDto,
  ): Promise<GameSessionRoulette> {
    try {
      const gameSessionRoulette =
        await this.gameSessionRouletteRepository.findOne({
          where: { id },
        });
      if (!gameSessionRoulette)
        throw new NotFoundException(`GameSession with ID ${id} not found`);
      gameSessionRoulette.game_result_card =
        updateGameSessionRouletteDto.game_result_roulette_number;

      return await this.gameSessionRouletteRepository.save(gameSessionRoulette);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update game session. Please check input values and try again.',
      );
    }
  }

  async getGameSessionRouletteById(id: number): Promise<GameSessionRoulette> {
    const gameSessionRoulette =
      await this.gameSessionRouletteRepository.findOne({
        where: { id },
      });
    if (!gameSessionRoulette) {
      throw new NotFoundException(`GameSession with ID ${id} not found`);
    }
    return gameSessionRoulette;
  }

  async getAllGameSessionsRoulette(
    skip: number,
    take: number,
  ): Promise<PaginatedGameSessionRouletteDto> {
    const [data, count] = await this.gameSessionRouletteRepository.findAndCount(
      {
        relations: { game_roulette: true, record_session_roulette: true },
        skip,
        take,
      },
    );

    return {
      data,
      count,
      skip,
      take,
    };
  }

  async getLiveGameSessionRoulette(): Promise<GameSessionRoulette> {
    const finded = await this.gameSessionRouletteRepository.find({
      where: { session_status: GameSessionStatus.LIVE },
      relations: { game_roulette: true, record_session_roulette: true },
    });
    return finded[finded.length - 1];
  }

  async getGameSessionsRouletteByDateOrToday(
    filter?: DateFilterDto,
  ): Promise<GameSessionRoulette[]> {
    try {
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
      } else {
        const today = new Date();
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
      }
      const sessions = await this.gameSessionRouletteRepository.find({
        where: { session_start_time: Between(start, end) },
        relations: { game_roulette: true, record_session_roulette: true },
      });
      if (!sessions.length) {
        return [];
      }
      return sessions;
    } catch (error) {
      console.error('Error retrieving game sessions:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve game sessions.',
      );
    }
  }
}
