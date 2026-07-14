import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { AuditLog } from './audit.entity';

/**
 * Audit Service
 * Handles logging of all system activities for compliance
 * Implements HIPAA and FHIR Provenance requirements
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Log an audit event
   */
  async log(auditLog: Partial<AuditLog>): Promise<AuditLog> {
    const newLog = this.auditLogRepository.create({
      ...auditLog,
      timestamp: new Date(),
    });

    const savedLog = await this.auditLogRepository.save(newLog);
    console.log(`📝 [AUDIT] ${savedLog.action} - ${savedLog.resourceType}${savedLog.resourceId ? ':' + savedLog.resourceId : ''}`);

    return savedLog;
  }

  /**
   * Log successful authentication
   */
  async logLogin(userId: string, userEmail: string, userRole: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'LOGIN',
      resourceType: 'User',
      resourceId: userId,
      severity: 'INFO',
      compliant: true,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log authentication failure
   */
  async logFailedAuth(email: string, ipAddress?: string, userAgent?: string, reason?: string): Promise<void> {
    await this.log({
      userId: 'UNKNOWN',
      userEmail: email,
      userRole: 'UNKNOWN',
      action: 'FAILED_AUTH',
      resourceType: 'Auth',
      severity: 'WARNING',
      compliant: true,
      ipAddress,
      userAgent,
      description: reason,
    });
  }

  /**
   * Log logout
   */
  async logLogout(userId: string, userEmail: string, userRole: string): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'LOGOUT',
      resourceType: 'User',
      resourceId: userId,
      severity: 'INFO',
      compliant: true,
    });
  }

  /**
   * Log resource creation
   */
  async logCreate(
    userId: string,
    userEmail: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
    description?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'CREATE',
      resourceType,
      resourceId,
      description,
      metadata,
      severity: 'INFO',
      compliant: true,
    });
  }

  /**
   * Log resource read/access
   */
  async logRead(
    userId: string,
    userEmail: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'READ',
      resourceType,
      resourceId,
      severity: 'INFO',
      compliant: true,
    });
  }

  /**
   * Log resource update
   */
  async logUpdate(
    userId: string,
    userEmail: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
    changes?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'UPDATE',
      resourceType,
      resourceId,
      metadata: { changes },
      severity: 'INFO',
      compliant: true,
    });
  }

  /**
   * Log resource deletion
   */
  async logDelete(
    userId: string,
    userEmail: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
    reason?: string,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'DELETE',
      resourceType,
      resourceId,
      description: reason,
      severity: 'WARNING',
      compliant: true,
    });
  }

  /**
   * Log data export
   */
  async logExport(
    userId: string,
    userEmail: string,
    userRole: string,
    resourceType: string,
    format: string,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action: 'EXPORT',
      resourceType,
      description: `Exported as ${format}`,
      severity: 'WARNING',
      compliant: true,
    });
  }

  /**
   * Log unauthorized access attempts
   */
  async logUnauthorizedAccess(
    userId: string,
    userRole: string,
    resourceType: string,
    resourceId: string,
    reason: string,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: 'UNKNOWN',
      userRole,
      action: 'UNAUTHORIZED_ACCESS',
      resourceType,
      resourceId,
      description: reason,
      severity: 'CRITICAL',
      compliant: true,
    });
  }

  /**
   * Log encryption/decryption operations
   */
  async logEncryption(
    userId: string,
    userRole: string,
    operation: 'ENCRYPT' | 'DECRYPT',
    resourceType: string,
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: 'SYSTEM',
      userRole,
      action: operation,
      resourceType,
      severity: 'INFO',
      compliant: true,
    });
  }

  /**
   * Get audit logs with filtering
   */
  async getLogs(filter: {
    userId?: string;
    action?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const where: any = {};

    if (filter.userId) {
      where.userId = filter.userId;
    }

    if (filter.action) {
      where.action = filter.action;
    }

    if (filter.resourceType) {
      where.resourceType = filter.resourceType;
    }

    if (filter.startDate || filter.endDate) {
      where.timestamp = Between(
        filter.startDate || new Date(0),
        filter.endDate || new Date(),
      );
    }

    const [logs, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      take: filter.limit || 100,
      skip: filter.offset || 0,
    });

    return {
      logs,
      total,
    };
  }

  /**
   * Get audit logs by user
   */
  async getLogsByUser(userId: string, limit = 100): Promise<AuditLog[]> {
    const { logs } = await this.getLogs({ userId, limit });
    return logs;
  }

  /**
   * Get audit logs by action
   */
  async getLogsByAction(action: string, limit = 100): Promise<AuditLog[]> {
    const { logs } = await this.getLogs({ action, limit });
    return logs;
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(startDate: Date, endDate: Date): Promise<{
    totalEvents: number;
    compliantEvents: number;
    nonCompliantEvents: number;
    criticalEvents: number;
    breaches: AuditLog[];
    unauthorizedAccess: AuditLog[];
  }> {
    const { logs } = await this.getLogs({ startDate, endDate, limit: 10000 });

    return {
      totalEvents: logs.length,
      compliantEvents: logs.filter(l => l.compliant).length,
      nonCompliantEvents: logs.filter(l => !l.compliant).length,
      criticalEvents: logs.filter(l => l.severity === 'CRITICAL').length,
      breaches: logs.filter(l => l.action === 'DATA_BREACH'),
      unauthorizedAccess: logs.filter(l => l.action === 'UNAUTHORIZED_ACCESS'),
    };
  }

  /**
   * Export audit logs as CSV
   */
  async exportAsCsv(startDate: Date, endDate: Date): Promise<string> {
    const { logs } = await this.getLogs({ startDate, endDate, limit: 100000 });

    const headers = ['Timestamp', 'User ID', 'Email', 'Role', 'Action', 'Resource Type', 'Resource ID', 'Severity', 'Compliant'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userId,
      log.userEmail,
      log.userRole,
      log.action,
      log.resourceType,
      log.resourceId || '-',
      log.severity,
      log.compliant ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    return csv;
  }

  /**
   * Clear old audit logs (retention policy)
   */
  async clearOldLogs(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deleteResult = await this.auditLogRepository.delete({
      timestamp: LessThan(cutoffDate),
    });

    return deleteResult.affected || 0;
  }
}
