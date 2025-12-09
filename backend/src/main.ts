import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? [
          process.env.CORS_ORIGIN,
          process.env.CORS_ORIGIN.replace('://', '://www.'),
        ]
      : ['http://localhost:4200', 'http://localhost:4000'],
    credentials: true,
  });

  const config = new DocumentBuilder()

    .setTitle('Sports API')

    .setVersion('1.0')

    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
