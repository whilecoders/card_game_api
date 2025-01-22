import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameStatus, GameType } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { DailyGameRoulette } from 'src/daily_game_roulette/dbrepo/daily-game-roulette.repository';
import { GameSessionRoulette } from 'src/game_session_roulette/dbrepo/game-session-roulette.repository';
import { User } from 'src/user/dbrepo/user.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameStatus, { name: 'GameStatus' });
registerEnumType(GameType, { name: 'GameType' });
@ObjectType('GameRoulette')
@Entity({ name: 'game_roulette' })
export class GameRoulette extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.game_roulete, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin' })
  admin: User;

  @Field(() => GameType)
  @Column({ type: 'enum', enum: GameType, nullable: false })
  game_type: GameType;

  @Field(() => String)
  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Field(() => String)
  @Column({ type: 'time', nullable: false })
  end_time: string;

  @Field(() => Date)
  @Column({ type: 'datetime', nullable: false })
  start_date: Date;

  @Field(() => Date)
  @Column({ type: 'datetime', nullable: false })
  end_date: Date;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: false })
  game_duration: number;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: false })
  game_in_day: number;

  @Field(() => GameStatus)
  @Column({ type: 'enum', enum: GameStatus, nullable: false })
  game_status: GameStatus;

  @Field(() => [GameSessionRoulette], { nullable: true })
  @OneToMany(
    () => GameSessionRoulette,
    (gameSessionRoulette) => gameSessionRoulette.game_roulette,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'game_session_roulette' })
  game_session_roulette?: GameSessionRoulette[];

  @Field(() => [DailyGameRoulette], { nullable: true })
  @OneToMany(
    () => DailyGameRoulette,
    (dailyGameRoulette) => dailyGameRoulette.game_roulette,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'daily_game_roulete' })
  daily_game_roulette?: DailyGameRoulette[];
}
