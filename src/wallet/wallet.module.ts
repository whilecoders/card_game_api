import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports:[UserModule,TransactionModule],
  providers: [WalletResolver, WalletService],
})
export class WalletModule {}
