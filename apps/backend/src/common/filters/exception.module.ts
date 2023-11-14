import { Module } from '@nestjs/common';
import { CommonExceptionFilter } from './common-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { InternalExceptionFilter } from './internal-exception.filter';
import { ConfigModule } from '../../config/config.module';
import { LoggerModule, LoggerModuleOptions } from '@monorepo-starter/logger';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [
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
  providers: [
    HttpExceptionFilter,
    CommonExceptionFilter,
    InternalExceptionFilter,
  ],
  exports: [
    HttpExceptionFilter,
    CommonExceptionFilter,
    InternalExceptionFilter,
  ],
})
export class ExceptionModule {}
