import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecordSessionKqj } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { RecordSessionKqjService } from './record_session_kqj.service';
import { RecordStatus } from 'src/common/constants';
import { DailyWinnersAndLosers } from './dto/Daily-Winner-Looser.input';

@Resolver(() => RecordSessionKqj)
export class RecordSessionKqjResolver {
  constructor(
    private readonly recordSessionKqjService: RecordSessionKqjService,
  ) {}

  @Mutation(() => RecordSessionKqj)
  async createRecordSession(
    @Args('createRecordSessionKqjDto')
    createRecordSessionKqjDto: CreateRecordSessionKqjDto,
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.createRecordSession(
      createRecordSessionKqjDto,
    );
  }

  @Mutation(() => RecordSessionKqj)
  async updateUserRecordStatus(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
    @Args('recordStatus', { type: () => RecordStatus })
    recordStatus: RecordStatus,
  ): Promise<RecordSessionKqj> {
    return this.recordSessionKqjService.updateRecordStatus(
      userId,
      gameSessionId,
      recordStatus,
    );
  }

  @Mutation(() => Boolean)
  async markSessionAsCompleted(
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
  ): Promise<boolean> {
    await this.recordSessionKqjService.markSessionAsCompleted(gameSessionId);
    return true;
  }

  @Query(() => RecordSessionKqj, { name: 'getRecordSessionBy' })
  async getRecordSessionById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.getRecordSessionById(id);
  }

  @Query(() => [RecordSessionKqj], { name: 'getAllRecordSessions' })
  async getAllRecordSessions(): Promise<RecordSessionKqj[]> {
    return await this.recordSessionKqjService.getAllRecordSessions();
  }

  @Query(() => [RecordSessionKqj], { name: 'getRecordsBy' })
  async getRecordsByUserId(
    @Args('UserId', { type: () => Int }) userId: number,
  ) {
    return this.recordSessionKqjService.getRecordsByUserId(userId);
  }

  @Query(() => RecordSessionKqj, { name: 'getRecordBy' })
  async getRecordBySessionId(
    @Args('SessionId', { type: () => Int }) sessionId: number,
  ) {
    return this.recordSessionKqjService.getRecordBySessionId(sessionId);
  }

  @Query(() => [RecordSessionKqj], { name: 'getAllRecordsBy' })
  async getAllRecordsBySessionId(
    @Args('SessionId', { type: () => Int }) sessionId: number,
  ) {
    return this.recordSessionKqjService.getAllRecordsBySessionId(sessionId);
  }

  @Query(() => Number)
  async getTotalUsersToday(): Promise<number> {
    return this.recordSessionKqjService.getTotalUsersToday();
  }

  @Query(() => Number)
  async getTotalTokensToday(): Promise<number> {
    return this.recordSessionKqjService.getTotalTokensToday();
  }

  @Query(() => DailyWinnersAndLosers)
  async getDailyWinnersAndLosers(): Promise<DailyWinnersAndLosers> {
    return await this.recordSessionKqjService.getDailyWinnersAndLosers();
  }
}
