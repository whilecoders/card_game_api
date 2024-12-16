import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionSessionService } from './transaction_session.service';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { ProfitAndLoss } from '../dashboard/dto/profite-loss.input';
import { DateFilterDto } from 'src/common/model/date-filter.dto';

@Resolver(() => TransactionSession)
export class TransactionSessionResolver {
  constructor(
    private readonly transactionSessionService: TransactionSessionService,
  ) {}

  @Mutation(() => TransactionSession)
  async createTransactionSession(
    @Args('createTransactionSessionDto')
    createTransactionSessionDto: CreateTransactionSessionDto,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.createTransactionSession(
      createTransactionSessionDto,
    );
  }

  @Query(() => TransactionSession, { name: 'getTransactionSessionBy' })
  async getTransactionSessionById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.getTransactionSessionById(id);
  }

  @Query(() => [TransactionSession], { name: 'getAllTransactionSessions' })
  async getAllTransactionSessions(): Promise<TransactionSession[]> {
    return await this.transactionSessionService.getAllTransactionSessions();
  }

  @Query(() => [TransactionSession])
  async getTransactionsByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<TransactionSession[]> {
    return this.transactionSessionService.getTransactionsByUserId(userId);
  }


  @Query(() => [TransactionSession], { name: 'getTransactionsByDate' })
  async getTransactionsByDate(
    @Args('filter', { type: () => DateFilterDto, nullable: true }) filter?: DateFilterDto,
  ): Promise<TransactionSession[]> {
    return this.transactionSessionService.getTransactionsByDate(filter);
  }
}
