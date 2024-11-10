import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecordSessionKqj } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { RecordSessionKqjService } from './record_session_kqj.service';

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
}
