import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, CipherGCM, DecipherGCM } from 'crypto';

interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Encryption Service for PHI Protection
 * Uses AES-256-GCM for authenticated encryption
 */
@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor(private configService: ConfigService) {
    const encryptionKey = this.configService.get('ENCRYPTION_KEY');
    
    if (!encryptionKey) {
      console.warn('⚠️  ENCRYPTION_KEY not set - generating temporary key');
      this.key = randomBytes(32);
    } else {
      this.key = Buffer.from(encryptionKey, 'hex');
    }
  }

  /**
   * Encrypt text (for PHI data)
   */
  encrypt(text: string): EncryptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv) as CipherGCM;

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypt text
   */
  decrypt(data: EncryptedData): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(data.iv, 'hex'),
    ) as DecipherGCM;

    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));

    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Generate a secure random key (32 bytes for AES-256)
   */
  static generateKey(): string {
    return randomBytes(32).toString('hex');
  }
}
