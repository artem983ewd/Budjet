import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

interface ErrorsObject {
  [key: string]: string;
}

interface ExceptionResponse {
  message?: string | string[] | ValidationError[];
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as ExceptionResponse;
    const errors: ErrorsObject = {};

    const message = exceptionResponse.message;

    if (Array.isArray(message)) {
      // Проверяем первый элемент, чтобы понять тип массива
      if (typeof message[0] === 'string') {
        // Если это массив строк (стандартный вывод ValidationPipe)
        const errorMap: Record<string, string> = {
          email: 'email',
          password: 'password',
          username: 'username',
          пароль: 'password',
        };

        (message as string[]).forEach((errMsg) => {
          const lowerMsg = errMsg.toLowerCase();
          let matched = false;
          for (const [keyword, field] of Object.entries(errorMap)) {
            if (lowerMsg.includes(keyword)) {
              errors[field] = errMsg;
              matched = true;
              break;
            }
          }
          if (!matched) errors.general = errMsg;
        });
      } else if (message[0] instanceof ValidationError) {
        // Если это массив объектов ValidationError (с включенным exceptionFactory)
        (message as ValidationError[]).forEach((error) => {
          if (error.constraints) {
            errors[error.property] = Object.values(error.constraints)[0];
          }
        });
      }
    } else if (typeof message === 'string') {
      errors.general = message;
    }

    response.status(status).json({ errors });
  }
}
