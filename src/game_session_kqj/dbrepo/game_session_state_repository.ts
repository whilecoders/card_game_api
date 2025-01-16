import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GameKqjCards, GameSessionStatus } from 'src/common/constants';
import { BaseEntity } from 'src/common/repository/base.repository';
import { Games } from 'src/games/dbrepo/games.repository';
import { RecordSessionKqj } from 'src/record_session_kqj/dbrepo/record_session_kqj.repository';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

registerEnumType(GameKqjCards, { name: 'GameKqjCards' });
registerEnumType(GameSessionStatus, { name: 'GameSessionStatus' });

@ObjectType('GameSessionKqjStats')
// @Entity({
//   name: 'game_session_kqj',
// })
export class GameSessionKqjStats {
    @Field(() => Int)
    totalGamePlayed: number;

    @Field(() => Int)
    totalWins: number;

    @Field(() => Int)
    totalLosses: number;
}
