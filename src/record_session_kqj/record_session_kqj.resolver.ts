import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import {
  RecordSessionKqj,
  RecordSessionKqjPagination,
} from './dbrepo/record_session_kqj.repository';
import { CreateRecordSessionKqjDto } from './dto/create-record_session_kqj.input';
import { RecordSessionKqjService } from './record_session_kqj.service';
import { RecordStatus } from 'src/common/constants';
import { DateFilterDto } from 'src/common/model/date-filter.dto';
import { PaginationMetadataDto } from 'src/common/model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/graphql';
import { PermissionGuard } from 'src/permission/permission.guard';

@UseGuards(AuthGuard)
@Resolver(() => RecordSessionKqj)
export class RecordSessionKqjResolver {
  constructor(
    private readonly recordSessionKqjService: RecordSessionKqjService,
  ) {}

  // @UseGuards(new RoleGuard([Role.USER, Role.SYSTEM]), PermissionGuard)
  @UseGuards(new RoleGuard([Role.USER, Role.SYSTEM]))
  @Mutation(() => RecordSessionKqj)
  async createRecordSession(
    @Args('createRecordSessionKqjDto')
    createRecordSessionKqjDto: CreateRecordSessionKqjDto, 
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.createRecordSession(
      createRecordSessionKqjDto,
    );
  }

  @Mutation(() => RecordSessionKqj)
  async updateUserRecordStatus(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
    @Args('recordStatus', { type: () => RecordStatus })
    recordStatus: RecordStatus,
  ): Promise<RecordSessionKqj> {
    return this.recordSessionKqjService.updateRecordStatus(
      userId,
      gameSessionId,
      recordStatus,
    );
  }

  @Mutation(() => Boolean)
  async markSessionAsCompleted(
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
  ): Promise<boolean> {
    await this.recordSessionKqjService.markSessionAsCompleted(gameSessionId);
    return true;
  }

  @UseGuards(
    new RoleGuard([Role.ADMIN, Role.SYSTEM, Role.SUPERADMIN, Role.MASTER]),
    PermissionGuard,
  )
  @Mutation(() => Boolean)
  async removeUserFromGame(
    @Args('deleteBy', { type: () => Int }) deleteBy: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
  ): Promise<boolean> {
    await this.recordSessionKqjService.removeFromGame(
      userId,
      gameSessionId,
      deleteBy,
    );
    return true;
  }

  @UseGuards(
    new RoleGuard([Role.ADMIN, Role.SYSTEM, Role.SUPERADMIN, Role.MASTER]),
    PermissionGuard,
  )
  @Mutation(() => Boolean)
  async removeSessionFromGame(
    @Args('deleteBy', { type: () => Int }) deleteBy: number,
    @Args('gameSessionId', { type: () => Int }) gameSessionId: number,
  ): Promise<boolean> {
    await this.recordSessionKqjService.removeSessionFromGame(
      gameSessionId,
      deleteBy,
    );
    return true;
  }

  @Query(() => RecordSessionKqj, { name: 'getRecordSessionBy' })
  async getRecordSessionById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<RecordSessionKqj> {
    return await this.recordSessionKqjService.getRecordSessionById(id);
  }

  @Query(() => [RecordSessionKqj], { name: 'getAllRecordSessions' })
  async getAllRecordSessions(): Promise<RecordSessionKqj[]> {
    return await this.recordSessionKqjService.getAllRecordSessions();
  }

  @Query(() => [RecordSessionKqj], { name: 'getRecordsBy' })
  async getRecordsByUserId(
    @Args('UserId', { type: () => Int }) userId: number,
  ) {
    return this.recordSessionKqjService.getRecordsByUserId(userId);
  }

  @Query(() => RecordSessionKqjPagination, { name: 'searchRecords' })
  async searchRecords(
    @Args('sessionId', { type: () => Int }) sessionId: number,
    @Args('searchTerm', { type: () => String }) searchTerm: string,
    @Args('offset', { type: () => PaginationMetadataDto })
    offset: PaginationMetadataDto,
  ): Promise<RecordSessionKqjPagination> {
    return await this.recordSessionKqjService.searchRecords(
      sessionId,
      searchTerm,
      offset,
    );
  }

  @Query(() => RecordSessionKqjPagination, { name: 'getAllRecordsBySessionId' })
  async getAllRecordsBySessionId(
    @Args('sessionId', { type: () => Int, nullable: false }) sessionId: number,
    @Args('offset', { type: () => PaginationMetadataDto, nullable: false })
    offset: PaginationMetadataDto,
  ) {
    return this.recordSessionKqjService.getAllRecordsBySessionId(
      sessionId,
      offset,
    );
  }

  @Query(() => [RecordSessionKqj], { name: 'getRecordsByDate' })
  async getRecordsByDate(
    @Args('filter', { type: () => DateFilterDto, nullable: true })
    filter?: DateFilterDto,
  ): Promise<RecordSessionKqj[]> {
    return this.recordSessionKqjService.getRecordsByDate(filter);
  }
}
