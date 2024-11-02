import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository} from 'typeorm';
import { User } from 'src/user/dbrepo/user.repository';
import { Transaction } from 'src/transaction/dbrepo/transaction.repository';
import { TransactionType } from 'src/common/constants';
import { WalletDto } from './dto/wallet.dto';

@Injectable()
export class TransactionService {

    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
        @Inject('TRANSACTION_REPOSITORY')
        private transactionRepository: Repository<Transaction>,
      ) {}
    
      async updateWallet(userId: string, adminId: string, walletDto: WalletDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
       
        const admin = await this.userRepository.findOne({ where: { id: adminId } });
        if (!admin) throw new NotFoundException('Admin not found');
    
        if (walletDto.type === TransactionType.CREDIT) {
          user.wallet += walletDto.amount;
        } else if (walletDto.type === TransactionType.DEBIT) {
          if (user.wallet < walletDto.amount) {
            throw new BadRequestException('Insufficient funds');
          }
          user.wallet -= walletDto.amount;
        }
    
        await this.userRepository.save(user);
    
        const transaction = this.transactionRepository.create({
          user:{ id: user.id },
          admin:{ id: admin.id },
          amount: walletDto.amount,
          type: walletDto.type,
        });
    
        await this.transactionRepository.save(transaction);
    
        return  transaction ;
      }
}
