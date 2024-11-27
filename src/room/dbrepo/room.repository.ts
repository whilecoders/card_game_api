import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameKqjCards, RecordStatus, TokenValues } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { Message } from 'src/message/dbrepo/message.repository';
import { TransactionSession } from 'src/transaction_session/dbrepo/transaction_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

registerEnumType(TokenValues, { name: 'TokenValues' });
registerEnumType(RecordStatus, { name: 'RecordSessionStatus' });

@ObjectType('Room')
@Entity({ name: 'room' })
export class Room extends BaseEntity {

  @OneToOne(() => Message, (message) => message.latestMessage)
  @Field(() => Message)
  @JoinColumn({ name: "latestMessage" })
  latestMessage: Message;

  @OneToMany(() => Message, (message) => message.room)
  @Field(() => [Message])
  @JoinColumn({ name: "room" })
  messages: Message[]

  @OneToMany(()=> User, (user) => user.roomMember) 
  @Field(() => [User])
  @JoinColumn({name: "member"})
  members: User[]

}
