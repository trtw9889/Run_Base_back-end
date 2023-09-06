import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMessages = [];
    for (const property in exception.constraints) {
      if (exception.constraints.hasOwnProperty(property)) {
        errorMessages.push(exception.constraints[property]);
      }
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: '유효성 검사 실패',
      errors: errorMessages,
    });
  }
}
