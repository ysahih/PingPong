import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

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

  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000, // e.g., 24 hours
      secure: false, // set to true if you're using https
    },
  }));


  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport to manage sessions
  passport.serializeUser((user, done) => {
    done(null, user); // Serialize the user ID into the session
  });

  passport.deserializeUser((id, done) => {
    // Here you should use your method to find the user by ID
    // For example:
    // userService.findById(id).then(user => done(null, user)).catch(err => done(err));
    done(null, {id}); // Simplified for example purposes
  });
  
  
  await app.listen(3000);
}

server().catch(console.error);
