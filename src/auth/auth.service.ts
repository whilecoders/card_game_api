import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from 'src/common/helper/jwt.service';
import { User } from 'src/user/dbrepo/user.repository';
import { Repository } from 'typeorm';
import { SignUpCredential } from './dto/signup.input';
import { PasswordHashService } from 'src/common/helper/password.service';
import { SignInCredential } from './dto/signin.input';
import { UserTokenType } from './entities/signin.entity';
import { TokenType } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private jwtService: JWTService,
  ) { }
  async SignUp(signUpCredential: SignUpCredential) {
    const { username, email, password, role } = signUpCredential;
    const hashedPassword = await PasswordHashService.hashPassword(password);

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }

    return user;
  }

  async SignIn(signInCredential: SignInCredential) {
    const { username, password } = signInCredential;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await PasswordHashService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const access_token = await this.jwtService.generateAccessToken(user.id);
    const refresh_token = await this.jwtService.generateRefreshToken(user.id);
    const data: UserTokenType = {
      user: user,
      access_token: access_token,
      refresh_token: refresh_token,
    };
    return data;
  }

  async refreshToken(refreshToken: string, token: string): Promise<TokenType> {
    const tokenData = await this.jwtService.decodeToken(token);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid access token');
    }

    const validRefreshToken =
      await this.jwtService.verifyRefreshToken(refreshToken);
    if (!validRefreshToken) {
      throw new UnauthorizedException(
        'Refresh token expired or invalid. Please login again.',
      );
    }

    const expiryDate = new Date(0).setUTCSeconds(tokenData.exp);
    if (expiryDate > Date.now()) {
      const tokens: TokenType = {
        refresh_token: refreshToken,
        access_token: token,
      };
      console.log("old token -> ", tokens);
      return tokens;
    }

    const user = await this.userRepository.findOne({
      where: { id: validRefreshToken.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found. Please login again.');
    }

    const newAccessToken = await this.jwtService.generateAccessToken(user.id);
    console.log("new token -> ", newAccessToken);


    const tokens: TokenType = {
      access_token: newAccessToken,
      refresh_token: refreshToken,
    };

    return tokens;
  }
}
