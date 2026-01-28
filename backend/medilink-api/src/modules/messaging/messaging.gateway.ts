import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../common/guards/ws-auth.guard';

/**
 * WebSocket Gateway for real-time messaging
 * Handles secure, encrypted medical communications
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/messaging',
})
@UseGuards(WsAuthGuard)
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Track connected users
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private messagingService: MessagingService) {}

  /**
   * Handle client connection
   */
  async handleConnection(client: Socket) {
    try {
      const userId = (client as any).userId; // Set by WsAuthGuard
      const role = (client as any).userRole;

      if (!userId) {
        client.disconnect();
        return;
      }

      this.connectedUsers.set(client.id, userId);
      
      // Join user-specific room
      client.join(`user:${userId}`);
      
      // Join role-specific room
      client.join(`role:${role}`);

      console.log(`✅ User ${userId} (${role}) connected via WebSocket`);

      // Notify user is online
      this.server.to(`user:${userId}`).emit('connected', {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`❌ User ${userId} disconnected from WebSocket`);
    }
  }

  /**
   * Send a message
   */
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      recipientId: string;
      content: string;
      contextType?: 'prescription' | 'delivery';
      contextId?: string;
    },
  ) {
    try {
      const senderId = (client as any).userId;
      const senderRole = (client as any).userRole;

      // Create encrypted message in FHIR
      const message = await this.messagingService.sendMessage({
        senderId,
        senderRole,
        recipientId: data.recipientId,
        content: data.content,
        contextType: data.contextType,
        contextId: data.contextId,
      });

      // Emit to sender (confirmation)
      client.emit('message_sent', {
        messageId: message.id,
        timestamp: new Date().toISOString(),
      });

      // Emit to recipient (real-time delivery)
      this.server.to(`user:${data.recipientId}`).emit('new_message', {
        messageId: message.id,
        senderId,
        content: data.content, // Already decrypted by service
        timestamp: new Date().toISOString(),
        contextType: data.contextType,
        contextId: data.contextId,
      });

      console.log(`📨 Message sent: ${senderId} → ${data.recipientId}`);

      return { success: true, messageId: message.id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark message as read
   */
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      const userId = (client as any).userId;

      await this.messagingService.markAsRead(data.messageId, userId);

      // Notify sender that message was read
      const message = await this.messagingService.getMessage(data.messageId);
      const senderId = this.extractUserId((message as any).sender?.reference);

      if (senderId) {
        this.server.to(`user:${senderId}`).emit('message_read', {
          messageId: data.messageId,
          readBy: userId,
          timestamp: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * User is typing indicator
   */
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { recipientId: string; isTyping: boolean },
  ) {
    const userId = (client as any).userId;

    this.server.to(`user:${data.recipientId}`).emit('user_typing', {
      userId,
      isTyping: data.isTyping,
    });
  }

  /**
   * Extract user ID from FHIR reference
   */
  private extractUserId(reference: string): string | null {
    if (!reference) return null;
    const parts = reference.split('/');
    return parts.length === 2 ? parts[1] : null;
  }
}
