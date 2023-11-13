import {DynamicModule, Module, Provider} from '@nestjs/common';
import { LoggerService } from './logger.service';
import {LOGGER_OPTIONS, WINSTON} from './contants';
import winston from 'winston';
import {LoggerAsyncModuleOptions, LoggerModuleOptions, LoggerOptionsFactory} from './interfaces/options.interface';
import {createLoggerProviders} from './logger.providers';
import {LoggerBuilderService} from './logger-builder.service';

@Module({})
export class LoggerModule {
  static register(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      global: options.global,
      providers: [
        ...createLoggerProviders(options),
      ],
      exports: [
        LoggerService,
      ],
    }
  }

  static registerAsync(
    options: LoggerAsyncModuleOptions,
  ): DynamicModule {
    return {
      module: LoggerModule,
      global: options.global,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders ?? []),
        LoggerBuilderService,
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  private static createAsyncProviders(
    options: LoggerAsyncModuleOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(
    options: LoggerAsyncModuleOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: LOGGER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }
    return {
      provide: LOGGER_OPTIONS,
      useFactory: async (optionsFactory: LoggerOptionsFactory) =>
        await optionsFactory.createLoggerOptions(),
      inject: [options.useExisting || options.useClass]
    };
  }
}
