import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameRouletteNumbers, GameSessionStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { GameRoulette } from 'src/game_roulette/dbrepo/game-roulette.repository';
import { RecordSessionRoulette } from 'src/record_session_roulette/dbrepo/record-session-roulette.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameRouletteNumbers, { name: 'GameRouletteNumbers' });

@ObjectType('GameSessionRoulette')
@Entity({
  name: 'game_session_roulette',
})
export class GameSessionRoulette extends BaseEntity {
  @Field(() => GameRoulette, { nullable: false })
  @ManyToOne(
    () => GameRoulette,
    (gameRoulette) => gameRoulette.game_session_roulette,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'game_roulette' })
  game_roulette: GameRoulette;

  @Field(() => GameRouletteNumbers, { nullable: true })
  @Column({ type: 'enum', enum: GameRouletteNumbers, nullable: true })
  game_result_number: GameRouletteNumbers;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', precision: 3, nullable: true })
  session_start_time: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', precision: 3, nullable: true })
  session_end_time: Date;

  @Field(() => GameSessionStatus, { nullable: false })
  @Column({ type: 'enum', enum: GameSessionStatus, nullable: false })
  session_status: GameSessionStatus;

  @Field(() => RecordSessionRoulette, { nullable: true })
  @OneToMany(
    () => RecordSessionRoulette,
    (recordSessionKqj) => recordSessionKqj.game_session_roulette,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'record_session_roulette' })
  record_session_roulette?: RecordSessionRoulette;
}
