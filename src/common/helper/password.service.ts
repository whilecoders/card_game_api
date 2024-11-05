import * as bcrypt from 'bcryptjs';

export class PasswordHashService {
  static hashPassword(password: string): string {
    const saltOrRounds = 10;
    return bcrypt.hashSync(password, saltOrRounds);
  }
  static verifyPassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }
}
