import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitService, getIdentifier, RATE_LIMIT_CONFIG } from './rate-limit.service';

/**
 * Rate Limiting Middleware
 * Applies rate limiting to all requests based on endpoint and IP/User
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private rateLimitService: RateLimitService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const identifier = getIdentifier(req);
    const endpoint = this.getEndpointType(req.path, req.method);
    const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG.DEFAULT;

    // Check rate limit
    const allowed = this.rateLimitService.isAllowed(identifier, config.limit, config.window);

    // Get status for headers
    const status = this.rateLimitService.getStatus(identifier);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', status.limit);
    res.setHeader('X-RateLimit-Remaining', status.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(status.resetTime / 1000));

    if (!allowed) {
      // Log rate limit exceeded
      console.warn(`⚠️  Rate limit exceeded for ${identifier} on ${req.path}`);

      throw new HttpException(
        `Rate limit exceeded. Try again after ${Math.ceil((status.resetTime - Date.now()) / 1000)} seconds`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }

  /**
   * Determine rate limit category based on endpoint
   */
  private getEndpointType(path: string, method: string): string {
    // Authentication
    if (path.includes('/auth/login')) return 'LOGIN';
    if (path.includes('/auth/logout')) return 'LOGOUT';

    // CRUD operations
    if (method === 'POST') return 'CREATE';
    if (method === 'GET') return 'READ';
    if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
    if (method === 'DELETE') return 'DELETE';

    // Messaging
    if (path.includes('/messages')) return 'SEND_MESSAGE';

    // Export
    if (path.includes('/export')) return 'EXPORT';

    return 'DEFAULT';
  }
}
