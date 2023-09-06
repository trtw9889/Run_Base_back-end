import { registerAs } from '@nestjs/config';
import * as config from 'config';

const jwtConfig = config.get('jwt');

export default registerAs('auth', () => ({
  jwtSecret: jwtConfig.jwtSecret,
}));
