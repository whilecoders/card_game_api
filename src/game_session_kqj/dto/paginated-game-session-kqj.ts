import { ObjectType } from "@nestjs/graphql";
import { PaginatedDto } from "src/common/helper";
import { GameSessionKqj } from "../dbrepo/game_session.repository";



@ObjectType()
export class PaginatedGameSessionKqjDto extends PaginatedDto(() => GameSessionKqj) {}
