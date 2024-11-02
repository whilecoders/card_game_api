import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionSessionService } from './transaction_session.service';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { UpdateTransactionSessionDto } from './dto/update-transaction_session.input';

@Resolver(() => TransactionSession)
export class TransactionSessionResolver {
  constructor(private readonly transactionSessionService: TransactionSessionService) {}

  @Mutation(() => TransactionSession)
  async createTransactionSession(
    @Args('createTransactionSessionDto') createTransactionSessionDto: CreateTransactionSessionDto,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.createTransactionSession(createTransactionSessionDto);
  }

  @Mutation(() => TransactionSession)
  async updateTransactionSession(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTransactionSessionDto') updateTransactionSessionDto: UpdateTransactionSessionDto,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.updateTransactionSession(id, updateTransactionSessionDto);
  }

  @Query(() => TransactionSession, { name: 'getTransactionSessionById' })
  async getTransactionSessionById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.getTransactionSessionById(id);
  }

  @Query(() => [TransactionSession], { name: 'getAllTransactionSessions' })
  async getAllTransactionSessions(): Promise<TransactionSession[]> {
    return await this.transactionSessionService.getAllTransactionSessions();
  }
}
