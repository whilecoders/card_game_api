import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {
  TokenValues,
  RecordSessionStatus,
  GameRouletteNumbers,
} from 'src/common/constants';

@InputType()
export class CreateRecordSessionRouletteDto {
  @IsNotEmpty()
  @Field(() => GameRouletteNumbers)
  choosen_number: GameRouletteNumbers;

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
  gameSessionRouletteId: number;
}
