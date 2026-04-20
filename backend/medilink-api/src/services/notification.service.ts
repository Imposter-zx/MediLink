import { Injectable } from '@nestjs/common';

/**
 * Notification types
 */
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

/**
 * Notification template
 */
export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  subject?: string; // For email
  template: string; // HTML/Text template
  variables: string[]; // Template variables
}

/**
 * Notification message
 */
export interface NotificationMessage {
  id: string;
  userId: string;
  type: NotificationType;
  recipient: string; // Email or phone number
  templateId: string;
  variables: Record<string, string>;
  subject?: string;
  body: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

/**
 * Notification Service
 * Manages email, SMS, push, and in-app notifications
 */
@Injectable()
export class NotificationService {
  private messages: Map<string, NotificationMessage> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private userPreferences: Map<string, NotificationPreferences> = new Map();

  // Initialize default templates
  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize default notification templates
   */
  private initializeTemplates(): void {
    const templates: NotificationTemplate[] = [
      {
        id: 'refill-approved',
        type: NotificationType.EMAIL,
        name: 'Refill Approved',
        subject: 'Your prescription refill has been approved',
        template: '<p>Hello {{name}},</p><p>Your refill for {{medication}} has been approved by {{pharmacy}}.</p>',
        variables: ['name', 'medication', 'pharmacy'],
      },
      {
        id: 'refill-ready',
        type: NotificationType.SMS,
        name: 'Refill Ready for Pickup',
        template: 'Hi {{name}}, your prescription {{medication}} is ready for pickup at {{pharmacy}}. Confirmation: {{code}}',
        variables: ['name', 'medication', 'pharmacy', 'code'],
      },
      {
        id: 'delivery-on-way',
        type: NotificationType.PUSH,
        name: 'Delivery On The Way',
        subject: 'Your delivery is on the way',
        template: 'Your prescription delivery from {{pharmacy}} is on the way. Driver: {{driver}}, ETA: {{eta}}',
        variables: ['pharmacy', 'driver', 'eta'],
      },
      {
        id: 'delivery-delivered',
        type: NotificationType.EMAIL,
        name: 'Delivery Completed',
        subject: 'Your prescription has been delivered',
        template: '<p>Your order has been delivered on {{date}} at {{time}}. Delivered by: {{driver}}</p>',
        variables: ['date', 'time', 'driver'],
      },
      {
        id: 'low-stock-warning',
        type: NotificationType.SMS,
        name: 'Low Stock Warning',
        template: 'Reminder: Your medication {{medication}} is running low. Refill now?',
        variables: ['medication'],
      },
    ];

    templates.forEach(t => this.templates.set(t.id, t));
  }

  /**
   * Send notification
   */
  async sendNotification(
    userId: string,
    recipient: string,
    type: NotificationType,
    templateId: string,
    variables: Record<string, string>,
  ): Promise<NotificationMessage> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const body = this.renderTemplate(template.template, variables);

    const message: NotificationMessage = {
      id: messageId,
      userId,
      type,
      recipient,
      templateId,
      variables,
      subject: template.subject,
      body,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.messages.set(messageId, message);

    // Simulate sending in background
    this.processNotification(message);

    console.log(`📬 Notification queued: ${type} to ${recipient}`);
    return message;
  }

  /**
   * Send email notification
   */
  async sendEmail(userId: string, to: string, subject: string, html: string): Promise<NotificationMessage> {
    const messageId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const message: NotificationMessage = {
      id: messageId,
      userId,
      type: NotificationType.EMAIL,
      recipient: to,
      templateId: 'custom',
      variables: {},
      subject,
      body: html,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.messages.set(messageId, message);
    this.processNotification(message);

    console.log(`📧 Email queued to: ${to}`);
    return message;
  }

  /**
   * Send SMS notification
   */
  async sendSMS(userId: string, phoneNumber: string, message: string): Promise<NotificationMessage> {
    const messageId = `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notification: NotificationMessage = {
      id: messageId,
      userId,
      type: NotificationType.SMS,
      recipient: phoneNumber,
      templateId: 'custom',
      variables: {},
      body: message,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.messages.set(messageId, notification);
    this.processNotification(notification);

    console.log(`📱 SMS queued to: ${phoneNumber}`);
    return notification;
  }

  /**
   * Send push notification
   */
  async sendPushNotification(userId: string, title: string, message: string): Promise<NotificationMessage> {
    const messageId = `push-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notification: NotificationMessage = {
      id: messageId,
      userId,
      type: NotificationType.PUSH,
      recipient: userId,
      templateId: 'custom',
      variables: {},
      subject: title,
      body: message,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.messages.set(messageId, notification);
    this.processNotification(notification);

    console.log(`🔔 Push notification queued for user: ${userId}`);
    return notification;
  }

  /**
   * Send in-app notification
   */
  async sendInAppNotification(userId: string, title: string, message: string): Promise<NotificationMessage> {
    const messageId = `inapp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notification: NotificationMessage = {
      id: messageId,
      userId,
      type: NotificationType.IN_APP,
      recipient: userId,
      templateId: 'custom',
      variables: {},
      subject: title,
      body: message,
      status: 'DELIVERED',
      createdAt: new Date(),
      deliveredAt: new Date(),
    };

    this.messages.set(messageId, notification);
    console.log(`💬 In-app notification sent to user: ${userId}`);
    return notification;
  }

  /**
   * Get notification by ID
   */
  async getNotification(messageId: string): Promise<NotificationMessage | null> {
    return this.messages.get(messageId) || null;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50): Promise<NotificationMessage[]> {
    return Array.from(this.messages.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get notification templates
   */
  async getTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.templates.values());
  }

  /**
   * Create custom template
   */
  async createTemplate(
    name: string,
    type: NotificationType,
    template: string,
    variables: string[],
    subject?: string,
  ): Promise<NotificationTemplate> {
    const id = `tpl-${Date.now()}`;

    const newTemplate: NotificationTemplate = {
      id,
      name,
      type,
      template,
      variables,
      subject,
    };

    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  /**
   * Set user notification preferences
   */
  async setUserPreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    this.userPreferences.set(userId, preferences);
    console.log(`⚙️ Updated notification preferences for user: ${userId}`);
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    return (
      this.userPreferences.get(userId) || {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        refillNotifications: true,
        deliveryUpdates: true,
        promotionalEmails: false,
        weeklyDigest: false,
        quietHoursStart: null,
        quietHoursEnd: null,
      }
    );
  }

  /**
   * Mark notification as delivered
   */
  async markAsDelivered(messageId: string): Promise<NotificationMessage | null> {
    const message = this.messages.get(messageId);
    if (message) {
      message.status = 'DELIVERED';
      message.deliveredAt = new Date();
      this.messages.set(messageId, message);
    }
    return message || null;
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    byType: Record<string, number>;
  }> {
    const userMessages = Array.from(this.messages.values()).filter(m => m.userId === userId);

    const stats = {
      total: userMessages.length,
      sent: userMessages.filter(m => m.status === 'SENT').length,
      failed: userMessages.filter(m => m.status === 'FAILED').length,
      pending: userMessages.filter(m => m.status === 'PENDING').length,
      byType: {} as Record<string, number>,
    };

    userMessages.forEach(m => {
      stats.byType[m.type] = (stats.byType[m.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Render template with variables
   */
  private renderTemplate(template: string, variables: Record<string, string>): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }

    return rendered;
  }

  /**
   * Process notification (simulate sending)
   */
  private async processNotification(message: NotificationMessage): Promise<void> {
    // Simulate async processing
    setTimeout(() => {
      message.status = 'SENT';
      message.sentAt = new Date();

      // Simulate delivery (90% success rate)
      if (Math.random() > 0.1) {
        message.status = 'DELIVERED';
        message.deliveredAt = new Date();
      } else {
        message.status = 'FAILED';
        message.error = 'Delivery failed - recipient unreachable';
      }

      console.log(`✅ Notification processed: ${message.id} - ${message.status}`);
    }, 1000);
  }
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  refillNotifications: boolean;
  deliveryUpdates: boolean;
  promotionalEmails: boolean;
  weeklyDigest: boolean;
  quietHoursStart: string | null; // HH:MM format
  quietHoursEnd: string | null;
}
