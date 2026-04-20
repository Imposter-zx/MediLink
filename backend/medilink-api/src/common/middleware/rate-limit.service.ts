import { Injectable } from '@nestjs/common';
import { Request } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * Rate Limiting Service
 * Implements sliding window rate limiting per IP/User
 */
@Injectable()
export class RateLimitService {
  private store: RateLimitStore = {};
  private readonly defaultLimit = 100; // requests per window
  private readonly defaultWindow = 60 * 1000; // 1 minute window
  private readonly cleanupInterval = 5 * 60 * 1000; // Clean up every 5 minutes

  constructor() {
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(identifier: string, limit?: number, window?: number): boolean {
    const _limit = limit || this.defaultLimit;
    const _window = window || this.defaultWindow;
    const now = Date.now();

    if (!this.store[identifier]) {
      this.store[identifier] = { count: 1, resetTime: now + _window };
      return true;
    }

    const record = this.store[identifier];

    // Reset if window has passed
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + _window;
      return true;
    }

    // Check if limit exceeded
    if (record.count >= _limit) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Get current rate limit status for identifier
   */
  getStatus(identifier: string): {
    count: number;
    limit: number;
    window: number;
    resetTime: number;
    remaining: number;
  } {
    const record = this.store[identifier];
    const now = Date.now();

    if (!record) {
      return {
        count: 0,
        limit: this.defaultLimit,
        window: this.defaultWindow,
        resetTime: now + this.defaultWindow,
        remaining: this.defaultLimit,
      };
    }

    const remaining = Math.max(0, this.defaultLimit - record.count);

    return {
      count: record.count,
      limit: this.defaultLimit,
      window: this.defaultWindow,
      resetTime: record.resetTime,
      remaining,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    delete this.store[identifier];
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(req: Request): string {
  // Try to get user ID from session
  if ((req as any).session?.userId) {
    return `user:${(req as any).session.userId}`;
  }

  // Fall back to IP address
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown';

  return `ip:${ip}`;
}

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints - stricter limits
  LOGIN: { limit: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  LOGOUT: { limit: 100, window: 60 * 1000 },

  // Data endpoints - moderate limits
  CREATE: { limit: 50, window: 60 * 1000 },
  READ: { limit: 200, window: 60 * 1000 },
  UPDATE: { limit: 50, window: 60 * 1000 },
  DELETE: { limit: 20, window: 60 * 1000 },

  // Messaging - higher limits for real-time
  SEND_MESSAGE: { limit: 100, window: 60 * 1000 },

  // Export - stricter limits
  EXPORT: { limit: 10, window: 60 * 60 * 1000 }, // 10 per hour

  // Default
  DEFAULT: { limit: 100, window: 60 * 1000 },
};
