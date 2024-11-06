import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GameKqjCards, TokenValues, RecordStatus } from 'src/common/constants';

@InputType()
export class CreateRecordSessionKqjDto {
  @Field(() => GameKqjCards)
  choosen_card: GameKqjCards;

  @IsNotEmpty()
  @Field(() => Number)
  userId: number;

  @Field(() => TokenValues)
  token: TokenValues;

  @IsNotEmpty()
  @Field(() => RecordStatus)
  record_status: RecordStatus;

  @IsNotEmpty()
  @Field(() => Number)
  gameSessionId: number;
}
