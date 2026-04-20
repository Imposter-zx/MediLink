import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ENCRYPTION_KEY') {
                return 'a'.repeat(64); // 32 bytes as hex
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt plain text and return encrypted data with iv and authTag', () => {
      const plainText = 'sensitive patient data';
      const result = service.encrypt(plainText);

      expect(result).toHaveProperty('encrypted');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('authTag');
      expect(result.encrypted).not.toBe(plainText);
      expect(result.encrypted.length).toBeGreaterThan(0);
    });

    it('should produce different ciphertexts for same plaintext (due to random IV)', () => {
      const plainText = 'test data';
      const result1 = service.encrypt(plainText);
      const result2 = service.encrypt(plainText);

      expect(result1.encrypted).not.toBe(result2.encrypted);
      expect(result1.iv).not.toBe(result2.iv);
    });

    it('should handle empty strings', () => {
      const result = service.encrypt('');
      expect(result.encrypted).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(result.authTag).toBeDefined();
    });

    it('should handle long text', () => {
      const longText = 'a'.repeat(10000);
      const result = service.encrypt(longText);
      expect(result.encrypted).toBeDefined();
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const result = service.encrypt(specialText);
      expect(result.encrypted).toBeDefined();
    });

    it('should handle unicode characters', () => {
      const unicodeText = '你好世界🌍مرحبا';
      const result = service.encrypt(unicodeText);
      expect(result.encrypted).toBeDefined();
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted data back to original plaintext', () => {
      const plainText = 'sensitive medical information';
      const encrypted = service.encrypt(plainText);
      const decrypted = service.decrypt(encrypted);

      expect(decrypted).toBe(plainText);
    });

    it('should fail with tampered authTag', () => {
      const plainText = 'test data';
      const encrypted = service.encrypt(plainText);
      encrypted.authTag = 'a'.repeat(32); // Tamper with auth tag

      expect(() => service.decrypt(encrypted)).toThrow();
    });

    it('should fail with tampered ciphertext', () => {
      const plainText = 'test data';
      const encrypted = service.encrypt(plainText);
      encrypted.encrypted = encrypted.encrypted.slice(0, -2) + 'XX'; // Tamper with ciphertext

      expect(() => service.decrypt(encrypted)).toThrow();
    });

    it('should fail with incorrect IV length', () => {
      const encrypted = {
        encrypted: 'abcd',
        iv: 'short',
        authTag: 'a'.repeat(32),
      };

      expect(() => service.decrypt(encrypted)).toThrow();
    });
  });

  describe('round-trip encryption/decryption', () => {
    const testCases = [
      'simple text',
      'text with numbers 123456',
      'text@with$special#chars',
      'Lorem ipsum dolor sit amet',
      'Multi\nline\ntext',
      JSON.stringify({ userId: '123', role: 'patient' }),
    ];

    testCases.forEach(plainText => {
      it(`should correctly encrypt and decrypt: "${plainText.substring(0, 30)}..."`, () => {
        const encrypted = service.encrypt(plainText);
        const decrypted = service.decrypt(encrypted);
        expect(decrypted).toBe(plainText);
      });
    });
  });
});
