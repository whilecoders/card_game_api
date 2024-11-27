import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GameKqjCards, TokenValues, RecordStatus } from 'src/common/constants';

@InputType()
export class CreateRecordSessionKqjDto {
  @Field(() => GameKqjCards)
  choosen_card: GameKqjCards;

  @IsNotEmpty()
  @Field(() => Int)
  userId: number;

  @Field(() => TokenValues)
  token: TokenValues;

  @IsNotEmpty()
  @Field(() => RecordStatus)
  record_status: RecordStatus;

  @IsNotEmpty()
  @Field(() => Int)
  gameSessionId: number;
}
