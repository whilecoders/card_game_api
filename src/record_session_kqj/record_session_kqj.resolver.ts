import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RecordSessionKqj } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { RecordSessionKqjService } from './record_session_kqj.service';

@Resolver(() => RecordSessionKqj)
export class RecordSessionKqjResolver {
  constructor(private readonly recordSessionKqjService: RecordSessionKqjService) {}

  @Mutation(() => RecordSessionKqj)
  async createRecordSession(
    @Args('createRecordSessionKqjDto') createRecordSessionKqjDto: CreateRecordSessionKqjDto,
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.createRecordSession(createRecordSessionKqjDto);
  }

  @Query(() => RecordSessionKqj, { name: 'getRecordSessionById' })
  async getRecordSessionById(
    @Args('id') id: number,
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.getRecordSessionById(id);
  }

  @Query(() => [RecordSessionKqj], { name: 'getAllRecordSessions' })
  async getAllRecordSessions(): Promise<RecordSessionKqj[]> {
    return await this.recordSessionKqjService.getAllRecordSessions();
  }

    @Query(() => [RecordSessionKqj], { name: 'getRecordsByUserId' })
    async getRecordsByUserId(@Args('userId', { type: () => String }) userId: number) {
      return this.recordSessionKqjService.getRecordsByUserId(userId);
    }
  
    @Query(() => RecordSessionKqj, { name: 'getRecordBySessionId' })
    async getRecordBySessionId(@Args('sessionId', { type: () => String }) sessionId: number) {
      return this.recordSessionKqjService.getRecordBySessionId(sessionId);
    }
  
    @Query(() => [RecordSessionKqj], { name: 'getAllRecordsBySessionId' })
    async getAllRecordsBySessionId(@Args('sessionId', { type: () => String }) sessionId: number) {
      return this.recordSessionKqjService.getAllRecordsBySessionId(sessionId);
    }
}
