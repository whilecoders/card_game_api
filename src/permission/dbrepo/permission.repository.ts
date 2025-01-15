import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/repository/base.repository';
import { Role } from 'src/common/constants/enums';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, ManyToOne } from 'typeorm';

@ObjectType('Permission')
@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
  @Field(() => String, { nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false })
  action: string;

  @Field(() => Role, { nullable: true })
  @Column({ type: 'enum', enum: Role, nullable: true })
  role: Role | null;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.permissions, { nullable: true })
  user: User | null;

  @Field(() => Boolean, { nullable: false })
  @Column({ type: 'boolean', nullable: false })
  allowed: boolean;
}
