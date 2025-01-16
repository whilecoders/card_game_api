import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionSessionService } from './transaction_session.service';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/graphql';
import { PermissionGuard } from 'src/permission/permission.guard';
import { PermissionAction } from 'src/common/constants';
import { Permissions } from 'src/common/decorator/permission.decorator';

@UseGuards(AuthGuard)
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

  @Query(() => TransactionSession, { name: 'getTransactionSessionById' })
  async getTransactionSessionById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TransactionSession> {
    return await this.transactionSessionService.getTransactionSessionById(id);
  }

  @Query(() => [TransactionSession], { name: 'getAllTransactionSessions' })
  async getAllTransactionSessions(): Promise<TransactionSession[]> {
    return await this.transactionSessionService.getAllTransactionSessions();
  }

  @UseGuards(PermissionGuard)
  @Permissions(PermissionAction.GETGAMERESULTBYID)
  @Query(() => [TransactionSession])
  async getGameResultByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<TransactionSession[]> {
    return this.transactionSessionService.getTransactionsByUserId(userId);
  }

  @Query(() => [TransactionSession], { name: 'getTransactionsByDate' })
  async getTransactionsByDate(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<TransactionSession[]> {
    return this.transactionSessionService.getTransactionsByDate(filter);
  }
}
