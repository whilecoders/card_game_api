import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionAction } from 'src/common/constants';
import { Permissions } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/permission/permission.guard';
import { GameRouletteService } from './game_roulette.service';
import { GameRoulette } from './dbrepo/game-roulette.repository';
import { CreateGameRouletteDto } from './dto/create-game-roulette.dto';
import { UpdateGameRouletteDto } from './dto/update-game-roulette.dto';
import { PaginatedGameRouletteDto } from './dto/paginated-game-roulette.dto';

@UseGuards(AuthGuard)
@Resolver(() => GameRoulette)
export class GameRouletteResolver {
  constructor(private readonly gameRouletteService: GameRouletteService) {}
  
  @Permissions(PermissionAction.CREATEGAME)
  @UseGuards(PermissionGuard)
  @Mutation(() => GameRoulette)
  async createGameRoulette(
    @Args('createGameRouletteDto') createGameRouletteDto: CreateGameRouletteDto,
  ): Promise<GameRoulette> {
    return await this.gameRouletteService.createGameRoulette(
      createGameRouletteDto,
    );
  }

  @Permissions(PermissionAction.UPDATEGAME)
  @Mutation(() => GameRoulette)
  async updateGameRoulette(
    @Args('updateGameRouletteDto')
    updateGamesRouletteDto: UpdateGameRouletteDto,
  ): Promise<GameRoulette> {
    return await this.gameRouletteService.updateGameRoulette(
      updateGamesRouletteDto,
    );
  }

  @Permissions(PermissionAction.DELETEGAME)
  @Mutation(() => Boolean)
  async deleteGameRoulette(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.gameRouletteService.deleteGameRoulette(id);
    return true;
  }

  @Query(() => PaginatedGameRouletteDto, { name: 'getAllGamesRoulette' })
  async getAllGamesRoulette(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ): Promise<PaginatedGameRouletteDto> {
    return await this.gameRouletteService.getAllGamesRoulette(skip, take);
  }

  @Query(() => GameRoulette, { name: 'getGamesBy' })
  async getGameRouletteById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<GameRoulette> {
    return await this.gameRouletteService.getGameRouletteById(id);
  }

  @Query(() => [GameRoulette], { name: 'getGameRouletteByDateOrToday' })
  async getGameRouleteByDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<GameRoulette[]> {
    return this.gameRouletteService.getGameRouleteByDateOrToday(filter);
  }
}
