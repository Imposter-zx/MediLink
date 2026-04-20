import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLog } from './audit.entity';

@Controller('api/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Get audit logs with filtering
   */
  @Get('logs')
  @HttpCode(HttpStatus.OK)
  async getLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('resourceType') resourceType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ logs: AuditLog[]; total: number }> {
    return this.auditService.getLogs({
      userId,
      action,
      resourceType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit || 100,
      offset: offset || 0,
    });
  }

  /**
   * Get audit logs for a specific user
   */
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getLogsByUser(@Query('userId') userId: string, @Query('limit') limit?: number): Promise<AuditLog[]> {
    return this.auditService.getLogsByUser(userId, limit || 100);
  }

  /**
   * Get audit logs by action type
   */
  @Get('action')
  @HttpCode(HttpStatus.OK)
  async getLogsByAction(@Query('action') action: string, @Query('limit') limit?: number): Promise<AuditLog[]> {
    return this.auditService.getLogsByAction(action, limit || 100);
  }

  /**
   * Get compliance report for a date range
   */
  @Get('compliance-report')
  @HttpCode(HttpStatus.OK)
  async getComplianceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{
    totalEvents: number;
    compliantEvents: number;
    nonCompliantEvents: number;
    criticalEvents: number;
    breaches: AuditLog[];
    unauthorizedAccess: AuditLog[];
  }> {
    return this.auditService.getComplianceReport(new Date(startDate), new Date(endDate));
  }

  /**
   * Export audit logs as CSV
   */
  @Get('export-csv')
  @HttpCode(HttpStatus.OK)
  async exportAsCsv(@Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<{ csv: string }> {
    const csv = await this.auditService.exportAsCsv(new Date(startDate), new Date(endDate));
    return { csv };
  }
}
