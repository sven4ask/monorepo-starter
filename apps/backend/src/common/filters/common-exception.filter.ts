import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { InternalExceptionFilter } from './internal-exception.filter';

@Injectable()
@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  constructor(
    public readonly httpException: HttpExceptionFilter,
    public readonly internalException: InternalExceptionFilter,
  ) { }

  async catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return this.httpException.catch(exception, host);
    }

    return this.internalException.catch(exception, host);
  }
}
