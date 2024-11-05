import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionKqjService } from './game_session.service';

@Resolver(() => GameSessionKqj)
export class GameSessionKqjResolver {
  constructor(private readonly gameSessionService: GameSessionKqjService) {}

  @Mutation(() => GameSessionKqj)
  async updateGameSession(
    @Args('id') id: number,
    @Args('updateGameSessionDto') updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionService.updateGameSession(
      id,
      updateGameSessionDto,
    );
  }

  @Query(() => GameSessionKqj, { name: 'getGameSessionById' })
  async getGameSessionById(@Args('id') id: number): Promise<GameSessionKqj> {
    return await this.gameSessionService.getGameSessionById(id);
  }

  @Query(() => [GameSessionKqj], { name: 'getAllGameSessions' })
  async getAllGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionService.getAllGameSessions();
  }

  @Query(() => [GameSessionKqj], { name: 'getLiveGameSessions' })
  async getLiveGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionService.getLiveGameSessions();
  }

  @Query(() => [GameSessionKqj], { name: 'getGameSessionsByDate' })
  async getGameSessionsByDate(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<GameSessionKqj[]> {
    return await this.gameSessionService.getGameSessionsByDate(startDate, endDate);
  }

}
