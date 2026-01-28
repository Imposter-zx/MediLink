import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Auth Guard - Ensures user is authenticated
 * Checks for valid session
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}
