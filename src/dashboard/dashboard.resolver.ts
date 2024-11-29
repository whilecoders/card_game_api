import { Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';
import { ProfitAndLoss } from './dto/profite-loss.input';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Number)
  async getTotalSessionsToday(): Promise<number> {
    return this.dashboardService.getTotalSessionsToday();
  }

  @Query(() => Number)
  async getFinishedSessionsToday(): Promise<number> {
    return this.dashboardService.getFinishedSessionsToday();
  }

  @Query(() => Number)
  async getTotalUsersToday(): Promise<number> {
    return this.dashboardService.getTotalUsersToday();
  }

  @Query(() => Number)
  async getTotalTokensToday(): Promise<number> {
    return this.dashboardService.getTotalTokensToday();
  }

  @Query(() => DailyWinnersAndLosers)
  async getDailyWinnersAndLosers(): Promise<DailyWinnersAndLosers> {
    return await this.dashboardService.getDailyWinnersAndLosers();
  }

  @Query(() => ProfitAndLoss)
  async getProfitAndLoss(): Promise<ProfitAndLoss> {
    return this.dashboardService.getProfitAndLoss();
  }
}
