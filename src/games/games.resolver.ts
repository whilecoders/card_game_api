import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateGamesDto } from './dto/create-game.input';
import { GamesService } from './games.service';
import { Games } from './dbrepo/games.repository';
import { UpdateGamesDto } from './dto/update-game.input';

@Resolver(() => Games)
export class GamesResolver {
  constructor(private readonly GamesService: GamesService) {}

  @Mutation(() => Games)
  async createGames(
    @Args('createGamesDto') createGamesDto: CreateGamesDto,
  ): Promise<Games> {
    return await this.GamesService.createGame(createGamesDto);
  }

  @Mutation(() => Games)
  async updateGames(
    @Args('id') id: number,
    @Args('updateGamesDto') updateGamesDto: UpdateGamesDto,
  ): Promise<Games> {
    return await this.GamesService.updateGame(id, updateGamesDto);
  }

  @Mutation(() => Boolean)
  async DeleteGames(@Args('id') id: number): Promise<boolean> {
    await this.GamesService.deleteGame(id);
    return true;
  }

  @Query(() => [Games], { name: 'getAllGameses' })
  async getAllGameses(): Promise<Games[]> {
    return await this.GamesService.getAllGames();
  }

  @Query(() => Games, { name: 'getGamesById' })
  async getGamesById(@Args('id') id: number): Promise<Games> {
    return await this.GamesService.getGameById(id);
  }

  @Query(() => [Games], { name: 'getGamesByDate' })
  async getGamesByDate(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<Games[]> {
    return await this.GamesService.getGamesByDate(startDate, endDate);
  }
}
