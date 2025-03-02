import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class SignInCredential {
  @Field(() => String)
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot be longer than 30 characters' })
  username: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password cannot be longer than 30 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
