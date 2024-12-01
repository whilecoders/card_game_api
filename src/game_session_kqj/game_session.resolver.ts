import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionKqjService } from './game_session.service';
import { PaginatedGameSessionKqjDto } from './dto/paginated-game-session-kqj';

@Resolver(() => GameSessionKqj)
export class GameSessionKqjResolver {
  constructor(private readonly gameSessionKqjService: GameSessionKqjService) {}

  @Mutation(() => GameSessionKqj)
  async updateGameSession(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateGameSessionDto') updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionKqjService.updateGameSession(
      id,
      updateGameSessionDto,
    );
  }

  @Query(() => GameSessionKqj, { name: 'getGameSessionBy' })
  async getGameSessionById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionKqjService.getGameSessionById(id);
  }

  @Query(() => PaginatedGameSessionKqjDto, { name: 'getAllGameSessions' })
  async getAllGameSessions(
    @Args('skip', { type: () => Int}) skip: number,
    @Args('take', { type: () => Int}) take: number,
  ): Promise<PaginatedGameSessionKqjDto> {
    return this.gameSessionKqjService.getAllGameSessions(skip, take);
  }
  
  @Query(() => [GameSessionKqj], { name: 'getLiveGameSessions' })
  async getLiveGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionKqjService.getLiveGameSessions();
  }

  @Query(() => [GameSessionKqj], { name: 'getGameSessionsByDate' })
  async getGameSessionsByDate(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<GameSessionKqj[]> {
    return await this.gameSessionKqjService.getGameSessionsByDate(
      startDate,
      endDate,
    );
  }

  @Query(() => [GameSessionKqj], { name: 'getTodaysGameSession' })
  async getTodaysGameSession(): Promise<GameSessionKqj[]> {
    return await this.gameSessionKqjService.getTodaysGameSession();
  }

  @Query(() => Number)
  async getTotalSessionsToday(): Promise<number> {
    return this.gameSessionKqjService.getTotalSessionsToday();
  }

  @Query(() => Number)
  async getFinishedSessionsToday(): Promise<number> {
    return this.gameSessionKqjService.getFinishedSessionsToday();
  }
}
