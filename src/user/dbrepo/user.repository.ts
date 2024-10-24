import { Role, UserStatus } from "src/common/enums";
import { Transaction } from "src/transaction/dbrepo/transaction.repository";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 60, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile: string;

  @Column({ unique: true, type: "varchar", length: 60, nullable: false })
  username: string;

  @Column({ unique: true, type: "varchar", length: 225, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 225, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: false })
  role: Role;

  @Column({ type: "bigint", nullable: false, default: 0 })
  wallet: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE, nullable: false })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.admin)
  adminTransactions: Transaction[];
}
