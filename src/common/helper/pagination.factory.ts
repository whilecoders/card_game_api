import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationMetadataDto } from "../model";

export function PaginatedDto<T>(itemType: () => T): any {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedDtoClass extends PaginationMetadataDto {
      @Field(() => [itemType], { nullable: true })
      data: T[];
    }
  
    return PaginatedDtoClass;
  }