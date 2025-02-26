import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCode } from '../constants/error';
import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    console.log('🔥 Exception occurred:', exception);

    // 🛠️ Handle REST Errors
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (!response || typeof response.status !== 'function') {
      this.logger.error('🔥 Invalid response object:', response);
      return;
    }

    if (exception instanceof ThrottlerException) {
      return httpAdapter.reply(
        response,
        {
          errorCode: ErrorCode.TOO_MANY_REQUESTS,
          message: exception.message,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (exception instanceof UnauthorizedException) {
      return httpAdapter.reply(
        response,
        {
          errorCode: ErrorCode.AUTHORIZATION_REQUIRED,
          message: exception.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Extract error message properly for REST
    const errorResponse = exception?.response || {};
    const errorCode = errorResponse?.errorCode || ErrorCode.UNKNOWN_ERROR;
    const errorMessage =
      errorResponse?.errorMessage instanceof Array
        ? errorResponse.errorMessage
            .map((err) => `${err.property}: ${err.errors}`)
            .join(', ')
        : errorResponse?.message || exception.message;

    this.logger.warn('🔥 REST Exception occurred:', exception.stack);

    return httpAdapter.reply(
      response,
      {
        errorCode,
        message: errorMessage,
      },
      exception.getStatus ? exception.getStatus() : HttpStatus.BAD_REQUEST,
    );
  }
}
