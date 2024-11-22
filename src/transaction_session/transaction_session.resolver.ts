import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionSessionService } from './transaction_session.service';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { ProfitAndLoss } from './dto/profite-loss.input';

@Resolver(() => TransactionSession)
export class TransactionSessionResolver {
  constructor(private readonly transactionSessionService: TransactionSessionService) {}

  @Mutation(() => TransactionSession)
  async createTransactionSession(
    @Args('createTransactionSessionDto') createTransactionSessionDto: CreateTransactionSessionDto,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.createTransactionSession(createTransactionSessionDto);
  }

  @Query(() => TransactionSession, { name: 'getTransactionSessionBy' })
  async getTransactionSessionById(
    @Args('id',{ type: () => Int }) id: number,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.getTransactionSessionById(id);
  }

  @Query(() => [TransactionSession], { name: 'getAllTransactionSessions' })
  async getAllTransactionSessions(): Promise<TransactionSession[]> {
    return await this.transactionSessionService.getAllTransactionSessions();
  }

  @Query(() => ProfitAndLoss)
  async getProfitAndLoss(): Promise<ProfitAndLoss> {
    return this.transactionSessionService.getProfitAndLoss();
  }
  
}
