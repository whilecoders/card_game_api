import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateRecordSessionKqjDto } from './create-record_session_kqj.input';

@InputType()
export class UpdateRecordSessionKqjDto extends PartialType(CreateRecordSessionKqjDto) {
  @Field(() => String)
  id: string; 
}
