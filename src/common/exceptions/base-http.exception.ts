import { HttpException, HttpStatus, Logger } from '@nestjs/common';

/**
 * 기본 Http Exception
 */
export class BaseHttpException extends HttpException {
  constructor(path: string, message: string, statusCode: HttpStatus) {
    Logger.error(`[${path}] ${message}`);
    super(message, statusCode);
  }
}
