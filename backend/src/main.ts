import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // Global Exception Filters
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AllExceptionsFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
