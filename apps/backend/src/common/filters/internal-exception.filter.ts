import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { LoggerService } from '@monorepo-starter/logger';
import { ConfigService } from '../../config/config.service';
import { snake } from 'to-case';

@Injectable()
@Catch()
export class InternalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    this.logger = this.logger.build(InternalExceptionFilter.name);
  }

  _isDebug: boolean;
  get isDebug() {
    return this._isDebug ??= this.config.isDebug();
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const time = new Date().toISOString();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = 500;
    const path = request.path;
    const method = request.method;
    const message = this.isDebug ? exception.message : 'internal server error';
    const stack = exception.stack;

    const type = (typeof message === 'string' ? snake(message) : undefined);

    this.logger.error(`'[${method}] ${path} (${status})' failed with ${message}`, {
      stack: stack || null,
      request,
      response,
    });

    response
      .status(status)
      .json({
        path,
        method,
        code: status,
        message: typeof message !== 'string' ? undefined : message,
        error: typeof message !== 'string' ? message : undefined,
        type,
        time,
      });
  }
}
