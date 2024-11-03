import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionSession } from './dbrepo/transaction_session.repository';
import { CreateTransactionSessionDto } from './dto/create-transaction_session.input';
import { UpdateTransactionSessionDto } from './dto/update-transaction_session.input';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { TransactionType } from 'src/common/constants';
import { User } from 'src/user/dbrepo/user.repository';

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
    });
    if (!recordSession) {
      throw new NotFoundException(
        `RecordSession with ID ${dto.recordSessionId} not found`,
      );
    }

    if (dto.type === TransactionType.CREDIT) {
      recordSession.user.wallet += dto.token;
    } else if (dto.type === TransactionType.DEBIT) {
      if (recordSession.user.wallet < dto.token) {
        throw new BadRequestException('Insufficient funds');
      }
      recordSession.user.wallet -= dto.token;
    }

    await this.userRepository.save(recordSession.user);

    const transactionSession = this.transactionSessionRepository.create({
      token: dto.token,
      type: dto.type,
      record_session_kqj: recordSession,
    });

    try {
      return await this.transactionSessionRepository.save(transactionSession);
    } catch (error) {
      throw new BadRequestException('Failed to create transaction session');
    }
  }

  async updateTransactionSession(
    id: string,
    dto: UpdateTransactionSessionDto,
  ): Promise<TransactionSession> {
    const transactionSession = await this.transactionSessionRepository.findOne({
      where: { id },
    });
    if (!transactionSession) {
      throw new NotFoundException(`TransactionSession with ID ${id} not found`);
    }

    if (dto.token !== undefined) transactionSession.token = dto.token;
    if (dto.type !== undefined) transactionSession.type = dto.type;

    try {
      return await this.transactionSessionRepository.save(transactionSession);
    } catch (error) {
      throw new BadRequestException('Failed to update transaction session');
    }
  }

  async getTransactionSessionById(id: string): Promise<TransactionSession> {
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
}
