import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'
import * as passport from 'passport'
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';


async function server() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))
  app.use(session({
    secret: 'essadike',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge : 60000 * 5,
      httpOnly: true,
      // secret: 'fhdfhdfhdfhdfhd',
    },
  }))

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  // app.useWebSocketAdapter(new WsAdapter(app));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  await app.listen(3000);
}

server();
