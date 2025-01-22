import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameResultStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { RecordSessionRoulette } from 'src/record_session_roulette/dbrepo/record-session-roulette.repository';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

registerEnumType(GameResultStatus, { name: 'UserGameResultStatus' });

@ObjectType('GameResultRoulette')
@Entity({ name: 'game_result_roulette' })
export class GameResultRoulette extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  token: number;

  @Field(() => GameResultStatus)
  @Column({
    type: 'enum',
    enum: GameResultStatus,
    nullable: false,
  })
  game_status: GameResultStatus;

  @Field(() => RecordSessionRoulette)
  @OneToOne(
    () => RecordSessionRoulette,
    (recordSessionRoulette) => recordSessionRoulette.game_result_roulette,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'record_session_roulette' })
  record_session_roulette: RecordSessionRoulette;
}
