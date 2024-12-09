import { Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';
import { ProfitAndLoss } from './dto/profite-loss.input';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';

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

  // upcomming session
  // current running session


  
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

  @Query(() => [GameSessionKqj])
  async getUpcomingSessions(): Promise<GameSessionKqj[]> {
    return await this.dashboardService.getUpcomingSessions();
  }

  @Query(() => [GameSessionKqj])
  async getCurrentRunningSessions(): Promise<GameSessionKqj[]> {
    return await this.dashboardService.getLiveSessions();
  }
  
}
