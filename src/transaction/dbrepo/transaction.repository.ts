import { Role, TransactionType, UserStatus } from "src/common/enums";
import { User } from "src/user/dbrepo/user.repository";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0, nullable: false })
    amount: number;

    @Column({ type: 'enum', enum: TransactionType, default: TransactionType.CREDIT, nullable: false })
    type: TransactionType;

    @ManyToOne(() => User, (user) => user.transactions, { nullable: false, onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => User, (user) => user.transactions, { nullable: false, onDelete: "CASCADE" })
    admin: User;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    transactionDate: Date;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE, nullable: false })
    status: UserStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
