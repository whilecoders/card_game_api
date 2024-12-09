import { PartialType } from '@nestjs/mapped-types';
import { CreateGamesocketDto } from './create-gamesocket.dto';

export class UpdateGamesocketDto extends PartialType(CreateGamesocketDto) {
  id: number;
}
