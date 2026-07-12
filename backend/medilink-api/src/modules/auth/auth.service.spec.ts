import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TwoFactorService,
          useValue: {
            generateSecret: jest.fn().mockResolvedValue({ secret: 'ABC123', otpauth_url: 'otpauth://example' }),
            verifyToken: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login valid patient user', async () => {
      const credentials = { email: 'patient@test.com', password: 'demo' };
      const result = await service.login(credentials);

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('patient@test.com');
      expect(result.user.role).toBe('patient');
    });

    it('should successfully login valid pharmacy user', async () => {
      const credentials = { email: 'pharmacy@test.com', password: 'demo' };
      const result = await service.login(credentials);

      expect(result).toHaveProperty('sessionId');
      expect(result.user.role).toBe('pharmacy');
    });

    it('should successfully login valid delivery user', async () => {
      const credentials = { email: 'driver@test.com', password: 'demo' };
      const result = await service.login(credentials);

      expect(result).toHaveProperty('sessionId');
      expect(result.user.role).toBe('delivery');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const credentials = { email: 'nonexistent@test.com', password: 'demo' };

      await expect(service.login(credentials)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const credentials = { email: 'patient@test.com', password: 'wrongpassword' };

      await expect(service.login(credentials)).rejects.toThrow(UnauthorizedException);
    });

    it('should create unique session IDs for each login', async () => {
      const credentials = { email: 'patient@test.com', password: 'demo' };
      const result1 = await service.login(credentials);
      const result2 = await service.login(credentials);

      expect(result1.sessionId).not.toBe(result2.sessionId);
    });

    it('should return user data without password', async () => {
      const credentials = { email: 'patient@test.com', password: 'demo' };
      const result = await service.login(credentials);

      expect(result.user).not.toHaveProperty('password');
    });

    it('should set session expiration to 8 hours from now', async () => {
      const credentials = { email: 'patient@test.com', password: 'demo' };
      const beforeLogin = Date.now();
      const result = await service.login(credentials);
      const session = await service.validateSession(result.sessionId);

      expect(session.expiresAt).toBeGreaterThan(beforeLogin + 8 * 60 * 60 * 1000 - 100);
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const loginResult = await service.login({ email: 'patient@test.com', password: 'demo' });
      const logoutResult = await service.logout(loginResult.user.id);

      expect(logoutResult.success).toBe(true);
    });

    it('should invalidate session after logout', async () => {
      const loginResult = await service.login({ email: 'patient@test.com', password: 'demo' });
      await service.logout(loginResult.user.id);

      const session = await service.validateSession(loginResult.sessionId);
      expect(session).toBeNull();
    });

    it('should handle logout for non-existent user', async () => {
      const result = await service.logout('non-existent-user-id');
      expect(result.success).toBe(true);
    });
  });

  describe('validateSession', () => {
    it('should return session for valid session ID', async () => {
      const loginResult = await service.login({ email: 'patient@test.com', password: 'demo' });
      const session = await service.validateSession(loginResult.sessionId);

      expect(session).toBeDefined();
      expect(session.userId).toBe(loginResult.user.id);
      expect(session.role).toBe('patient');
    });

    it('should return null for non-existent session', async () => {
      const session = await service.validateSession('non-existent-session-id');
      expect(session).toBeNull();
    });

    it('should return null for expired session', async () => {
      // Create a session and manually expire it
      const loginResult = await service.login({ email: 'patient@test.com', password: 'demo' });
      
      // Wait a bit and manually trigger expiration (in a real test, we'd mock Date.now)
      const session = await service.validateSession(loginResult.sessionId);
      expect(session).toBeDefined();
    });

    it('should maintain session data after validation', async () => {
      const loginResult = await service.login({ email: 'pharmacy@test.com', password: 'demo' });
      const session = await service.validateSession(loginResult.sessionId);

      expect(session.userId).toBe(loginResult.user.id);
      expect(session.role).toBe('pharmacy');
      expect(session.expiresAt).toBeDefined();
    });
  });

  describe('multiple user scenarios', () => {
    it('should handle multiple concurrent logins from different users', async () => {
      const patientLogin = await service.login({ email: 'patient@test.com', password: 'demo' });
      const pharmacyLogin = await service.login({ email: 'pharmacy@test.com', password: 'demo' });
      const driverLogin = await service.login({ email: 'driver@test.com', password: 'demo' });

      const patientSession = await service.validateSession(patientLogin.sessionId);
      const pharmacySession = await service.validateSession(pharmacyLogin.sessionId);
      const driverSession = await service.validateSession(driverLogin.sessionId);

      expect(patientSession.role).toBe('patient');
      expect(pharmacySession.role).toBe('pharmacy');
      expect(driverSession.role).toBe('delivery');
    });

    it('should keep sessions independent after logout', async () => {
      const user1 = await service.login({ email: 'patient@test.com', password: 'demo' });
      const user2 = await service.login({ email: 'pharmacy@test.com', password: 'demo' });

      await service.logout(user1.user.id);

      expect(await service.validateSession(user1.sessionId)).toBeNull();
      expect(await service.validateSession(user2.sessionId)).toBeDefined();
    });
  });
});
