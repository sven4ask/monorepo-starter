import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@monorepo-starter/logger';

async function swagger(app: INestApplication, config: ConfigService) {
  const unbuild = new DocumentBuilder()
    .setTitle('Monorepo starter')
    .setDescription('Monorepo starter')
    .addBearerAuth()
    .addServer('/')

  const options = unbuild.build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}

async function bootstrap() {

  const app = await NestFactory.create(AppModule, );

  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<LoggerService>(LoggerService);
  swagger(app, config);

  await app.listen(config.getPort());

  // console.log(`Application is running on: ${await app.getUrl()}`);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
