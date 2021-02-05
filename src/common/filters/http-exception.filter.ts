import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getHttpErrorCode } from '@common/util/http-error-code.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      error: {
        code: getHttpErrorCode(exception),
        message: exception.message,
      },
    });
  }
}
