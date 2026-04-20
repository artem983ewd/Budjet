import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorsObject {
  [key: string]: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    const errors: ErrorsObject = {};

    if (exception instanceof UnauthorizedException) {
      status = 401;
      errors.general = 'Неверный email или пароль';
    } else if (exception instanceof ConflictException) {
      status = 409;
      errors.email = 'Пользователь с таким email уже зарегистрирован';
    } else {
      errors.general = 'Что-то пошло не так';
    }

    response.status(status).json({ errors });
  }
}
