import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { TransactionType } from 'src/common/constants';
import { User } from 'src/user/dbrepo/user.repository';
import { ProfitAndLoss } from '../dashboard/dto/profite-loss.input';

@Injectable()
export class TransactionSessionService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('TRANSACTION_SESSION_REPOSITORY')
    private readonly transactionSessionRepository: Repository<TransactionSession>,
    @Inject('RECORD_SESSION_KQJ_REPOSITORY')
    private readonly recordSessionRepository: Repository<RecordSessionKqj>,
  ) {}

  async createTransactionSession(
    dto: CreateTransactionSessionDto,
  ): Promise<TransactionSession> {
    const recordSession = await this.recordSessionRepository.findOne({
      where: { id: dto.recordSessionId },
      relations: ['user', 'game_session', 'transaction_session'],
    });
    if (!recordSession) {
      throw new NotFoundException(
        `RecordSession with ID ${dto.recordSessionId} not found`,
      );
    }

    if (!recordSession.user) {
      throw new BadRequestException(
        'Associated user not found in record session.',
      );
    }

    if (dto.type === TransactionType.CREDIT) {
      recordSession.user.wallet += dto.token;
    } else if (dto.type === TransactionType.DEBIT) {
      if (recordSession.user.wallet < dto.token) {
        throw new BadRequestException(
          'Insufficient funds for this transaction.',
        );
      }
      recordSession.user.wallet -= dto.token;
    }

    try {
      await this.userRepository.save(recordSession.user);
    } catch (error) {
      console.error('Error updating user wallet:', error);
      throw new InternalServerErrorException(
        'Failed to update user wallet. Please try again.',
      );
    }

    const transactionSession = this.transactionSessionRepository.create({
      token: dto.token,
      type: dto.type || TransactionType.CREDIT,
      record_session_kqj: recordSession,
    });

    try {
      return await this.transactionSessionRepository.save(transactionSession);
    } catch (error) {
      console.error('Error saving transaction session:', error);
      throw new InternalServerErrorException(
        'Failed to create transaction session.',
      );
    }
  }

  async getTransactionSessionById(id: number): Promise<TransactionSession> {
    const transactionSession = await this.transactionSessionRepository.findOne({
      where: { id },
      relations: ['record_session_kqj'],
    });
    if (!transactionSession) {
      throw new NotFoundException(`TransactionSession with ID ${id} not found`);
    }
    return transactionSession;
  }

  async getAllTransactionSessions(): Promise<TransactionSession[]> {
    try {
      return await this.transactionSessionRepository.find({
        relations: ['record_session_kqj'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve transaction sessions');
    }
  }

  async getTransactionsByUserId(userId: number): Promise<TransactionSession[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      return await this.transactionSessionRepository.find({
        relations: ['record_session_kqj', 'record_session_kqj.user'],
        where: { record_session_kqj: { user: { id: userId } } },
      });
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw new InternalServerErrorException(
        'Failed to fetch transactions for the specified user.',
      );
    }
  }
}
