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
    @Args('adminId')adminId: string,
  ): Promise<GameLaunch> {
    return await this.gameLaunchService.createGameLauncher(createGameLaunchDto,adminId);
  }

  @Mutation(() => GameLaunch)
  async updateGameLaunch(
    @Args('id') id: string,
    @Args('updateGameLaunchDto') updateGameLaunchDto: UpdateGameLaunchDto,
  ): Promise<GameLaunch> {
    return await this.gameLaunchService.updateGameLauncher(
      id,
      updateGameLaunchDto,
    );
  }

  @Mutation(() => Boolean)
  async softDeleteGameLaunch(
    @Args('id') id: string,
  ): Promise<boolean> {
    await this.gameLaunchService.softDeleteGameLauncher(id);
    return true;
  }

  @Query(() => [GameLaunch], { name: 'getAllGameLaunches' })
  async getAllGameLaunches(): Promise<GameLaunch[]> {
    return await this.gameLaunchService.getAllGameLaunches();
  }

  @Query(() => GameLaunch, { name: 'getGameLaunchById' })
  async getGameLaunchById(
    @Args('id') id: string,
  ): Promise<GameLaunch> {
    return await this.gameLaunchService.getGameLaunchById(id);
  }
}
