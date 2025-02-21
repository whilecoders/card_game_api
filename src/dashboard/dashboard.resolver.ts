import { Args, Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';
import { ProfitAndLoss } from './dto/profite-loss.input';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
@UseGuards(AuthGuard)
@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Number)
  async getTotalSessionsDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<number> {
    return this.dashboardService.getTotalSessionsDateOrToday(filter);
  }

  @Query(() => Number)
  async getFinishedSessionsByDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<number> {
    return this.dashboardService.getFinishedSessionsByDateOrToday(filter);
  }

  @Query(() => Number)
  async getTotalUsersByDateOrToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<number> {
    return this.dashboardService.getTotalUsersByDateOrToday(filter);
  }

  @Query(() => Number)
  async getTotalTokensToday(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<number> {
    return this.dashboardService.getTotalTokensByDateOrToday(filter);
  }

  @Query(() => DailyWinnersAndLosers)
  async getDailyWinnersAndLosers(): Promise<DailyWinnersAndLosers> {
    return await this.dashboardService.getDailyWinnersAndLosers();
  }

  @Query(() => ProfitAndLoss)
  async getProfitAndLoss(
    @Args('date', { type: () => Date, nullable: true })
    date?: Date,
  ): Promise<ProfitAndLoss> {
    return this.dashboardService.getProfitAndLoss(date);
  }

  @Query(() => [GameSessionKqj])
  async getUpcomingSessions(): Promise<GameSessionKqj[]> {
    return await this.dashboardService.getUpcomingSessions();
  }

  @Query(() => [GameSessionKqj])
  async getCurrentRunningSessions(): Promise<GameSessionKqj[]> {
    return await this.dashboardService.getLiveSessions();
  }
}
