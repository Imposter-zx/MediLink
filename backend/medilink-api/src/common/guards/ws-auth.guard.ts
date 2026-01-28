import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * WebSocket Auth Guard
 * Validates WebSocket connections have valid session
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    
    // Extract session data from handshake
    // In production, this would validate the session cookie
    const sessionId = client.handshake.auth?.sessionId || 
                      client.handshake.headers?.cookie?.match(/session_id=([^;]+)/)?.[1];

    if (!sessionId) {
      throw new UnauthorizedException('No session provided');
    }

    // TODO: Validate session with Redis/session store
    // For now, we'll extract from auth payload
    const userId = client.handshake.auth?.userId;
    const userRole = client.handshake.auth?.role;

    if (!userId || !userRole) {
      throw new UnauthorizedException('Invalid session');
    }

    // Attach to socket for use in handlers
    (client as any).userId = userId;
    (client as any).userRole = userRole;

    return true;
  }
}
