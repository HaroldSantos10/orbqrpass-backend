import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //delete fields that are not in the DTO
    forbidNonWhitelisted: true, // throw an error if there are fields that are not in the DTO
    
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('OrbQRPass API')
    .setDescription('API para la gestión y validación de accesos a eventos mediante QR')
    .setVersion('1.0')
    .addBearerAuth() // enable the token JWT field in Swagger
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document); // available at /docs
    await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
