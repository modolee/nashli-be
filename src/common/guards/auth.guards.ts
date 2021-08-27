import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { API_SECRET } from '../constants/environment.constant';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    const apiSecret = authorization.split('apiSecret ')[1];

    return apiSecret === API_SECRET;
  }
}
