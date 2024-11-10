import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { Games } from 'src/games/dbrepo/games.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameKqjCards, { name: 'GameKqjCards' });
registerEnumType(GameSessionStatus, { name: 'GameSessionStatus' });

@ObjectType('GameSession')
@Entity({
  name: 'game_session_kqj',
})
export class GameSessionKqj extends BaseEntity {
  @Field(() => Games,{nullable:false})
  @ManyToOne(() => Games, (game) => game.gameSession, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game' })
  game: Games;

  @Field(() => GameKqjCards,{nullable:true})
  @Column({ type: 'enum', enum: GameKqjCards, nullable: true })
  game_result_card: GameKqjCards;

  @Field(() => Date,{nullable:true})
  @Column({ type: 'timestamp', nullable: true })
  session_start_time: Date;

  @Field(() => Date,{nullable:true})
  @Column({ type: 'timestamp', nullable: true })
  session_end_time: Date;

  @Field(() => GameKqjCards,{nullable:false})
  @Column({ type: 'enum', enum: GameSessionStatus, nullable: false})
  session_status: GameSessionStatus;

  @Field(() => RecordSessionKqj,{nullable:true})
  @OneToMany(
    () => RecordSessionKqj,
    (recordSessionKqj) => recordSessionKqj.game_session_id,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'record_session_kqj' })
  record_session_kqj?: RecordSessionKqj;
}
