import { Field, ObjectType } from '@nestjs/graphql';
import { TokenValues, TransactionType } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@ObjectType('TransactionSession')
@Entity({ name: 'transaction_session' })
export class TransactionSession extends BaseEntity {
  @Field(() => TokenValues)
  @Column({ type: 'enum', enum: TokenValues, nullable: false })
  token: TokenValues;

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.CREDIT,
    nullable: false,
  })
  type: TransactionType;

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
