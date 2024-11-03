import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GameLaunchService } from './game_launch.service';
import { GameLaunch } from './dbrepo/game_launch.repository';
import { CreateGameLaunchDto } from './dto/create-game_launch.input';
import { UpdateGameLaunchDto } from './dto/update-game_launch.input';

@Resolver(() => GameLaunch)
export class GameLaunchResolver {
  constructor(private readonly gameLaunchService: GameLaunchService) {}

  @Mutation(() => GameLaunch)
  async createGameLaunch(
    @Args('createGameLaunchDto') createGameLaunchDto: CreateGameLaunchDto,
    @Args('adminId') adminId: string,
  ): Promise<GameLaunch> {
    return await this.gameLaunchService.createGameLauncher(
      createGameLaunchDto,
      adminId,
    );
  }

  @Mutation(() => GameLaunch)
  async updateGameLaunch(
    @Args('id') id: string,
    @Args('updateGameLaunchDto') updateGameLaunchDto: UpdateGameLaunchDto,
  ): Promise<GameLaunch> {
    return await this.gameLaunchService.updateGameLaunch(
      id,
      updateGameLaunchDto,
    );
  }

  @Mutation(() => Boolean)
  async DeleteGameLaunch(@Args('id') id: string): Promise<boolean> {
    await this.gameLaunchService.deleteGameLauncher(id);
    return true;
  }

  @Mutation(() => Boolean)
  async undeleteGameLaunch(@Args('id') id: string): Promise<boolean> {
    await this.gameLaunchService.undeleteGameLaunch(id);
    return true;
  }

  @Query(() => [GameLaunch], { name: 'getAllGameLaunches' })
  async getAllGameLaunches(): Promise<GameLaunch[]> {
    return await this.gameLaunchService.getAllGameLaunches();
  }

  @Query(() => GameLaunch, { name: 'getGameLaunchById' })
  async getGameLaunchById(@Args('id') id: string): Promise<GameLaunch> {
    return await this.gameLaunchService.getGameLaunchById(id);
  }

  @Query(() => [GameLaunch], { name: 'getGameLaunchByDate' })
  async getGameLaunchByDate(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<GameLaunch[]> {
    return await this.gameLaunchService.getGameLaunchByDate(startDate, endDate);
  }
  
}
