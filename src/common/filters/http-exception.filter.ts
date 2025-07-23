import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import ErrorApiResponse from '../dto/api-response/error-api-response.dto';
import GlobalErrorMessages from '../constants/messages.error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let apiResponse: ErrorApiResponse;
    if (error instanceof BadRequestException) {
      const responseBody = error.getResponse();
      if (
        typeof responseBody === 'object' &&
        responseBody.hasOwnProperty('message')
      ) {
        const messages = (responseBody as any).message;
        if (Array.isArray(messages)) {
          const flatMessages = messages
            .map((msg) =>
              typeof msg === 'object' && msg.message ? msg.message : msg,
            )
            .flat()
            .join(', ');

          apiResponse = new ErrorApiResponse(flatMessages);
        }
      }
    }

    if (error instanceof ForbiddenException) {
      apiResponse = new ErrorApiResponse(GlobalErrorMessages.FORBIDDEN);
    }

    if (error instanceof UnauthorizedException) {
      apiResponse = new ErrorApiResponse(GlobalErrorMessages.UNAUTHORIZED);
    }

    if (!apiResponse) {
      apiResponse = new ErrorApiResponse(error.message);
    }

    response.status(status).json({
      isSuccess: false,
      message: apiResponse.message,
    });
  }
}
