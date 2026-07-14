import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * WebSocket Auth Guard
 * Validates WebSocket connections via session cookie
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    
    // Extract session ID from cookie
    const sessionCookie = client.handshake.headers?.cookie || '';
    const sessionId = sessionCookie.match(/connect\.sid=([^;]+)/)?.[1] ||
                      sessionCookie.match(/session_id=([^;]+)/)?.[1];

    if (!sessionId) {
      throw new UnauthorizedException('No session provided');
    }

    // In production, validate session with Redis/session store
    // For now, validate session cookie format (s: prefix = signed)
    if (!sessionId.startsWith('s:')) {
      throw new UnauthorizedException('Invalid session format');
    }

    // Attach session info for handlers
    (client as any).sessionId = sessionId;

    return true;
  }
}
