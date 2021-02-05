import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const requestUrl = request.path;
    const excludePaths = ['/jwk', '/jwks']; // Response 포맷 적용을 제외 할 경로

    let response;
    if (!excludePaths.some(url => requestUrl.includes(url))) {
      // 포맷 적용
      response = data => ({
        success: true,
        data,
      });
    } else {
      // 포맷 적용 안함
      response = data => data;
    }

    return next.handle().pipe(map(response));
  }
}
