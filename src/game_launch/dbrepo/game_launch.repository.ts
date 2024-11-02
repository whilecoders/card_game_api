import { Field, GraphQLISODateTime, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Game, GameLaunchStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameSessionKqj } from 'src/game_session_kqj/dbrepo/game_session.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameLaunchStatus, { name: 'GameLaunchStatus' });
registerEnumType(Game, { name: 'Game' });
@ObjectType('GameLaunch')
@Entity({ name: 'game_launch' })
export class GameLaunch extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createGames, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  admin: User;

  @Field(() => Game)
  @Column({ type: 'enum', enum: Game, nullable: false })
  game: Game;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true})
  start_time: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true})
  end_time: Date;

  @Field(() => String)
  @Column({ type: 'time', nullable: false })
  game_duration: string;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: false })
  game_in_day: number;

  @Field(() => GameLaunchStatus)
  @Column({ type: 'enum', enum: GameLaunchStatus, nullable: false })
  game_launch_status: GameLaunchStatus;

  @Field(() => [GameSessionKqj], { nullable: true })
  @OneToMany(() => GameSessionKqj, (gameSession) => gameSession.game_launch, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  gameSession?: GameSessionKqj[];
}
