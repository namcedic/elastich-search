import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { swaggerConfig } from './configs/swagger.config';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { formatExceptionFactory } from './common/utils/exception';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });

  app.enableCors({
    origin: '*',
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: formatExceptionFactory,
        stopAtFirstError: true,
        forbidNonWhitelisted: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
  );

  app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  swaggerConfig(app);
  await app.listen(3000);
}

bootstrap();
