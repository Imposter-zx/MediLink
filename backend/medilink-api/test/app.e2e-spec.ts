import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './../src/common/filters/http-exception.filter';

describe('MediLink E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same setup as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalFilters(new AllExceptionsFilter());

    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow (POST /api/auth/login)', () => {
    it('should successfully login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'patient@test.com',
          password: 'demo',
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('sessionId');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('patient@test.com');
          expect(res.body.user.role).toBe('patient');
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 401 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'demo',
        })
        .expect(401);
    });

    it('should return 401 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'patient@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should allow pharmacy user to login', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'pharmacy@test.com',
          password: 'demo',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.user.role).toBe('pharmacy');
        });
    });

    it('should allow delivery user to login', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'driver@test.com',
          password: 'demo',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.user.role).toBe('delivery');
        });
    });
  });

  describe('Audit Endpoints', () => {
    it('should retrieve audit logs', () => {
      return request(app.getHttpServer())
        .get('/api/audit/logs')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('logs');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.logs)).toBe(true);
        });
    });

    it('should retrieve audit logs with limit', () => {
      return request(app.getHttpServer())
        .get('/api/audit/logs?limit=5')
        .expect(200)
        .expect(res => {
          expect(res.body.logs.length).toBeLessThanOrEqual(5);
        });
    });

    it('should filter audit logs by action', () => {
      return request(app.getHttpServer())
        .get('/api/audit/logs?action=LOGIN')
        .expect(200)
        .expect(res => {
          if (res.body.logs.length > 0) {
            expect(res.body.logs[0].action).toBe('LOGIN');
          }
        });
    });

    it('should get compliance report', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

      return request(app.getHttpServer())
        .get(`/api/audit/compliance-report?startDate=${yesterday}&endDate=${tomorrow}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('totalEvents');
          expect(res.body).toHaveProperty('compliantEvents');
          expect(res.body).toHaveProperty('criticalEvents');
        });
    });

    it('should export audit logs as CSV', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

      return request(app.getHttpServer())
        .get(`/api/audit/export-csv?startDate=${yesterday}&endDate=${tomorrow}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('csv');
          expect(typeof res.body.csv).toBe('string');
          expect(res.body.csv).toContain('Timestamp');
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent route', () => {
      return request(app.getHttpServer())
        .get('/api/nonexistent')
        .expect(404);
    });

    it('should return proper error format for invalid request', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          // Missing password
        })
        .expect(res => {
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('traceId');
        });
    });

    it('should include trace ID in error responses', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'wrong',
        })
        .expect(res => {
          expect(res.body.traceId).toMatch(/^trace-/);
        });
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers in response', () => {
      return request(app.getHttpServer())
        .get('/api/audit/logs')
        .expect(res => {
          expect(res.headers['x-ratelimit-limit']).toBeDefined();
          expect(res.headers['x-ratelimit-remaining']).toBeDefined();
          expect(res.headers['x-ratelimit-reset']).toBeDefined();
        });
    });

    it('should decrement remaining requests', async () => {
      const response1 = await request(app.getHttpServer()).get('/api/audit/logs');
      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining']);

      const response2 = await request(app.getHttpServer()).get('/api/audit/logs');
      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining']);

      expect(remaining2).toBeLessThan(remaining1);
    });
  });

  describe('Multiple Request Scenarios', () => {
    it('should handle multiple concurrent requests', () => {
      const requests = Array(5)
        .fill(null)
        .map(() =>
          request(app.getHttpServer())
            .get('/api/audit/logs')
            .expect(200),
        );

      return Promise.all(requests);
    });

    it('should handle sequential authentication attempts', async () => {
      const response1 = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'patient@test.com',
          password: 'demo',
        })
        .expect(200);

      expect(response1.body).toHaveProperty('sessionId');

      const response2 = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'pharmacy@test.com',
          password: 'demo',
        })
        .expect(200);

      expect(response2.body).toHaveProperty('sessionId');
      expect(response1.body.sessionId).not.toBe(response2.body.sessionId);
    });
  });
});
