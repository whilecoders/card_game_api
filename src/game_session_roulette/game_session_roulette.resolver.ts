import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameSessionRoulette } from './dbrepo/game-session-roulette.repository';
import { GameSessionRouletteService } from './game_session_roulette.service';
import { UpdateGameSessionRouletteDto } from './dto/update-game-session-roulette.dto';
import { PaginatedGameSessionRouletteDto } from './dto/paginated-game-session-roulette.dto';

@UseGuards(AuthGuard)
@Resolver(() => GameSessionRoulette)
export class GameSessionRouletteResolver {
  constructor(
    private readonly gameSessionRouletteService: GameSessionRouletteService,
  ) {}

  @Mutation(() => GameSessionRoulette)
  async updateRouletteGameSession(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateGameSessionRouletteDto')
    updateGameSessionRouletteDto: UpdateGameSessionRouletteDto,
  ): Promise<GameSessionRoulette> {
    return await this.gameSessionRouletteService.updateGameSessionRoulette(
      id,
      updateGameSessionRouletteDto,
    );
  }

  @Query(() => GameSessionRoulette, { name: 'getGameSessionRouletteById' })
  async getGameSessionById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<GameSessionRoulette> {
    return await this.gameSessionRouletteService.getGameSessionRouletteById(id);
  }

  @Query(() => PaginatedGameSessionRouletteDto, { name: 'getAllGameSessions' })
  async getAllGameSessions(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedGameSessionRouletteDto> {
    return this.gameSessionRouletteService.getAllGameSessionsRoulette(
      skip,
      take,
    );
  }

  @Query(() => GameSessionRoulette, {
    name: 'getLiveGameSessionRoulette',
    nullable: true,
  })
  async getLiveGameSessionsRoulette(): Promise<GameSessionRoulette> {
    return await this.gameSessionRouletteService.getLiveGameSessionRoulette();
  }

  @Query(() => [GameSessionRoulette], {
    name: 'getGameSessionsRouletteByDateOrToday',
  })
  async getGameSessionsByDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<GameSessionRoulette[]> {
    return this.gameSessionRouletteService.getGameSessionsRouletteByDateOrToday(
      filter,
    );
  }
}
