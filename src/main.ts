import { HttpException, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import { ResponseTransformInterceptor } from '@/core/interceptors/response-transform.interceptor';
import { HttpExceptionFilter } from '@/core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Root endpoint
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.send(
      'Book Management System - Welcome to the API server. Please visit <a href="/api">API Documentation</a> for more information.',
    );
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory(errors) {
        return new HttpException(errors, 400);
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Book Management System')
    .setDescription('The Book Management System API Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5000);
  console.log(`Server is running on ${await app.getUrl()}`);
}

void bootstrap();
