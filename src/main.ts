import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://todo-nextjs-nu.vercel.app'],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true, // change it to false when testing in local environment
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  // process.env.PORT will be used when deployed in production environment
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
