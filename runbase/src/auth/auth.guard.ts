import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    if (!jwtString) {
      throw new UnauthorizedException('Access token not provided');
    }

    try {
      const user = this.authService.verify(jwtString);
      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
