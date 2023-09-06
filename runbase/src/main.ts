import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { GlobalExceptionFilter } from './utils/global-exception.filter';
import { ValidationExceptionFilter } from './utils/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  // app.useGlobalFilters(new ValidationExceptionFilter());
  // app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);
  Logger.log(`Application running on port ${port}!`);
}
bootstrap();
