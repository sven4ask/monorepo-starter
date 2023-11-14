import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule as DbModule } from '@monorepo-starter/mongo';
import { databaseProviders } from './database.providers';
import { ConfigService } from '../config/config.service';
import { LoggerModule, LoggerModuleOptions } from '@monorepo-starter/logger';

@Module({
  imports: [
    DbModule,
    ConfigModule,
    LoggerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): LoggerModuleOptions => {
        return {
          global: true,
          ...configService.getLoggerFactoryConfig(),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
