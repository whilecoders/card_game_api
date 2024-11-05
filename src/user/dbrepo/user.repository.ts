import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, UserStatus } from 'src/common/constants/enums';
import { BaseEntity } from 'src/common/repository/base.repository';
import { Games } from 'src/games/dbrepo/games.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Transaction } from 'src/transaction/dbrepo/transaction.repository';
import { Column, Entity, OneToMany } from 'typeorm';

registerEnumType(Role, { name: 'Role' });
registerEnumType(UserStatus, { name: 'UserStatus' });
@ObjectType('User')
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
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

  @Field(() => Transaction)
  @OneToMany(
    () => Transaction,
    (transaction) => transaction.user && transaction.admin,
  )
  userTransactions: Transaction[];

  @Field(() => Games)
  @OneToMany(() => Games, (game) => game.admin)
  createdGames: Games[];

  @Field(() => RecordSessionKqj)
  @OneToMany(
    () => RecordSessionKqj,
    (recordSessionKqj) => recordSessionKqj.user,
  )
  record_session_kqj: RecordSessionKqj[];
}
