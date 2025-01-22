import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/repository/base.repository';
import { Message } from 'src/message/dbrepo/message.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@ObjectType('Room')
@Entity({ name: 'room' })
export class Room extends BaseEntity {
  @OneToOne(() => Message, (message) => message.latestMessage)
  @Field(() => Message)
  @JoinColumn({ name: 'latestMessage' })
  latestMessage: Message;

  @OneToMany(() => Message, (message) => message.room)
  @Field(() => [Message])
  @JoinColumn({ name: 'room' })
  messages: Message[];

  @OneToMany(() => User, (user) => user.roomMember)
  @Field(() => [User])
  @JoinColumn({ name: 'member' })
  members: User[];
}
