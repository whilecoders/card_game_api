import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/dbrepo/user.repository';
import { SignUpCredential } from './dto/signup.input';
import { UserTokenType } from './entities/signin.entity';
import { SignInCredential } from './dto/signin.input';
import { TokenType } from './entities/token.entity';
import { ResetPasswordDto } from './dto/reset_password.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(@Args('signUpCredential') signUpCredential: SignUpCredential) {
    return this.authService.SignUpAdmin(signUpCredential);
  }

  @Query(() => UserTokenType)
  async signIn(@Args('signInCredential') signInCredential: SignInCredential) {
    return this.authService.SignIn(signInCredential);
  }

  @Mutation(() => TokenType)
  async refreshAccessToken(
    @Args('refreshToken') refreshToken: string,
    @Args('token') token: string,
  ) {
    if (!refreshToken || !token) {
      throw new UnauthorizedException('Refresh token and token are required');
    }

    return this.authService.refreshToken(refreshToken, token);
  }
  @Mutation(() => String)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
