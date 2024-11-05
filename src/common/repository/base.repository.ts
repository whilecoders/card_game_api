import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType('BaseEntity')
@Entity()
export class BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  deletedBy: string;

  @Field(() => Date)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
