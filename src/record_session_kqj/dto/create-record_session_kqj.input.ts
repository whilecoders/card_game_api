import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {
  GameKqjCards,
  TokenValues,
  RecordSessionStatus,
} from 'src/common/constants';

@InputType()
export class CreateRecordSessionKqjDto {
  @IsNotEmpty()
  @Field(() => GameKqjCards)
  choosen_card: GameKqjCards;

  @IsNotEmpty()
  @Field(() => Int)
  userId: number;

  @IsNotEmpty()
  @Field(() => TokenValues)
  token: TokenValues;

  @IsNotEmpty()
  @Field(() => RecordSessionStatus)
  record_status: RecordSessionStatus;

  @IsNotEmpty()
  @Field(() => Int)
  gameSessionId: number;
}
