import { InputType, Field } from '@nestjs/graphql';
import { GameKqjCards, TokenValues, RecordSessionStatus } from 'src/common/constants';

@InputType()
export class CreateRecordSessionKqjDto {
  @Field(() => GameKqjCards)
  choosen_card: GameKqjCards;

  @Field(() => String)
  userId: string;

  @Field(() => TokenValues)
  token: TokenValues;

  @Field(() => RecordSessionStatus)
  record_status: RecordSessionStatus;

  @Field(() => String) 
  gameSessionId: string;
}
