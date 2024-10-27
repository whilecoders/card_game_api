import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, UserStatus } from 'src/common/constants/enums';
import { Transaction } from 'src/transaction/dbrepo/transaction.repository';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(Role, { name: 'Role' });
registerEnumType(UserStatus, { name: 'UserStatus' });
@ObjectType('User')
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255, nullable: true })
  profile: string;

  @Field(() => String)
  @Column({ unique: true, type: 'varchar', length: 60, nullable: false })
  username: string;

  @Field(() => String)
  @Column({ unique: true, type: 'varchar', length: 225, nullable: false })
  email: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 225, nullable: false })
  password: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: false })
  role: Role;

  @Field(() => Number)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wallet: number;
  
  @Field(() => UserStatus)
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    nullable: false,
  })
  status: UserStatus;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Field(() => Transaction)
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @Field(() => Transaction)
  @OneToMany(() => Transaction, (transaction) => transaction.admin)
  adminTransactions: Transaction[];
}
