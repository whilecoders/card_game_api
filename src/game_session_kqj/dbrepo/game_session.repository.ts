import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameLaunch } from 'src/game_launch/dbrepo/game_launch.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameKqjCards, { name: 'GameKqjCards' });
registerEnumType(GameSessionStatus, { name: 'GameSessionStatus' });

@ObjectType('GameSession')
@Entity({
  name: 'game_session_kqj',
})
export class GameSessionKqj extends BaseEntity {
  @Field(() => GameLaunch)
  @ManyToOne(() => GameLaunch, (gameLaunch) => gameLaunch.gameSession, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_launch_id' })
  game_launch: GameLaunch;

  @Field(() => GameKqjCards)
  @Column({ type: 'enum', enum: GameKqjCards, nullable: true })
  game_result_card: GameKqjCards;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  session_start_time: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  session_end_time: Date;

  @Field(() => GameKqjCards)
  @Column({ type: 'enum', enum: GameSessionStatus, nullable: true })
  session_status: GameSessionStatus;

  @Field(() => RecordSessionKqj)
  @OneToMany(
    () => RecordSessionKqj,
    (recordSessionKqj) => recordSessionKqj.game_session,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  record_session_kqj?: RecordSessionKqj;
}
