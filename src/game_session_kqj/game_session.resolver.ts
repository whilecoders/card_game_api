import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CreateGameSessionDto } from './dto/create-game_session.input';
import { UpdateGameSessionDto } from './dto/update-game_session.input';
import { GameSessionKqj } from './dbrepo/game_session.repository';
import { GameSessionKqjService } from './game_session.service';

@Resolver(() => GameSessionKqj)
export class GameSessionKqjResolver {
  constructor(private readonly gameSessionService: GameSessionKqjService) {}

  @Mutation(() => GameSessionKqj)
  async createGameSession(
    @Args('createGameSessionDto') createGameSessionDto: CreateGameSessionDto,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionService.createGameSession(
      createGameSessionDto,
    );
  }

  @Mutation(() => GameSessionKqj)
  async updateGameSession(
    @Args('id') id: string,
    @Args('updateGameSessionDto') updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionService.updateGameSession(
      id,
      updateGameSessionDto,
    );
  }

  @Query(() => GameSessionKqj, { name: 'getGameSessionById' })
  async getGameSessionById(
    @Args('id') id: string,
  ): Promise<GameSessionKqj> {
    return await this.gameSessionService.getGameSessionById(id);
  }

  @Query(() => [GameSessionKqj], { name: 'getAllGameSessions' })
  async getAllGameSessions(): Promise<GameSessionKqj[]> {
    return await this.gameSessionService.getAllGameSessions();
  }
}
