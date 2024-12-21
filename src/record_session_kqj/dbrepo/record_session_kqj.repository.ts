import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameKqjCards, RecordStatus, TokenValues } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

registerEnumType(TokenValues, { name: 'TokenValues' });
registerEnumType(RecordStatus, { name: 'RecordSessionStatus' });
@ObjectType('RecordSessionKqj')
@Entity({ name: 'record_session_kqj' })
export class RecordSessionKqj extends BaseEntity {
  length: any;
  forEach(arg: (record: any) => void) {
    throw new Error('Method not implemented.');
  }
  @Field(() => GameKqjCards, { nullable: false })
  @Column({ type: 'enum', enum: GameKqjCards, nullable: false })
  choosen_card: GameKqjCards;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.record_session_kqj, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => TokenValues, { nullable: false })
  @Column({ type: 'enum', enum: TokenValues, nullable: false })
  token: TokenValues;

  @Field(() => RecordStatus, {
    nullable: false,
    defaultValue: RecordStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: RecordStatus,
    nullable: false,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Field(() => GameSessionKqj, { nullable: false })
  @ManyToOne(
    () => GameSessionKqj,
    (gameSessionKqj) => gameSessionKqj.record_session_kqj,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'game_session_id' })
  game_session_id: GameSessionKqj;

  @Field(() => TransactionSession, { nullable: true })
  @OneToOne(
    () => TransactionSession,
    (transactionSession) => transactionSession.record_session_kqj,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'transaction_session' })
  @OneToOne(() => TransactionSession, (trans) => trans.record_session_kqj)
  @Field(() => TransactionSession)
  transaction_session: TransactionSession;
}


@ObjectType()
export class RecordSessionKqjPagination {
  @Field(() => [RecordSessionKqj], { nullable: false })
  data: RecordSessionKqj[]

  @Field(() => Int, { nullable: false })
  totalSize: number
}