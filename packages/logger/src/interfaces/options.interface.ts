import {LogLevel} from '../types/log-level';
import {ModuleMetadata, Provider, Type} from '@nestjs/common';
import {createLoggerProviders} from '../logger.providers';

export interface LoggerModuleOptions {
  appName?: string;

  env?: string;

  level?: LogLevel;

  force?: boolean;

  global?: boolean;

  rollbar?: {
    accessToken: string;

    environment?: string;

    level?: LogLevel;
  }
}

export interface LoggerOptionsFactory {
  createLoggerOptions(): Promise<LoggerModuleOptions> | LoggerModuleOptions;
}

export interface LoggerAsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<LoggerOptionsFactory>;
  useClass?: Type<LoggerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
