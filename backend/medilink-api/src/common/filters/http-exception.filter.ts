import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Standard API Error Response Format
 */
export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error: string;
  details?: Record<string, any>;
  traceId?: string;
}

/**
 * Custom HTTP Exception Filter
 * Provides consistent error responses and logging
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const timestamp = new Date().toISOString();
    const traceId = this.generateTraceId();

    // Build error response
    let message = 'Internal Server Error';
    let details: Record<string, any> | undefined;

    if (typeof exceptionResponse === 'object') {
      const res = exceptionResponse as any;
      message = res.message || message;
      details = res;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      timestamp,
      path: request.path,
      method: request.method,
      message,
      error: this.getErrorName(status),
      ...(details && { details }),
      traceId,
    };

    // Log the error
    this.logError(request, status, errorResponse);

    // Send response
    response.status(status).json(errorResponse);
  }

  private getErrorName(status: number): string {
    const errorMap: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };

    return errorMap[status] || 'Unknown Error';
  }

  private logError(request: Request, status: number, errorResponse: ApiErrorResponse) {
    const logData = {
      traceId: errorResponse.traceId,
      statusCode: status,
      path: request.path,
      method: request.method,
      message: errorResponse.message,
      userAgent: request.get('user-agent'),
      ip: this.getClientIp(request),
      timestamp: errorResponse.timestamp,
    };

    if (status >= 500) {
      this.logger.error(`500 Error: ${errorResponse.message}`, logData);
    } else if (status >= 400) {
      this.logger.warn(`${status} Error: ${errorResponse.message}`, logData);
    }
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Catch-All Exception Filter
 * Handles non-HTTP exceptions and unexpected errors
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();
    const traceId = this.generateTraceId();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';

    if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    } else if (typeof exception === 'string') {
      message = exception;
    } else {
      this.logger.error(`Unhandled exception`, exception);
    }

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      timestamp,
      path: request.path,
      method: request.method,
      message,
      error: 'Internal Server Error',
      traceId,
    };

    response.status(status).json(errorResponse);
  }

  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
