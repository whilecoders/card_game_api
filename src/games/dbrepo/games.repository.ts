import { Field, GraphQLISODateTime, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameStatus, GameType } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameStatus, { name: 'GameStatus' });
registerEnumType(GameType, { name: 'GameType' });
@ObjectType('Games')
@Entity({ name: 'games' })
export class Games extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdGames, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin' })
  admin: User;

  @Field(() => GameType)
  @Column({ type: 'enum', enum: GameType, nullable: false })
  game_type: GameType;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true})
  start_time: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true})
  end_time: Date;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: false })
  game_duration: number;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: false })
  game_in_day: number;

  @Field(() => GameStatus)
  @Column({ type: 'enum', enum: GameStatus, nullable: false })
  game_status: GameStatus;

  @Field(() => [GameSessionKqj], { nullable: true })
  @OneToMany(() => GameSessionKqj, (gameSession) => gameSession.game, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gameSession' })
  gameSession?: GameSessionKqj[];
}
