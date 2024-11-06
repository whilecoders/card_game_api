import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { WalletDto } from './dto/wallet.dto';
import { TransactionService } from './transaction.service';
import { Transaction } from './dbrepo/transaction.repository';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private transaction:TransactionService
  ){}  
  @Mutation(() => Transaction)
  updateWallet(
    @Args('userId') userId: number,
    @Args('adminId') adminId: number,
    @Args('walletData') walletData: WalletDto
  ) {
    return this.transaction.updateWallet(userId, adminId, walletData);
  }
}
