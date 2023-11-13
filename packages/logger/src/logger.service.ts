import {Injectable, LoggerService as LoggerServiceInterface, OnModuleInit, Optional} from '@nestjs/common';
import cliProgress from 'cli-progress';
import { LoggerOptionsInterface } from './interfaces/logger.interface';
import { LoggerBuilderService } from './logger-builder.service';
import {LogLevel} from './types/log-level';

@Injectable()
export class LoggerService implements OnModuleInit, LoggerServiceInterface  {
  constructor(
    private readonly loggerBuilder: LoggerBuilderService,
    @Optional() private readonly context?: string,
  ) { }

  async onModuleInit() {
    const config = this.loggerBuilder.getOptions()

    // Since all the logs are done from the same spot (in winston), it's pointless for jest to override this
    // to deal with this properly, import the original console module and override the global console
    if (config.env === 'test') {
      globalThis.console = await import('console');
    }
  }

  build(context?: string|object) {
    if (typeof context === 'object' || typeof context === 'function') {
      context = Object.getPrototypeOf(context).constructor.name; // get name of child class
    }
    return new LoggerService(this.loggerBuilder, (context as string));
  }

  info(message: string, meta?: any, options?: LoggerOptionsInterface) {
    this.log('info', message, meta, options);
  }

  warn(message: string, meta?: any, options?: LoggerOptionsInterface) {
    this.log('warn', message, meta, options);
  }

  error(message: string, meta?: any, options?: LoggerOptionsInterface) {
    this.log('error', message, meta, options);
  }

  debug(message: string, meta?: any, options?: LoggerOptionsInterface) {
    this.log('debug', message, meta, options);
  }

  progress(total: number) {
    // @todo: see if we can make the progress bar sticky even if other stuff is printed to console
    const bar = new cliProgress.SingleBar({
      stopOnComplete: true,
      hideCursor: true,
      forceRedraw: true,
    }, cliProgress.Presets.shades_classic);

    bar.start(total, 0);

    return bar;
  }

  log(level: LogLevel, message: string, meta?: any, options?: LoggerOptionsInterface ) {
    const config = this.loggerBuilder.getOptions();

    if (
      config.env === 'test' &&
      options?.force !== true
    ) {
      return;
    }

    const logger = this.loggerBuilder.getLogger();
    logger[level](message, { ...meta, context: this.context || LoggerService.name });
  }
}
