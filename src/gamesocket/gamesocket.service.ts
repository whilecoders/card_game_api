import { Injectable } from '@nestjs/common';
import { CreateGamesocketDto } from './dto/create-gamesocket.dto';
import { UpdateGamesocketDto } from './dto/update-gamesocket.dto';

@Injectable()
export class GamesocketService {
  create(createGamesocketDto: CreateGamesocketDto) {
    return 'This action adds a new gamesocket';
  }

  findAll() {
    return `This action returns all gamesocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gamesocket`;
  }

  update(id: number, updateGamesocketDto: UpdateGamesocketDto) {
    return `This action updates a #${id} gamesocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} gamesocket`;
  }
}
