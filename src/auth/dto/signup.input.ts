import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/constants/enums';

@InputType()
export class SignUpCredential {
  @Field()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  @MinLength(6, { message: 'Username must be at least 8 characters long' })
  @MaxLength(30, { message: 'Username cannot be longer than 30 characters' })
  username: string;

  @Field()
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

  @Field(() => String)
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail()
  email: string;

  @Field(() => Role)
  @IsNotEmpty()
  role: Role;
}
