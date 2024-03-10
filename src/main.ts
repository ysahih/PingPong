import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

async function server() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Access-Control-Allow-Headers', 'Origin','X-Requested-With','Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   res.header('Permissions-Policy', 'interest-cohort=()');
  //   next();
  // });
  
  await app.listen(3000);
}

server().catch(console.error);
