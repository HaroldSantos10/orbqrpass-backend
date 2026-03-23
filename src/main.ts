import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //delete fields that are not in the DTO
    forbidNonWhitelisted: true, // throw an error if there are fields that are not in the DTO
    
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
