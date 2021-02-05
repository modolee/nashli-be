import { BaseHttpException } from './base-http.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * 리소스를 찾기 못했을 때 Http Exception
 * statusCode: 404
 */
export class NotFoundHttpException extends BaseHttpException {
  constructor(path: string, message: string) {
    super(path, message, HttpStatus.NOT_FOUND);
  }
}
