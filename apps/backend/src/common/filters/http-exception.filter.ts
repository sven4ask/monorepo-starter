import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { InternalExceptionFilter } from './internal-exception.filter';
import { LoggerService } from '@monorepo-starter/logger';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly internalException: InternalExceptionFilter,
  ) {
    this.logger = this.logger.build(HttpExceptionFilter.name)
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      return this.internalException.catch(exception, host);
    }
    const time = new Date().toISOString();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const path = request.path;
    const method = request.method;
    const exResponse = exception.getResponse() as any;
    const message = typeof exResponse === 'string' || Array.isArray(exResponse) ?
      exResponse :
      (exResponse.message || exResponse.error);
    const stack = exception.stack;

    const type = typeof message === 'string' ? message : undefined;
    this.logger.debug(
      `'[${method}] ${path} (${status})' failed with ${message}`,
      {
      stack: stack || null
    });

    response.status(status)
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
