import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WalletDto } from './dto/wallet.dto';
import { TransactionService } from './transaction.service';
import { Transaction } from './dbrepo/transaction.repository';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/common/decorator/permission.decorator';
import { PermissionAction } from 'src/common/constants';
import { PermissionGuard } from 'src/permission/permission.guard';

@UseGuards(AuthGuard)
@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionAction.CREATETRANSACTION)
  @Mutation(() => Transaction)
  updateWallet(
    @Args('userId', { type: () => Int! }) userId: number,
    @Args('adminId', { type: () => Int! }) adminId: number,
    @Args('walletData') walletData: WalletDto,
  ) {
    return this.transactionService.updateWallet(userId, adminId, walletData);
  }

  @Query(() => [Transaction])
  async getTransactionsByDate(
    @Args('dateFilter', { type: () => DateFilterDto, nullable: true })
    dateFilter?: DateFilterDto,
  ): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByDate(dateFilter || {});
  }

  @Query(() => [Transaction])
  async getTransactionsByUserId(
    @Args('userId', { type: () => Int, nullable: false })
    userId: number,
  ): Promise<Transaction[]> {
    return this.transactionService.getTrasactionByUserId(userId);
  }
}
