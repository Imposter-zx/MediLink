import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TwoFactorService } from './two-factor.service';
import type { SessionData } from '../../common/types/session.types';

/**
 * Auth Service - Handles authentication logic
 * TODO: Replace with real OIDC authentication
 */
@Injectable()
export class AuthService {
  // Mock user database (replace with FHIR Patient/Practitioner lookup)
  private mockUsers = [
    {
      id: 'user-1',
      email: 'patient@test.com',
      password: 'demo',
      role: 'patient',
      name: 'Demo Patient',
    },
    {
      id: 'pharmacy-1',
      email: 'pharmacy@test.com',
      password: 'demo',
      role: 'pharmacy',
      name: 'Central Pharmacy',
      organizationId: 'pharmacy-1',
    },
    {
      id: 'driver-1',
      email: 'driver@test.com',
      password: 'demo',
      role: 'delivery',
      name: 'Mike Driver',
      organizationId: 'delivery-1',
    },
    {
      id: 'doctor-1',
      email: 'doctor@test.com',
      password: 'demo',
      role: 'doctor',
      name: 'Dr. Jane Smith',
      organizationId: 'clinic-1',
    },
  ];

  private twoFactorData = new Map<
    string,
    { secret: string; backupCodes: string[] }
  >();

  private sessions = new Map<string, SessionData>();

  constructor(private readonly twoFactorService: TwoFactorService) {}

  async login(credentials: { email: string; password: string; role?: string }) {
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = randomUUID();
    const session: SessionData = {
      userId: user.id,
      role: user.role as SessionData['role'],
      organizationId: user.organizationId,
      email: user.email,
      name: user.name,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    };

    this.sessions.set(sessionId, session);

    console.log(`✅ User ${user.email} logged in successfully`);

    return {
      sessionId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async logout(userId: string) {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
      }
    }

    console.log(`✅ User ${userId} logged out`);
    return { success: true };
  }

  async findUserByEmail(email: string) {
    return this.mockUsers.find((user) => user.email === email) || null;
  }

  async findUserById(id: string) {
    return this.mockUsers.find((user) => user.id === id) || null;
  }

  async validateSession(sessionId: string) {
    const session = this.sessions.get(sessionId);

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  }

  async generateTwoFactorSecret(email: string) {
    return this.twoFactorService.generateSecret(email);
  }

  async enableTwoFactor(userId: string, secret: string, backupCodes: string[]) {
    this.twoFactorData.set(userId, { secret, backupCodes });
  }

  async verifyTwoFactorToken(userId: string, token: string) {
    const data = this.twoFactorData.get(userId);
    if (!data) {
      throw new NotFoundException('Two-factor authentication is not configured for this user');
    }

    return this.twoFactorService.verifyToken(data.secret, token);
  }

  async getTwoFactorData(userId: string) {
    return this.twoFactorData.get(userId) || null;
  }

  async verifyTokenWithSecret(secret: string, token: string): Promise<boolean> {
    return this.twoFactorService.verifyToken(secret, token);
  }
}
