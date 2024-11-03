import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecordSessionKqj } from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { User } from 'src/user/dbrepo/user.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';

@Injectable()
export class RecordSessionKqjService {
  constructor(
    @Inject('RECORD_SESSION_KQJ_REPOSITORY')
    private readonly recordSessionKqjRepository: Repository<RecordSessionKqj>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('GAME_SESSION_KQJ_REPOSITORY')
    private readonly gameSessionKqjRepository: Repository<GameSessionKqj>,
  ) {}

  async createRecordSession(dto: CreateRecordSessionKqjDto): Promise<RecordSessionKqj> {

    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }
    const gameSession = await this.gameSessionKqjRepository.findOne({ where: { id: dto.gameSessionId } });
    if (!gameSession) {
      throw new NotFoundException(`GameSession with ID ${dto.gameSessionId} not found`);
    }

    const recordSession = this.recordSessionKqjRepository.create({
      choosen_card: dto.choosen_card,
      user,
      token: dto.token,
      record_status: dto.record_status,
      game_session: gameSession,
    });

    try {
      return await this.recordSessionKqjRepository.save(recordSession);
    } catch (error) {
      throw new BadRequestException('Failed to create record session');
    }
  }



  async getRecordSessionById(id: string): Promise<RecordSessionKqj> {
    const recordSession = await this.recordSessionKqjRepository.findOne({ where: { id },relations: ['user','game_session',] });
    if (!recordSession) {
      throw new NotFoundException(`RecordSession with ID ${id} not found`);
    }
    return recordSession;
  }

  async getAllRecordSessions(): Promise<RecordSessionKqj[]> {
    try {
      return await this.recordSessionKqjRepository.find();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve record sessions');
    }
  }

  async getRecordsByUserId(userId: string): Promise<RecordSessionKqj[]> {
    try {
      const records = await this.recordSessionKqjRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!records.length) {
        throw new NotFoundException(`No records found for user ID ${userId}`);
      }
      return records;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve records. Please try again later.');
    }
  }

  async getRecordBySessionId(sessionId: string): Promise<RecordSessionKqj | null> {
    try {
      const record = await this.recordSessionKqjRepository.findOne({
        where: { game_session: { id: sessionId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!record) {
        throw new NotFoundException(`No record found for session ID ${sessionId}`);
      }
      return record;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve record. Please try again later.');
    }
  }

  async getAllRecordsBySessionId(sessionId: string): Promise<RecordSessionKqj[]> {
    try {
      const records = await this.recordSessionKqjRepository.find({
        where: { game_session: { id: sessionId } },
        relations: ['user', 'game_session', 'transaction_session'],
      });

      if (!records.length) {
        throw new NotFoundException(`No records found for session ID ${sessionId}`);
      }
      return records;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve records. Please try again later.');
    }
  }
}
