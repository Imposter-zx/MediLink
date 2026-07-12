/**
 * Session data stored in Redis
 */
export interface SessionData {
  userId: string;
  role: 'patient' | 'pharmacy' | 'delivery' | 'doctor';
  organizationId?: string; // For pharmacy/delivery organizations
  email?: string;
  name?: string;
  expiresAt: number;
}

/**
 * User authentication data
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
}
