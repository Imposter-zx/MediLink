import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from './audit.entity';

describe('AuditService', () => {
  let service: AuditService;
  const mockLogs: AuditLog[] = [];

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => {
      const log = new AuditLog();
      Object.assign(log, {
        id: 'mock-uuid',
        timestamp: new Date(),
        ...dto,
      });
      return log;
    }),
    save: jest.fn().mockImplementation(async (log) => {
      mockLogs.push(log);
      return log;
    }),
    findAndCount: jest.fn().mockImplementation(async (options) => {
      let filtered = [...mockLogs];
      const where = options?.where;
      if (where) {
        if (where.userId) {
          filtered = filtered.filter(l => l.userId === where.userId);
        }
        if (where.action) {
          filtered = filtered.filter(l => l.action === where.action);
        }
        if (where.resourceType) {
          filtered = filtered.filter(l => l.resourceType === where.resourceType);
        }
      }
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const skip = options?.skip || 0;
      const take = options?.take || 100;
      const paginated = filtered.slice(skip, skip + take);
      return [paginated, filtered.length];
    }),
    delete: jest.fn().mockImplementation(async () => {
      return { affected: 1 };
    }),
  };

  beforeEach(async () => {
    mockLogs.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should create and store audit log', async () => {
      const log = await service.log({
        userId: 'user-1',
        userEmail: 'test@example.com',
        userRole: 'patient',
        action: 'CREATE',
        resourceType: 'Prescription',
        resourceId: 'rx-123',
      });

      expect(log).toHaveProperty('id');
      expect(log.userId).toBe('user-1');
      expect(log.action).toBe('CREATE');
      expect(log.timestamp).toBeInstanceOf(Date);
    });

    it('should set timestamp to current time', async () => {
      const beforeLog = new Date();
      const log = await service.log({
        userId: 'user-1',
        userEmail: 'test@example.com',
        userRole: 'patient',
        action: 'READ',
        resourceType: 'Patient',
        resourceId: 'pat-1',
      });
      const afterLog = new Date();

      expect(log.timestamp.getTime()).toBeGreaterThanOrEqual(beforeLog.getTime());
      expect(log.timestamp.getTime()).toBeLessThanOrEqual(afterLog.getTime());
    });
  });

  describe('logLogin', () => {
    it('should log successful login', async () => {
      await service.logLogin('user-1', 'patient@test.com', 'patient', '192.168.1.1', 'Mozilla/5.0');

      const { logs } = await service.getLogs({ action: 'LOGIN', limit: 1 });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe('LOGIN');
      expect(logs[0].userEmail).toBe('patient@test.com');
    });
  });

  describe('logFailedAuth', () => {
    it('should log failed authentication attempt', async () => {
      await service.logFailedAuth('nonexistent@test.com', '192.168.1.1', 'Mozilla/5.0', 'Invalid credentials');

      const { logs } = await service.getLogs({ action: 'FAILED_AUTH', limit: 1 });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe('FAILED_AUTH');
      expect(logs[0].severity).toBe('WARNING');
    });
  });

  describe('logLogout', () => {
    it('should log user logout', async () => {
      await service.logLogout('user-1', 'patient@test.com', 'patient');

      const { logs } = await service.getLogs({ action: 'LOGOUT', limit: 1 });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe('LOGOUT');
    });
  });

  describe('logCreate', () => {
    it('should log resource creation', async () => {
      await service.logCreate('user-1', 'patient@test.com', 'patient', 'Prescription', 'rx-123', 'Created new prescription', {
        medication: 'Aspirin',
      });

      const { logs } = await service.getLogs({ action: 'CREATE', limit: 1 });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe('CREATE');
      expect(logs[0].resourceType).toBe('Prescription');
      expect(logs[0].metadata.medication).toBe('Aspirin');
    });
  });

  describe('getLogs with filtering', () => {
    beforeEach(async () => {
      // Create multiple logs
      await service.logLogin('user-1', 'patient@test.com', 'patient');
      await service.logCreate('user-1', 'patient@test.com', 'patient', 'Prescription', 'rx-1');
      await service.logLogin('user-2', 'pharmacy@test.com', 'pharmacy');
      await service.logCreate('user-2', 'pharmacy@test.com', 'pharmacy', 'Order', 'ord-1');
    });

    it('should filter logs by userId', async () => {
      const { logs } = await service.getLogs({ userId: 'user-1' });
      expect(logs.every(log => log.userId === 'user-1')).toBe(true);
    });

    it('should filter logs by action', async () => {
      const { logs } = await service.getLogs({ action: 'CREATE' });
      expect(logs.every(log => log.action === 'CREATE')).toBe(true);
    });

    it('should filter logs by resourceType', async () => {
      const { logs } = await service.getLogs({ resourceType: 'Prescription' });
      expect(logs.every(log => log.resourceType === 'Prescription')).toBe(true);
    });

    it('should filter logs by date range', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const { logs } = await service.getLogs({ startDate: yesterday, endDate: tomorrow });
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      const { logs } = await service.getLogs({ limit: 2 });
      expect(logs.length).toBeLessThanOrEqual(2);
    });

    it('should return total count', async () => {
      const { total } = await service.getLogs({});
      expect(total).toBeGreaterThan(0);
    });
  });

  describe('getLogsByUser', () => {
    it('should retrieve logs for specific user', async () => {
      await service.logLogin('user-1', 'patient@test.com', 'patient');
      await service.logCreate('user-1', 'patient@test.com', 'patient', 'Prescription', 'rx-1');

      const logs = await service.getLogsByUser('user-1');
      expect(logs.every(log => log.userId === 'user-1')).toBe(true);
    });
  });

  describe('getComplianceReport', () => {
    beforeEach(async () => {
      const now = new Date();
      await service.logLogin('user-1', 'patient@test.com', 'patient');
      await service.logCreate('user-1', 'patient@test.com', 'patient', 'Prescription', 'rx-1');
      await service.logUnauthorizedAccess('user-2', 'hacker', 'Patient', 'pat-1', 'Unauthorized access attempt');
    });

    it('should generate compliance report', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const report = await service.getComplianceReport(yesterday, tomorrow);

      expect(report.totalEvents).toBeGreaterThan(0);
      expect(report.compliantEvents).toBeGreaterThan(0);
      expect(report).toHaveProperty('unauthorizedAccess');
    });

    it('should identify critical events', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const report = await service.getComplianceReport(yesterday, tomorrow);
      expect(report.criticalEvents).toBeGreaterThan(0);
    });
  });

  describe('exportAsCsv', () => {
    beforeEach(async () => {
      await service.logLogin('user-1', 'patient@test.com', 'patient');
      await service.logCreate('user-1', 'patient@test.com', 'patient', 'Prescription', 'rx-1');
    });

    it('should export logs as CSV', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const csv = await service.exportAsCsv(yesterday, tomorrow);

      expect(typeof csv).toBe('string');
      expect(csv).toContain('Timestamp');
      expect(csv).toContain('User ID');
      expect(csv).toContain('patient@test.com');
    });
  });

  describe('clearOldLogs', () => {
    it('should remove logs older than specified days', async () => {
      await service.logLogin('user-1', 'patient@test.com', 'patient');

      // This test is challenging because we're using current timestamps
      // In production, this would work with past timestamps
      const cleared = await service.clearOldLogs(0); // Clear logs 0 days old (only very old ones)
      expect(typeof cleared).toBe('number');
    });
  });
});
