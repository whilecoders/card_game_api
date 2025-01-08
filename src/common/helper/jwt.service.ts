import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvKeyConstants, Role } from '../constants/index';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  // Generate Access Token
  async generateAccessToken(userId: number, role: Role): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, role: role },
      { secret: EnvKeyConstants.JWT_SECRET, expiresIn: '1h' },
    );
  }

  // Generate Refresh Token
  async generateRefreshToken(userId: number, role: Role): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, role: role },
      { secret: EnvKeyConstants.JWT_REFRESH_SECRET, expiresIn: '1d' },
    );
  }

  // Verify Access Token
  async verifyAccessToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: EnvKeyConstants.JWT_SECRET,
      });
    } catch (err) {
      console.error('Access token verification failed', err);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  // Verify Refresh Token
  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: EnvKeyConstants.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      console.error('Refresh token verification failed', err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  // Decode Token (for both access and refresh tokens)
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  getTokenFromRequest(request: Request): string {
    const token = (request.headers['authorization'] ?? '').replace(
      'Bearer ',
      '',
    );
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  decodeToke(req: Request): any {
    const token = this.getTokenFromRequest(req);
    return this.jwtService.decode(token);
  }
}
