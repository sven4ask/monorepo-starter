import {LoggerModuleOptions} from './interfaces/options.interface';
import {LOGGER_OPTIONS} from './contants';
import {LoggerBuilderService} from './logger-builder.service';
import {LoggerService} from './logger.service';

export function createLoggerProviders(options: LoggerModuleOptions) {
  return [
    {
      provide: LOGGER_OPTIONS,
      useValue: options || {},
    },
    LoggerBuilderService,
    LoggerService,
  ];
}
