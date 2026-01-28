import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Session } from '../../common/decorators/session.decorator';
import type { SessionData } from '../../common/types/session.types';

/**
 * Messaging Controller
 * HTTP endpoints for message history and retrieval
 */
@Controller('messages')
@UseGuards(AuthGuard)
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  /**
   * Get conversation between current user and another user
   */
  @Get('conversation')
  async getConversation(
    @Query('userId') otherUserId: string,
    @Session() session: SessionData,
  ) {
    return this.messagingService.getConversation(
      session.userId,
      otherUserId,
    );
  }

  /**
   * Get messages by context (prescription or delivery)
   */
  @Get('by-context')
  async getByContext(
    @Query('type') contextType: 'prescription' | 'delivery',
    @Query('id') contextId: string,
  ) {
    return this.messagingService.getMessagesByContext(contextType, contextId);
  }

  /**
   * Send message via HTTP (alternative to WebSocket)
   */
  @Post()
  async sendMessage(
    @Body()
    body: {
      recipientId: string;
      content: string;
      contextType?: 'prescription' | 'delivery';
      contextId?: string;
    },
    @Session() session: SessionData,
  ) {
    return this.messagingService.sendMessage({
      senderId: session.userId,
      senderRole: session.role,
      recipientId: body.recipientId,
      content: body.content,
      contextType: body.contextType,
      contextId: body.contextId,
    });
  }
}
