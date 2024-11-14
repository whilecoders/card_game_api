import { Resolver } from '@nestjs/graphql';
import { DailyGameService } from './daily_game.service';

@Resolver()
export class DailyGameResolver {
  constructor(private readonly dailyGameService: DailyGameService) {}
}
