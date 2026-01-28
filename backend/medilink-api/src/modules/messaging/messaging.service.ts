import { Injectable } from '@nestjs/common';
import { FhirService } from '../../services/fhir.service';
import { EncryptionService } from '../../services/encryption.service';

interface SendMessageDto {
  senderId: string;
  senderRole: string;
  recipientId: string;
  content: string;
  contextType?: 'prescription' | 'delivery';
  contextId?: string;
}

/**
 * Messaging Service
 * Handles encrypted FHIR Communication resources
 */
@Injectable()
export class MessagingService {
  constructor(
    private fhirService: FhirService,
    private encryptionService: EncryptionService,
  ) {}

  /**
   * Send an encrypted message
   */
  async sendMessage(dto: SendMessageDto) {
    // Encrypt message content
    const encrypted = this.encryptionService.encrypt(dto.content);

    // Create FHIR Communication resource
    const communication = await this.fhirService.createResource({
      resourceType: 'Communication',
      status: 'completed',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/communication-category',
              code: dto.contextType === 'prescription' ? 'instruction' : 'notification',
            },
          ],
        },
      ],
      subject: dto.contextId
        ? {
            reference: `${dto.contextType === 'prescription' ? 'MedicationRequest' : 'Task'}/${dto.contextId}`,
          }
        : undefined,
      sent: new Date().toISOString(),
      sender: {
        reference: `Patient/${dto.senderId}`, // Simplified - should use proper resource type
      },
      recipient: [
        {
          reference: `Patient/${dto.recipientId}`, // Simplified
        },
      ],
      payload: [
        {
          contentString: encrypted.encrypted, // Encrypted content
        },
      ],
      extension: [
        {
          url: 'http://medilink.io/fhir/StructureDefinition/encryption-iv',
          valueString: encrypted.iv,
        },
        {
          url: 'http://medilink.io/fhir/StructureDefinition/encryption-auth-tag',
          valueString: encrypted.authTag,
        },
        {
          url: 'http://medilink.io/fhir/StructureDefinition/read-status',
          valueBoolean: false,
        },
        {
          url: 'http://medilink.io/fhir/StructureDefinition/sender-role',
          valueString: dto.senderRole,
        },
      ],
    });

    // Create audit event
    await this.fhirService.createResource({
      resourceType: 'AuditEvent',
      type: {
        system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
        code: 'rest',
        display: 'RESTful Operation',
      },
      subtype: [
        {
          system: 'http://hl7.org/fhir/restful-interaction',
          code: 'create',
          display: 'create',
        },
      ],
      action: 'C',
      recorded: new Date().toISOString(),
      agent: [
        {
          who: {
            reference: `Patient/${dto.senderId}`,
          },
          requestor: true,
        },
      ],
      entity: [
        {
          what: {
            reference: `Communication/${(communication as any).id}`,
          },
          type: {
            system: 'http://hl7.org/fhir/resource-types',
            code: 'Communication',
          },
        },
      ],
    });

    console.log(`📨 Encrypted message created: ${(communication as any).id}`);

    // Return decrypted version for immediate use
    return {
      ...communication,
      decryptedContent: dto.content,
    };
  }

  /**
   * Get conversation between two users
   */
  async getConversation(userId1: string, userId2: string) {
    // Search for communications between these users
    const communications = await this.fhirService.searchResources(
      'Communication',
      {
        sender: `Patient/${userId1}`,
        recipient: `Patient/${userId2}`,
      },
    );

    // Also get reverse direction
    const reverseComms = await this.fhirService.searchResources(
      'Communication',
      {
        sender: `Patient/${userId2}`,
        recipient: `Patient/${userId1}`,
      },
    );

    const allMessages = [...communications, ...reverseComms];

    // Decrypt messages
    return allMessages.map((msg: any) => {
      const encryptedContent = msg.payload?.[0]?.contentString;
      const iv = msg.extension?.find(
        (e: any) => e.url.includes('encryption-iv'),
      )?.valueString;
      const authTag = msg.extension?.find(
        (e: any) => e.url.includes('encryption-auth-tag'),
      )?.valueString;

      let decryptedContent = '';
      if (encryptedContent && iv && authTag) {
        try {
          decryptedContent = this.encryptionService.decrypt({
            encrypted: encryptedContent,
            iv,
            authTag,
          });
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          decryptedContent = '[Decryption failed]';
        }
      }

      return {
        id: msg.id,
        senderId: this.extractUserId(msg.sender?.reference),
        recipientId: this.extractUserId(msg.recipient?.[0]?.reference),
        content: decryptedContent,
        timestamp: msg.sent,
        isRead: msg.extension?.find((e: any) => e.url.includes('read-status'))
          ?.valueBoolean,
        contextType: msg.subject?.reference?.includes('MedicationRequest')
          ? 'prescription'
          : msg.subject?.reference?.includes('Task')
            ? 'delivery'
            : null,
        contextId: msg.subject?.reference?.split('/')[1],
      };
    });
  }

  /**
   * Get a single message by ID
   */
  async getMessage(messageId: string) {
    return this.fhirService.readResource('Communication', messageId);
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string, userId: string) {
    const message = await this.fhirService.readResource(
      'Communication',
      messageId,
    );

    // Update read status extension
    const extensions = (message as any).extension || [];
    const readStatusIndex = extensions.findIndex((e: any) =>
      e.url.includes('read-status'),
    );

    if (readStatusIndex >= 0) {
      extensions[readStatusIndex].valueBoolean = true;
    } else {
      extensions.push({
        url: 'http://medilink.io/fhir/StructureDefinition/read-status',
        valueBoolean: true,
      });
    }

    (message as any).extension = extensions;

    await this.fhirService.updateResource(message);

    console.log(`✅ Message ${messageId} marked as read by ${userId}`);
  }

  /**
   * Get messages by context (prescription or delivery)
   */
  async getMessagesByContext(contextType: string, contextId: string) {
    const resourceType =
      contextType === 'prescription' ? 'MedicationRequest' : 'Task';

    const communications = await this.fhirService.searchResources(
      'Communication',
      {
        subject: `${resourceType}/${contextId}`,
      },
    );

    // Decrypt all messages
    return communications.map((msg: any) => {
      const encryptedContent = msg.payload?.[0]?.contentString;
      const iv = msg.extension?.find(
        (e: any) => e.url.includes('encryption-iv'),
      )?.valueString;
      const authTag = msg.extension?.find(
        (e: any) => e.url.includes('encryption-auth-tag'),
      )?.valueString;

      let decryptedContent = '';
      if (encryptedContent && iv && authTag) {
        try {
          decryptedContent = this.encryptionService.decrypt({
            encrypted: encryptedContent,
            iv,
            authTag,
          });
        } catch (error) {
          decryptedContent = '[Decryption failed]';
        }
      }

      return {
        id: msg.id,
        senderId: this.extractUserId(msg.sender?.reference),
        content: decryptedContent,
        timestamp: msg.sent,
        senderRole: msg.extension?.find((e: any) =>
          e.url.includes('sender-role'),
        )?.valueString,
      };
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
