import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';

/**
 * Auth Service - Handles authentication logic
 * TODO: Replace with real OIDC authentication
 */
@Injectable()
export class AuthService {
  // Mock user database (replace with FHIR Patient/Practitioner lookup)
  private mockUsers = [
    { id: 'user-1', email: 'patient@test.com', password: 'demo', role: 'patient', name: 'Demo Patient' },
    { id: 'pharmacy-1', email: 'pharmacy@test.com', password: 'demo', role: 'pharmacy', name: 'Central Pharmacy' },
    { id: 'driver-1', email: 'driver@test.com', password: 'demo', role: 'delivery', name: 'Mike Driver' },
  ];

  // Mock session storage (replace with Redis)
  private sessions = new Map<string, any>();

  /**
   * Login user (DEMO - replace with OIDC)
   */
  async login(credentials: { email: string; password: string; role?: string }) {
    const user = this.mockUsers.find(u => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const sessionId = randomUUID();
    const session = {
      userId: user.id,
      role: user.role,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    };

    this.sessions.set(sessionId, session);

    console.log(`✅ User ${user.email} logged in successfully`);

    return {
      sessionId, // In production, this goes in httpOnly cookie
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    // Find and delete session
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
      }
    }

    console.log(`✅ User ${userId} logged out`);

    return { success: true };
  }

  /**
   * Validate session
   */
  async validateSession(sessionId: string) {
    const session = this.sessions.get(sessionId);

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  }
}
