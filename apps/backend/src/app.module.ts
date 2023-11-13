import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule, LoggerModuleOptions } from '@monorepo-starter/logger';
import { ConfigService } from './config/config.service';

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
  providers: [],
})
export class AppModule {}
