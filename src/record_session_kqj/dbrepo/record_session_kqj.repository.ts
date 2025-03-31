import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  GameKqjCards,
  RecordSessionStatus,
  TokenValues,
} from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

registerEnumType(TokenValues, { name: 'TokenValues' });
registerEnumType(RecordSessionStatus, { name: 'RecordSessionStatus' });
@ObjectType('RecordSessionKqj')
@Entity({ name: 'record_session_kqj' })
export class RecordSessionKqj extends BaseEntity {
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

  @Field(() => RecordSessionStatus, {
    nullable: false,
    defaultValue: RecordSessionStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: RecordSessionStatus,
    nullable: false,
    default: RecordSessionStatus.ACTIVE,
  })
  record_status: RecordSessionStatus;

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
    { nullable: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_session' })
  transaction_session: TransactionSession;
}
