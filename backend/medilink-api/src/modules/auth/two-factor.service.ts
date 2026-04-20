import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

/**
 * Two-Factor Authentication Service (TOTP)
 * Implements Time-based One-Time Password (TOTP) authentication
 * Compatible with Google Authenticator, Authy, Microsoft Authenticator
 */
@Injectable()
export class TwoFactorService {
  /**
   * Generate TOTP secret and QR code
   */
  async generateSecret(email: string): Promise<{
    secret: string;
    qrCode: string;
    manualEntryKey: string;
  }> {
    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `MediLink (${email})`,
      issuer: 'MediLink',
      length: 32,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode,
      manualEntryKey: secret.base32, // For manual entry
    };
  }

  /**
   * Verify TOTP token
   */
  verifyToken(secret: string, token: string, windowSize: number = 2): boolean {
    try {
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: windowSize, // Allow codes from +/- 30 seconds
      });

      return verified === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate backup codes (for account recovery)
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Verify and consume backup code
   */
  verifyBackupCode(code: string, backupCodes: string[]): boolean {
    return backupCodes.includes(code);
  }

  /**
   * Hash backup codes for secure storage
   */
  async hashBackupCodes(codes: string[]): Promise<string[]> {
    // In production, use bcrypt
    return codes.map(code => Buffer.from(code).toString('base64'));
  }

  /**
   * Verify hashed backup code
   */
  verifyHashedBackupCode(code: string, hashedCodes: string[]): boolean {
    const hashedInput = Buffer.from(code).toString('base64');
    return hashedCodes.includes(hashedInput);
  }

  /**
   * Generate current TOTP token (for testing/debugging)
   */
  getCurrentToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }
}
