import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TokenValues, TransactionType, UserGameResultStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

registerEnumType(UserGameResultStatus, { name: 'UserGameResultStatus'  })

@ObjectType('TransactionSession')
@Entity({ name: 'transaction_session' })
export class TransactionSession extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  token: number;

  @Field(() => UserGameResultStatus)
  @Column({
    type: 'enum',
    enum: UserGameResultStatus,
    nullable: false,
  })
  game_status: UserGameResultStatus;

  @Field(() => RecordSessionKqj)
  @OneToOne(
    () => RecordSessionKqj,
    (recordSessionKqj) => recordSessionKqj.transaction_session,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'record_session_kqj' })
  record_session_kqj: RecordSessionKqj;
}
