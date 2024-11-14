import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateGamesDto } from './dto/create-game.input';
import { GamesService } from './games.service';
import { Games } from './dbrepo/games.repository';
import { UpdateGamesDto } from './dto/update-game.input';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';

@Resolver(() => Games)
export class GamesResolver {
  constructor(private readonly GamesService: GamesService) {}

  @Mutation(() =>Games)
  async createGames(
    @Args('createGamesDto') createGamesDto: CreateGamesDto,
  ): Promise<Games> {
    return await this.GamesService.createGame(createGamesDto);
  }
  @Mutation(() => [Games])
  async createGameSession(): Promise<GameSessionKqj[]> {
    return await this.GamesService.createGameSessions();
  }

  @Mutation(() => Games)
  async updateGames(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateGamesDto') updateGamesDto: UpdateGamesDto,
  ): Promise<Games> {
    return await this.GamesService.updateGame(id, updateGamesDto);
  }

  @Mutation(() => Boolean)
  async DeleteGames(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.GamesService.deleteGame(id);
    return true;
  }

  @Query(() => [Games], { name: 'getAllGameses' })
  async getAllGameses(): Promise<Games[]> {
    return await this.GamesService.getAllGames();
  }

  @Query(() => Games, { name: 'getGamesBy' })
  async getGamesById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Games> {
    return await this.GamesService.getGameById(id);
  }

  @Query(() => [Games], { name: 'getGamesByDate' })
  async getGamesByDate(
    @Args({ name: 'from', type: () => Date }) from: Date,
    @Args({ name: 'to', type: () => Date }) to: Date,
  ): Promise<Games[]> {
    return await this.GamesService.getGamesByDate(from, to);
  }
}
