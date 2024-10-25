import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status, TransactionType } from 'src/common/constants/enums';
import { User } from 'src/user/dbrepo/user.repository';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(Status, { name: 'Status' });
registerEnumType(TransactionType, { name: 'TransactionType' });
@ObjectType('Transaction')
@Entity()
export class Transaction {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  amount: number;

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.CREDIT,
    nullable: false,
  })
  type: TransactionType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  admin: User;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  transactionDate: Date;

  @Field(() => Status)
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    nullable: false,
  })
  status: Status;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
