import { ObjectType } from "@nestjs/graphql";
import { PaginatedDto } from "src/common/helper";
import { Games } from "../dbrepo/games.repository";



@ObjectType()
export class PaginatedGamesDto extends PaginatedDto(() => Games) {}
