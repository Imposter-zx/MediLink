import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RBAC Guard - Enforces role-based access control
 * Checks if authenticated user has required role(s)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const hasRole = requiredRoles.includes(session.role);

    if (!hasRole) {
      // Log unauthorized access attempt
      console.warn(`[RBAC] Access denied: User ${session.userId} (${session.role}) attempted to access resource requiring roles: ${requiredRoles.join(', ')}`);
      
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
