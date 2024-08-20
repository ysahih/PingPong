import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response
      .status(200)
      .json({
        statusCode: status,
        error: "Unauthorized",
        message: exception.message || 'You are not authorized to access this resource',
      });
  }
}