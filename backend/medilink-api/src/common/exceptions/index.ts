import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom Business Logic Exception
 */
export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode,
        message,
        error: 'Business Logic Error',
      },
      statusCode,
    );
  }
}

/**
 * Resource Not Found Exception
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resourceType: string, resourceId: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${resourceType} with ID ${resourceId} not found`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Unauthorized Access Exception
 */
export class UnauthorizedAccessException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Forbidden Resource Exception
 */
export class ForbiddenException extends HttpException {
  constructor(message = 'Access forbidden') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Validation Exception
 */
export class ValidationException extends HttpException {
  constructor(errors: Record<string, string[]>) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        error: 'Unprocessable Entity',
        details: errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Conflict Exception (duplicate resource, etc)
 */
export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * FHIR Server Exception
 */
export class FhirException extends HttpException {
  constructor(message: string, originalError?: any) {
    super(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: `FHIR Server Error: ${message}`,
        error: 'Bad Gateway',
        details: originalError?.message,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

/**
 * Encryption Exception
 */
export class EncryptionException extends HttpException {
  constructor(operation: 'encrypt' | 'decrypt', message?: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Encryption ${operation} failed: ${message || 'unknown error'}`,
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Rate Limit Exception (already provided by NestJS)
 * But we can create a custom one if needed
 */
export class RateLimitExceededException extends HttpException {
  constructor(resetTime: number) {
    const secondsToReset = Math.ceil((resetTime - Date.now()) / 1000);
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Rate limit exceeded. Try again in ${secondsToReset} seconds`,
        error: 'Too Many Requests',
        retryAfter: secondsToReset,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

/**
 * Session Expired Exception
 */
export class SessionExpiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Your session has expired. Please log in again',
        error: 'Session Expired',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
