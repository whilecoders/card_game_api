import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionKqjService } from './game_session.service';
import { PaginatedGameSessionKqjDto } from './dto/paginated-game-session-kqj';
import { DateFilterDto } from 'src/common/model/date-filter.dto';

@Resolver(() => GameSessionKqj)
export class GameSessionKqjResolver {
  constructor(private readonly gameSessionKqjService: GameSessionKqjService) { }

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

  @Query(() => GameSessionKqj, { name: 'getGameSessionById' })
  async getGameSessionById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionKqjService.getGameSessionById(id);
  }

  @Query(() => PaginatedGameSessionKqjDto, { name: 'getAllGameSessions' })
  async getAllGameSessions(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedGameSessionKqjDto> {
    return this.gameSessionKqjService.getAllGameSessions(skip, take);
  }

  @Query(() => GameSessionKqj, { name: 'getLiveGameSessions', nullable: true })
  async getLiveGameSessions(): Promise<GameSessionKqj> {
    return await this.gameSessionKqjService.getLiveGameSessions();
  }


  @Query(() => [GameSessionKqj], { name: 'getGameSessionsByDateOrToday' })
  async getGameSessionsByDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true }) filter?: DateFilterDto,
  ): Promise<GameSessionKqj[]> {
    return this.gameSessionKqjService.getGameSessionsByDateOrToday(filter);
  }


  @Query(() => PaginatedGameSessionKqjDto, { name: 'getAllGameSessions' })
  async setSessionResult(
    @Args('sessionId', { type: () => Int }) sessionId: number,
    @Args('result', { type: () => String }) result: string,
  ): Promise<string | null> {
    return this.gameSessionKqjService.setSessionResult(sessionId, result);
  }
}
