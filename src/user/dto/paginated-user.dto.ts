import { ObjectType } from "@nestjs/graphql";
import { PaginatedDto } from "src/common/helper";
import { User } from "src/user/dbrepo/user.repository";


@ObjectType()
export class PaginatedUserDto extends PaginatedDto(() => User) {}
