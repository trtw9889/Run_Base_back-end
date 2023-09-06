import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import authConfig from 'src/configs/authConfig';
import { UserType } from 'src/users/types/userType';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
  ) {}

  async transformPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }

  async validatePassword(password: string, hashedPassword: string) {
    const validateResult = await bcrypt.compare(password, hashedPassword);

    return validateResult;
  }

  signIn(user: UserType) {
    const payload = user;

    const token = jwt.sign(payload, this.config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '7d',
      audience: 'audience',
      issuer: 'afterWe',
    });

    return {
      token,
      id: user.id,
    };
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        UserType;

      const { id, email } = payload;

      return {
        id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
