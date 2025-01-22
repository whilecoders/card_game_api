import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GameKqjCards } from 'src/common/constants';

@InputType()
export class UpdateGameSessionDto {
  @Field(() => GameKqjCards, { nullable: false })
  @IsNotEmpty({ message: 'game result card must be provided' })
  game_result_card: GameKqjCards;
}
